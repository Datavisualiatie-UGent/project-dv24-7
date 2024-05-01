import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

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

export const load_base_data = async () => {
    const loaded = await readFile(fileURLToPath(import.meta.resolve(`${url_pre}sets.json`)));
    const sets_raw = add_date_sort(JSON.parse(loaded).data)
        .filter(set => !exclude_always.includes(set.set_type));

    const sets_filtered = exclude(sets_raw);

    const set_kinds = [...new Set(sets_raw.map(set => set.set_type))];

    const cards = {};
    await Promise.all(sets_raw.map(async set => {
        cards[set.code] = JSON.parse(
            await readFile(fileURLToPath(import.meta.resolve(`${url_pre}${set.code}.json`)), 'utf-8')
        );
    }));

    return {
        raw: sets_raw,
        filtered: sets_filtered,
        cards: cards,
        kinds: set_kinds
    };
}