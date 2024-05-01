import {load_base_data} from "./base-loader.js";
import {get_card_color, get_card_type} from "../components/utils.js";

const {filtered,cards} = await load_base_data();

const calc_mana = (mana_cost) => {
    const mana_vals  = mana_cost.split('}').map(val => val.replace('{', ''));
    const isNumeric = (value) => /^-?\d+$/.test(value);
    const any_type = isNumeric(mana_vals[0]) ? parseInt(mana_vals[0]) : 0;
    const specific = any_type === 0 ? mana_vals.length - 1: mana_vals.length - 2;
    return any_type + specific;
};

const cards_ptm_filter = (card) =>
    card.colors != null && card.type_line != null && card.power != null &&
    card.mana_cost != null && !card.power.includes('*') &&
    !card.toughness.includes('*');

const cards_ptm = filtered.map(set => {
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

process.stdout.write(JSON.stringify({
    ptm: cards_ptm,
    sets: filtered
}));