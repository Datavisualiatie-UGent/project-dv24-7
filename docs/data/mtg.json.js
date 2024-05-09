import {load_base_data} from "./base-loader.js";
import {get_card_color, get_color_by_code} from "../components/utils.js";

var {raw,cards,filtered,kinds} = await load_base_data();

// const cards_data = await readFile(fileURLToPath(import.meta.resolve("./cards.json")), "utf-8");
// const cards_with_duplicates = JSON.parse(cards_data);

// function deduplicate_cards(cards) {
//     const deduplicated_cards = {};
//     for (var i = 0; i < cards.length; i++) {
//         const card = cards[i];
//         const name = `[${card['set_id']}] ${card['name']}`;
//         // const name = card['name'];
//         if (!deduplicated_cards[name]) {
//             deduplicated_cards[name] = card;
//         }
//         // deduplicated_cards[name] = card;
//     }
//     return deduplicated_cards;
// }

// const cards = deduplicate_cards(cards_with_duplicates);
const cards_old = cards
const cards_new = {};
for (const set of filtered) {
    let set_cards = cards[set.code].flat();
    for (const card of set_cards) {
        cards_new[card["id"]] = card;
    }
}
// for (const set in cards) {
// } 

cards = cards_new



const layout_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.layout] ? acc[cur.layout]++ : acc[cur.layout] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const cmc_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.cmc] ? acc[cur.cmc]++ : acc[cur.cmc] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const cmc_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    if (! ("cmc" in cur)) {
        return acc;
        acc['skipped_cmc'].push(cur);
    }
    if (! ("colors" in cur)) {
        if (cur.layout === 'transform') {
            return acc;
            acc['skipped_transform'].push(cur);
        }
        if (cur.layout === 'double_faced_token') {
            return acc;
            acc['skipped_double_faced_token'].push(cur);
        }
        if (cur.layout === 'modal_dfc') {
            return acc;
            acc['skipped_modal_dfc'].push(cur);
        }
        if (cur.layout === 'reversible_card') {
            return acc;
            acc['skipped_reversible_card'].push(cur);
        }
        return acc;
        acc['skipped_other'].push(cur);
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
    total: 0,
    skipped_transform: [],
    skipped_double_faced_token: [],
    skipped_modal_dfc: [],
    skipped_reversible_card: [],
    skipped_other: [],
    skipped_cmc: []});

const power_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.power] ? acc[cur.power]++ : acc[cur.power] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const power_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    if (! ("colors" in cur)) {
        if (cur.layout === 'transform') {
            return acc;
            acc['skipped_transform'].push(cur);
        }
        if (cur.layout === 'double_faced_token') {
            return acc;
            acc['skipped_double_faced_token'].push(cur);
        }
        if (cur.layout === 'modal_dfc') {
            return acc;
            acc['skipped_modal_dfc'].push(cur);
        }
        if (cur.layout === 'reversible_card') {
            return acc;
            acc['skipped_reversible_card'].push(cur);
        }
        return acc;
        acc['skipped_other'].push(cur);
    }
    if (! ("power" in cur)) {
        return acc;
        acc['skipped_power'].push(cur);
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
    total: 0,
    skipped_transform: [],
    skipped_double_faced_token: [],
    skipped_modal_dfc: [],
    skipped_reversible_card: [],
    skipped_other: [],
    skipped_power: []});

const toughness_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.toughness] ? acc[cur.toughness]++ : acc[cur.toughness] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const toughness_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    if (! ("colors" in cur)) {
        if (cur.layout === 'transform') {
            return acc;
            acc['skipped_transform'].push(cur);
        }
        if (cur.layout === 'double_faced_token') {
            return acc;
            acc['skipped_double_faced_token'].push(cur);
        }
        if (cur.layout === 'modal_dfc') {
            return acc;
            acc['skipped_modal_dfc'].push(cur);
        }
        if (cur.layout === 'reversible_card') {
            return acc;
            acc['skipped_reversible_card'].push(cur);
        }
        return acc;
        acc['skipped_other'].push(cur);
    }
    if (! ("toughness" in cur)) {
        return acc;
        acc['skipped_toughness'].push(cur);
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
    total: 0,
    skipped_transform: [],
    skipped_double_faced_token: [],
    skipped_modal_dfc: [],
    skipped_reversible_card: [],
    skipped_other: [],
    skipped_toughness: []});

