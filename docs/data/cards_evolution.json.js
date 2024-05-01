import {load_base_data} from "./base-loader.js";
import {cards_per_set, get_color_by_code} from "../components/utils.js";

const {cards,filtered} = await load_base_data();

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

const valid_types = Array.from(new Set(filtered.map(s => s.set_type.replace('_', ' '))));
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
    for(let i = filtered[0].release.getFullYear(); i <= filtered.at(-1).release.getFullYear(); i++) {
        const subset = filtered.filter(set => set.release.getFullYear() === i);
        result.push(...year_fn(subset, i, cards));
    }
    return result;
};

const color_dist = mk_year_dist(color_fn);
const rarity_dist = mk_year_dist(rarity_fn);
const reprint_dist = mk_year_dist(reprint_new_fn);
const set_type_dist = mk_year_dist(set_type_fn);

process.stdout.write(JSON.stringify({
    color_dist: color_dist,
    rarity_dist: rarity_dist,
    reprint_dist: reprint_dist,
    set_type_dist: set_type_dist
}));