import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {cards_per_set, get_card_color, get_card_type, get_color_by_code} from "../components/utils.js";

// TODO IMMEDIATELY: migrate so smaller loaders

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

//region distribution
//endregion

//region card data
const calc_mana = (mana_cost) => {
    const mana_vals  = mana_cost.split('}').map(val => val.replace('{', ''));
    const isNumeric = (value) => /^-?\d+$/.test(value);
    const any_type = isNumeric(mana_vals[0]) ? parseInt(mana_vals) : 0;
    const specific = any_type === 0 ? mana_vals.length - 1: mana_vals.length - 2;
    return any_type + specific;
};

const cards_ptm_filter = (card) =>
    card.colors != null && card.type_line != null && card.power != null &&
    card.mana_cost != null && !card.power.includes('*') &&
    !card.toughness.includes('*');

const cards_ptm = sets_filtered.map(set => {
    return [...cards[set.code].flat()]
        .filter(cards_ptm_filter)
        .map(card => ({
            card: card,
            color: card.colors.length === 0 ? 'colorless' : get_card_color(card),
            type: get_card_type(card),
            power: parseFloat(card.power),
            toughness: parseFloat(card.toughness),
            rarity: card.rarity,
            count: 1,
            mana_cost: calc_mana(card.mana_cost),
            name: card.name,
            set: set.name
        }));
}).flat();
//endregion

//region output
process.stdout.write(JSON.stringify({
    sets: {
        raw: sets_raw,
        filtered: sets_filtered,
        kinds: set_kinds
    },
    cards: cards,
    card_info: {
        ptm: cards_ptm
    }
}));
//endregion