const power_toughness_diff_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    const diff = cur.power - cur.toughness
    acc[diff] ? acc[diff]++ : acc[diff] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const power_toughness_difference_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    const diff = cur.power - cur.toughness
    switch (cur.colors) {
        case 0:
            acc['colorless'][diff] ? acc['colorless'][diff]++ : acc['colorless'][diff] = 1;
            acc['colorless']['total']++;
            break;
        case 1:
            acc['green'][diff] ? acc['green'][diff]++ : acc['green'][diff] = 1;
            acc['green']['total']++;
            break;
        case 2:
            acc['red'][diff] ? acc['red'][diff]++ : acc['red'][diff] = 1;
            acc['red']['total']++;
            break;
        case 4:
            acc['black'][diff] ? acc['black'][diff]++ : acc['black'][diff] = 1;
            acc['black']['total']++;
            break;
        case 8:
            acc['blue'][diff] ? acc['blue'][diff]++ : acc['blue'][diff] = 1;
            acc['blue']['total']++;
            break;
        case 16:
            acc['white'][diff] ? acc['white'][diff]++ : acc['white'][diff] = 1;
            acc['white']['total']++;
            break;
        default:
            acc['multicolor'][diff] ? acc['multicolor'][diff]++ : acc['multicolor'][diff] = 1;
            acc['multicolor']['total']++;
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

const set_size_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.set_id] ? acc[cur.set_id]++ : acc[cur.set_id] = 1;
    acc['total']++;
    return acc;
}, {total: 0});
// let set_count_1 =  Object.keys(set_size_count).length - 1;
// set_size_count['set_count'] = set_count_1;

// let set_count_2 = Object.keys(sets).length;
// sets['set_count'] = set_count_2;

// const faces_data = await readFile(fileURLToPath(import.meta.resolve("./faces.json")), "utf-8");
// const faces = JSON.parse(faces_data);

// const sets_data = await readFile(fileURLToPath(import.meta.resolve("./sets-jq.json")), "utf-8");
// const sets = JSON.parse(sets_data);

// for (const code in sets) {
//     const size = set_size_count[code];
//     sets[code]['size'] = size;
// }

/* const color_distribution = Object.keys(cmc_count_by_color).map(color => {
    if (color === 'total') {
        return {total: cmc_count_by_color['total']};
    } else {
        const obj = {};
        obj[color] = cmc_count_by_color[color]['total'];
        return obj;
    }
}) */
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

const data = {cards: {layout_count: layout_count,
                                             //cmc_count: cmc_count, 
                                             cmc_count_by_color: cmc_count_by_color,
                                             //power_count: power_count,
                                             power_count_by_color: power_count_by_color,
                                             //toughness_count: toughness_count, 
                                             toughness_count_by_color: toughness_count_by_color,
                                             //power_toughness_diff_count: power_toughness_diff_count,
                                             //power_toughness_difference_count_by_color: power_toughness_difference_count_by_color,
                                             //set_size_count: set_size_count,
                                             color_distribution: color_distribution,
                                             //cards: cards
                                            },
                                    //  faces: {faces: faces},
                                    //  sets:  {sets: sets}
                                    };


process.stdout.write(JSON.stringify({
    // raw: raw,
    // cards: cards_old,
    // filtered: filtered,
    // kinds: kinds,
    data: data,
    // cards_new: cards_new,
    // sld: cards_old['sld'].flat()
}));