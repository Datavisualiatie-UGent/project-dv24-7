import {FileAttachment} from "npm:@observablehq/stdlib";

const exclude_always = [ 'minigame', 'token', 'promo', 'memorabilia', 'treasure_chest', 'vanguard' ];

const exclude = [
  'alchemy', 'archenemy', 'duel_deck', 'from_the_vault', 'funny', 
  'masterpiece', 'memorabilia', 'minigame', 'premium_deck', 'promo',
  'spellbook', 'token', 'treasure_chest', 'vanguard'  
];

const preproc_sets = (sets) => {
    return sets.map(set => {
        return {
            ...set,
            release: new Date(set.released_at)
        };
    }).sort((a, b) => a.release - b.release);
};
const remove_excluded_sets = (sets) => {
    return sets.filter(set => set.parent_set_code === undefined).filter(set => !exclude.includes(set.set_type));
};

export const sets_raw = preproc_sets((await FileAttachment("../data/sets.json").json()).data)
    .filter(x => !exclude_always.includes(x.set_type));

const load_cards = async () => {
    const cards = {};
    const card_zip = await FileAttachment("../data/cards.zip").zip();
    await Promise.all(sets_raw.map(async set => {
        cards[set.code] = await card_zip.file(`out/${set.code}.json`).json();
    }));
    return cards;
};

export const sets = remove_excluded_sets(sets_raw);
export const set_kinds = [...new Set(sets_raw.map(set => set.set_type))];
export const cards_by_sets = await load_cards();