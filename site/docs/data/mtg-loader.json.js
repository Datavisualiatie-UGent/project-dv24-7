import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";

const cards_data = await readFile(fileURLToPath(import.meta.resolve("./cards.json")), "utf-8");
const cards_with_duplicates = JSON.parse(cards_data);

function deduplicate_cards(cards) {
    const deduplicated_cards = {};
    for (var i = 0; i < cards.length; i++) {
        const card = cards[i];
        const name = `[${card['set_id']}] ${card['name']}`;
        // const name = card['name'];
        if (!deduplicated_cards[name]) {
            deduplicated_cards[name] = card;
        }
        // deduplicated_cards[name] = card;
    }
    return deduplicated_cards;
}

const cards = deduplicate_cards(cards_with_duplicates);

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
    switch (cur.colors) {
        case 0:
            acc['colorless'][cur.cmc] ? acc['colorless'][cur.cmc]++ : acc['colorless'][cur.cmc] = 1;
            acc['colorless']['total']++;
            break;
        case 1:
            acc['green'][cur.cmc] ? acc['green'][cur.cmc]++ : acc['green'][cur.cmc] = 1;
            acc['green']['total']++;
            break;
        case 2:
            acc['red'][cur.cmc] ? acc['red'][cur.cmc]++ : acc['red'][cur.cmc] = 1;
            acc['red']['total']++;
            break;
        case 4:
            acc['black'][cur.cmc] ? acc['black'][cur.cmc]++ : acc['black'][cur.cmc] = 1;
            acc['black']['total']++;
            break;
        case 8:
            acc['blue'][cur.cmc] ? acc['blue'][cur.cmc]++ : acc['blue'][cur.cmc] = 1;
            acc['blue']['total']++;
            break;
        case 16:
            acc['white'][cur.cmc] ? acc['white'][cur.cmc]++ : acc['white'][cur.cmc] = 1;
            acc['white']['total']++;
            break;
        default:
            acc['mixed'][cur.cmc] ? acc['mixed'][cur.cmc]++ : acc['mixed'][cur.cmc] = 1;
            acc['mixed']['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    mixed: {total: 0},
    total: 0});

const power_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.power] ? acc[cur.power]++ : acc[cur.power] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const power_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    switch (cur.colors) {
        case 0:
            acc['colorless'][cur.power] ? acc['colorless'][cur.power]++ : acc['colorless'][cur.power] = 1;
            acc['colorless']['total']++;
            break;
        case 1:
            acc['green'][cur.power] ? acc['green'][cur.power]++ : acc['green'][cur.power] = 1;
            acc['green']['total']++;
            break;
        case 2:
            acc['red'][cur.power] ? acc['red'][cur.power]++ : acc['red'][cur.power] = 1;
            acc['red']['total']++;
            break;
        case 4:
            acc['black'][cur.power] ? acc['black'][cur.power]++ : acc['black'][cur.power] = 1;
            acc['black']['total']++;
            break;
        case 8:
            acc['blue'][cur.power] ? acc['blue'][cur.power]++ : acc['blue'][cur.power] = 1;
            acc['blue']['total']++;
            break;
        case 16:
            acc['white'][cur.power] ? acc['white'][cur.power]++ : acc['white'][cur.power] = 1;
            acc['white']['total']++;
            break;
        default:
            acc['mixed'][cur.power] ? acc['mixed'][cur.power]++ : acc['mixed'][cur.power] = 1;
            acc['mixed']['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    mixed: {total: 0},
    total: 0});

const toughness_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.toughness] ? acc[cur.toughness]++ : acc[cur.toughness] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const toughness_count_by_color = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    switch (cur.colors) {
        case 0:
            acc['colorless'][cur.toughness] ? acc['colorless'][cur.toughness]++ : acc['colorless'][cur.toughness] = 1;
            acc['colorless']['total']++;
            break;
        case 1:
            acc['green'][cur.toughness] ? acc['green'][cur.toughness]++ : acc['green'][cur.toughness] = 1;
            acc['green']['total']++;
            break;
        case 2:
            acc['red'][cur.toughness] ? acc['red'][cur.toughness]++ : acc['red'][cur.toughness] = 1;
            acc['red']['total']++;
            break;
        case 4:
            acc['black'][cur.toughness] ? acc['black'][cur.toughness]++ : acc['black'][cur.toughness] = 1;
            acc['black']['total']++;
            break;
        case 8:
            acc['blue'][cur.toughness] ? acc['blue'][cur.toughness]++ : acc['blue'][cur.toughness] = 1;
            acc['blue']['total']++;
            break;
        case 16:
            acc['white'][cur.toughness] ? acc['white'][cur.toughness]++ : acc['white'][cur.toughness] = 1;
            acc['white']['total']++;
            break;
        default:
            acc['mixed'][cur.toughness] ? acc['mixed'][cur.toughness]++ : acc['mixed'][cur.toughness] = 1;
            acc['mixed']['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    mixed: {total: 0},
    total: 0});

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
            acc['mixed'][diff] ? acc['mixed'][diff]++ : acc['mixed'][diff] = 1;
            acc['mixed']['total']++;
    }
    acc['total']++;
    return acc;
}, {colorless: {total: 0}, // color code: 0
    green: {total: 0},     // color code: 1
    red: {total: 0},       // color code: 2
    black: {total: 0},     // color code: 4
    blue: {total: 0},      // color code: 8
    white: {total: 0},     // color code: 16
    mixed: {total: 0},
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

const faces_data = await readFile(fileURLToPath(import.meta.resolve("./faces.json")), "utf-8");
const faces = JSON.parse(faces_data);

const sets_data = await readFile(fileURLToPath(import.meta.resolve("./sets.json")), "utf-8");
const sets = JSON.parse(sets_data);

for (const code in sets) {
    const size = set_size_count[code];
    sets[code]['size'] = size;
}

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
        case 'colorless':
            return 0;
        case 'white':
            return 1;
        case 'green':
            return 2;
        case 'red':
            return 3;
        case 'blue':
            return 4;
        case 'black':
            return 5;
        case 'mixed':
            return 6;
        default:
            return 7;
    }
}
const color_distribution = new Array();
for (const [key, value] of Object.entries(cmc_count_by_color)) {
    if (key !== 'total') {
        const obj = {};
        obj['color'] = key;
        obj['total'] = value['total'];
        obj['order'] = color_order(key);
        color_distribution.push(obj);
    }
}

process.stdout.write(JSON.stringify({cards: {layout_count: layout_count,
                                             cmc_count: cmc_count, 
                                             cmc_count_by_color: cmc_count_by_color,
                                             power_count: power_count,
                                             power_count_by_color: power_count_by_color,
                                             toughness_count: toughness_count, 
                                             toughness_count_by_color: toughness_count_by_color,
                                             power_toughness_diff_count: power_toughness_diff_count,
                                             power_toughness_difference_count_by_color: power_toughness_difference_count_by_color,
                                             set_size_count: set_size_count,
                                             color_distribution: color_distribution,
                                             cards: cards},
                                     faces: {faces: faces},
                                     sets:  {sets: sets}}));
