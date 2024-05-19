import {load_base_data} from "./base-loader.js";
import {get_card_color} from "../components/utils.js";

var {cards,filtered} = await load_base_data();

// Color order, useful for e.g. pie charts
const color_order = function(colorname) {
    switch (colorname) {
        case 'black':
            return 0;
        case 'white':
            return 1;
        case 'red':
            return 2;
        case 'green':
            return 3;
        case 'blue':
            return 4;
        case 'multicolor':
            return 5;
        case 'colorless':
            return 6;
        default:
            return 7;
    }
}

const cards_collection = {};
for (const set of filtered) {
    let set_cards = cards[set.code].flat();
    for (const card of set_cards) {
        cards_collection[card["id"]] = card;
    }
}

const cmc_count_by_color = Object.keys(cards_collection).reduce((acc, curr) => {
    const cur = cards_collection[curr];
    if (! ("cmc" in cur)) {
        return acc;
    }
    if (! ("colors" in cur)) {
        return acc;
    }
    let cmc = cur.cmc.toString();
    if (cur.colors.length === 0) {
        acc['colorless'][cmc] ? acc['colorless'][cmc]++ : acc['colorless'][cmc] = 1;
        acc['colorless']['total']++;
    } else {
        let color = get_card_color(cur)
        acc[color][cmc] ? acc[color][cmc]++ : acc[color][cmc] = 1;
        acc[color]['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    multicolor: {total: 0},
    total: 0});

const power_count_by_color = Object.keys(cards_collection).reduce((acc, curr) => {
    const cur = cards_collection[curr];
    if (! ("colors" in cur)) {
        return acc;
    }
    if (! ("power" in cur)) {
        return acc;
    }
    let power = cur.cmc.toString();
    if (cur.colors.length === 0) {
        acc['colorless'][power] ? acc['colorless'][power]++ : acc['colorless'][power] = 1;
        acc['colorless']['total']++;
    } else {
        let color = get_card_color(cur)
        acc[color][power] ? acc[color][power]++ : acc[color][power] = 1;
        acc[color]['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    multicolor: {total: 0},
    total: 0});

const toughness_count_by_color = Object.keys(cards_collection).reduce((acc, curr) => {
    const cur = cards_collection[curr];
    if (! ("colors" in cur)) {
        return acc;
    }
    if (! ("toughness" in cur)) {
        return acc;
    }
    let toughness = cur.toughness.toString();
    if (cur.colors.length === 0) {
        acc['colorless'][toughness] ? acc['colorless'][toughness]++ : acc['colorless'][toughness] = 1;
        acc['colorless']['total']++;
    } else {
        let color = get_card_color(cur)
        acc[color][toughness] ? acc[color][toughness]++ : acc[color][toughness] = 1;
        acc[color]['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    multicolor: {total: 0},
    total: 0});

const color_distribution = new Array();
for (const [key, value] of Object.entries(cmc_count_by_color)) {
    const valid_colors = ["white", "black", "red", "green", "blue", "multicolor", "colorless"]
    if (valid_colors.includes(key)) {
        const obj = {};
        obj['color'] = key;
        obj['total'] = value['total'];
        obj['order'] = color_order(key);
        color_distribution.push(obj);
    }
}

process.stdout.write(JSON.stringify({cards: {
    cmc_count_by_color: cmc_count_by_color,
    power_count_by_color: power_count_by_color,
    toughness_count_by_color: toughness_count_by_color,
    color_distribution: color_distribution,
}}));