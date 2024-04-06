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

const power_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.power] ? acc[cur.power]++ : acc[cur.power] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const toughness_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    acc[cur.toughness] ? acc[cur.toughness]++ : acc[cur.toughness] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

const power_toughness_diff_count = Object.keys(cards).reduce((acc, curr) => {
    const cur = cards[curr];
    const diff = cur.power - cur.toughness
    acc[diff] ? acc[diff]++ : acc[diff] = 1;
    acc['total']++;
    return acc;
}, {total: 0});

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



process.stdout.write(JSON.stringify({cards: {layout_count: layout_count,
                                             cmc_count: cmc_count, 
                                             power_count: power_count, 
                                             toughness_count: toughness_count, 
                                             power_toughness_diff_count: power_toughness_diff_count,
                                             set_size_count: set_size_count,
                                             cards: cards},
                                     faces: {faces: faces},
                                     sets:  {sets: sets}}));
