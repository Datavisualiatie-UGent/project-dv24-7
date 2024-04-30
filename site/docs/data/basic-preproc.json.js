import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {filter_years, cards_per_set, get_color_by_code} from "../components/utils.js";

//region constants/utility
const url_pre = '../../scraper/out/';

const exclude_always = [ 'minigame', 'token', 'promo', 'memorabilia', 'treasure_chest', 'vanguard' ];

const exclude_between = [
    'alchemy', 'archenemy', 'duel_deck', 'from_the_vault', 'funny',
    'masterpiece', 'memorabilia', 'minigame', 'premium_deck', 'promo',
    'spellbook', 'token', 'treasure_chest', 'vanguard'
];

const add_date_sort = (sets) => {
    return sets.map(set => {
        return { ... set, release: new Date(set.released_at) }
    }).sort((a, b) => a.release - b.release);
};

const exclude = (sets) => {
    return sets.filter(set =>
        set.parent_set_code === undefined && !exclude_between.includes(set.set_type)
    );
};
//endregion

//region raw data loading
const loaded = await readFile(fileURLToPath(import.meta.resolve(`${url_pre}sets.json`)));
const sets_raw = add_date_sort(JSON.parse(loaded).data)
    .filter(set => !exclude_always.includes(set.set_type));

const sets_filtered = exclude(sets_raw);

const set_kinds = [...new Set(sets_raw.map(set => set.set_type))];

const load_cards = async () => {
    const cards = {};
    await Promise.all(sets_raw.map(async set => {
        cards[set.code] = JSON.parse(
            await readFile(fileURLToPath(import.meta.resolve(`${url_pre}${set.code}.json`)), 'utf-8')
        );
    }));
    return cards;
}

const cards = await load_cards();
//endregion

//region timing data
const diff_months = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

const set_release_time = sets_filtered.map((v, i) => {
    return {
        ...v,
        idx: i,
        diff: i === 0 ? 0 : diff_months(sets_filtered[i - 1].release, v.release)
    };
});

const year_to_avg = [];
const per_year = [];
for(let i = sets_filtered[0].release.getFullYear(); i <= sets_filtered.at(-1).release.getFullYear(); i++) {
    const year_sets = set_release_time.filter(set => set.release.getFullYear() === i);
    year_to_avg.push({
        year: i,
        avg: year_sets.reduce((acc, set) => acc + set.diff, 0) / year_sets.length
    });
    per_year.push({ year: i, count: year_sets.length });
}
//endregion

//region complexity data
const complexity_by_kind = {};
set_kinds.forEach(kind => complexity_by_kind[kind] = []);

const complexity_raw = sets_filtered.map(set => {
    const c = cards[set.code].flat().map(card => {
        if(card.card_faces != null) {
            let text_len = 0;
            card.card_faces.forEach(face => text_len += face.oracle_text.split(' ').length);
            return {...card, oracle_text: text_len};
        }
        else if(card.oracle_text == null) {
            return {...card, oracle_text: 0};
        }
        return {...card, oracle_text: card.oracle_text.split(' ').length};
    });

    const avg = c.reduce((acc, card) => acc + card.oracle_text, 0) / c.length;

    complexity_by_kind[set.set_type].push({
        name: set.name,
        code: set.code,
        release: set.release,
        avg: avg,
        type: set.set_type
    });

    return {
        name: set.name,
        code: set.code,
        release: set.release,
        avg: avg
    }
});
//endregion

//region color distribution
const color_fn = (subset, year, cards) => {
    const counts = { colorless: 0, green: 0, red: 0, black: 0, blue: 0, white: 0, mixed: 0 };

    const card_col = [];
    let cards_set = 0;
    subset.forEach(set => {
        const cards_ = cards[set.code].flat()
            .filter(card => card.colors != null)
            .map(card => card.colors);
        const faces = cards[set.code].flat()
            .filter(card => card.colors == null)
            .map(card => card.card_faces);

        faces.forEach(f => {
            const f_col = f.map(face => face.colors).flat();
            cards_.push(f_col.filter((v, i, a) => a.indexOf(v) === i));
        });

        cards_set += cards_per_set(cards_);

        cards_.forEach(col => {
            if(col.length === 0) counts.colorless++;
            else if(col.length === 1) counts[get_color_by_code(col[0])]++;
            else counts.mixed++;
        });
    });

    Object.keys(counts).forEach(k => {
        card_col.push({
            year: year, color: k, color_count: counts[k] / cards_set, map: counts, total: cards_set
        });
    });
    return card_col;
};

const rarity_fn = (subset, year, cards) => {
    const counts = { common: 0, uncommon: 0, rare: 0, mythic: 0 };

    const card_col = [];
    let cards_set = 0;
    subset.forEach(set => {
        const cards_ = cards[set.code].flat()
            .map(card => card.rarity);

        cards_set += cards_per_set(cards_);

        cards_.forEach(r => {
            counts[r]++;
        });
    });

    Object.keys(counts).forEach(k => {
        card_col.push({
            year: year, rarity: k, rarity_count: counts[k] / cards_set, map: counts, total: cards_set
        });
    });
    return card_col;
}

const reprint_new_fn = (subset, year, cards) => {
    let new_cards = 0, reprints = 0, total = 0;
    subset.forEach(set => {
        const c = cards[set.code].flat();
        total += cards_per_set(c);
        new_cards += cards_per_set(c.filter(card => !card.reprint));
        reprints += cards_per_set(c.filter(card => card.reprint));
    });
    return [
        { year: year, count: new_cards, count_reprint: reprints, count_new: new_cards, total: total, type: 'New' },
        { year: year, count: reprints, count_reprint: reprints, count_new: new_cards, total: total, type: 'Reprint' }
    ];
}

const valid_types = Array.from(new Set(sets_filtered.map(s => s.set_type.replace('_', ' '))));
const set_type_fn = (subset, year) => {
    const counts = {};
    valid_types.forEach(t => counts[t] = 0);

    subset.forEach(set => {
       counts[set.set_type.replace('_', ' ')]++;
    });

    return valid_types.map(t => ({
       year: year,
       count: counts[t],
       type: t
    }));
}

const mk_year_dist = (year_fn) => {
    const result = [];
    for(let i = sets_filtered[0].release.getFullYear(); i <= sets_filtered.at(-1).release.getFullYear(); i++) {
        const subset = sets_filtered.filter(set => set.release.getFullYear() === i);
        result.push(...year_fn(subset, i, cards));
    }
    return result;
};

const color_dist = mk_year_dist(color_fn);
const rarity_dist = mk_year_dist(rarity_fn);
const reprint_dist = mk_year_dist(reprint_new_fn);
const set_type_dist = mk_year_dist(set_type_fn);
//endregion

//region output
process.stdout.write(JSON.stringify({
    sets: {
        raw: sets_raw,
        filtered: sets_filtered,
        kinds: set_kinds
    },
    cards: cards,
    timing_data: {
        release_difference: set_release_time,
        difference_per_year: year_to_avg,
        per_year: per_year
    },
    complexity: {
        raw: complexity_raw,
        by_kind: complexity_by_kind
    },
    evolution: {
        color_dist: color_dist,
        rarity_dist: rarity_dist,
        reprint_dist: reprint_dist,
        set_type_dist: set_type_dist
    }
}));
//endregion