import {load_base_data} from "./base-loader.js";
import {get_card_color, get_card_type} from "../components/utils.js";

const {filtered,cards} = await load_base_data();

const card_tc_filter = (card) => card.colors != null && card.type_line != null && !card.type_line.includes('Token');
const cards_color_type = filtered.map(set => {
    return [...cards[set.code].flat()]
        .filter(card_tc_filter)
        .map(card => ({
            card: card,
            color: card.colors.length !== 0 ? get_card_color(card) : 'colorless',
            type: get_card_type(card),
            set: set.name
        }));
}).flat();

const card_p_filter = (card) => card.prices != null && card.prices.eur != null;
const cards_prices = filtered.map(set => {
    return [...cards[set.code].flat()]
        .filter(card_p_filter)
        .map(card => ({
            card_name: card.name,
            name: `${card.name} (${card.set_name})`,
            price: parseFloat(card.prices.eur),
            set: set.name
        }));
}).flat().sort((a, b) => b.price - a.price);

const cards_artist = filtered.map(set => {
    return [...cards[set.code].flat()]
        .map(card => ({
            artist: card.artist,
            reprint: card.reprint,
            set: set.name
        }));
}).flat();

process.stdout.write(JSON.stringify({
    sets: {
        filtered: filtered
    },
    card_info: {
        color_type: cards_color_type,
        prices: cards_prices,
        artist: cards_artist
    }
}));