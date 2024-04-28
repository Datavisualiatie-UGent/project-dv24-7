import * as Plot from "npm:@observablehq/plot";
import {color_scheme_map} from './utils.js';

const calculate_mana = (mana_cost) => {
    const mana_vals  = mana_cost.split('}').map(val => val.replace('{', ''))
    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    const any_type = isNumeric(mana_vals[0]) ? parseInt(mana_vals) : 0
    const specific = any_type == 0 ? mana_vals.length - 1: mana_vals.length - 2
    const mana = any_type + specific
    return mana
}

const get_color_dataset = (all_sets, color_name, cards) => {
    const aggregate = [];

    all_sets.forEach(set => {
        const cards_list = cards[set.code].flat()
            .filter(card => card.colors != null)
            .filter(card => card.type_line != null)
            .filter(card => card.power != null)
            .filter(card => card.mana_cost != null)
            .filter(card => !card.power.includes('*'))
            .filter(card => !card.toughness.includes('*'))
            .map(card => {
                const color = get_card_color(card);
                const type = get_card_type(card);

                return {
                    card: card,
                    color: card.colors.length != 0 ? color : "colorless",
                    type: type,
                    power: parseFloat(card.power),
                    toughness: parseFloat(card.toughness),
                    rarity: card.rarity,
                    count: 1,
                    mana_cost: calculate_mana(card.mana_cost),
                    name: card.name
                }
        });
        aggregate.push(...cards_list);
    })

    let reduced;
    if (color_name != 'All') {
        reduced = aggregate.filter(card => card.color == color_name.toLowerCase())
    } else {
        reduced = aggregate;
    }
    return reduced
}

export const cards_color_power = (all_sets, color_name, cards) => {

    const dataset = get_color_dataset(all_sets, color_name, cards);

    return Plot.plot({
        grid: true,
        color: {legend: true, scheme: color_scheme_map(color_name)},
        style: {fontSize: "14px"},
        marginLeft: 150,
        marginRight: 150,
         width: 800,
        height: 500,
        x: {label: "Power", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
        y: {label: "Toughness", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
        r: {range: [2, 10]},
        marks: [
            Plot.link(
                [0.6, 0.7, 0.8, 0.9, 1], 
                {
                x1: -1.5,
                y1: -1.5,
                x2: 18.5,
                y2: 18.5,
                strokeOpacity: 0.2
              }
            ),
            Plot.text(
                [{power: 18.5, toughness: 18.5, text: 'Perfect ratio'}], 
                {
                x: 'power',
                y: 'toughness',
                text: 'text',
                textAnchor: "start",
                dx: 10
                }
            ),
            Plot.dot(
                dataset,
                {
                ...Plot.bin(
                    {r: 'count', fill: 'count', x: 'min', y: 'min'}, 
                    {x: "power", y: "toughness", stroke: 'black', tip: true, interval: 1, inset: 0.5},
                ),
                }
            )
        ]
      });
}


export const cards_color_power_mana = (all_sets, color_name, cards, mana_cost) => {
    if (mana_cost == 'All') {
        return cards_color_power(all_sets, color_name, cards);
    }

    const dataset = get_color_dataset(all_sets, color_name, cards).filter(card => card.mana_cost == mana_cost);

    return Plot.plot({
        grid: true,
        color: {legend: true, scheme: color_scheme_map(color_name)},
        style: {fontSize: "14px"},
        marginLeft: 150,
        marginRight: 150,
         width: 800,
        height: 500,
        x: {label: "Power", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
        y: {label: "Toughness", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
        r: {range: [2, 10]},
        marks: [
            Plot.link(
                [0.6, 0.7, 0.8, 0.9, 1], 
                {
                x1: -1.5,
                y1: -1.5,
                x2: 18.5,
                y2: 18.5,
                strokeOpacity: 0.2
              }
            ),
            Plot.text(
                [{power: 18.5, toughness: 18.5, text: 'Perfect ratio'}], 
                {
                x: 'power',
                y: 'toughness',
                text: 'text',
                textAnchor: "start",
                dx: 10
                }
            ),
            Plot.dot(
                dataset,
                {
                ...Plot.bin(
                    {r: 'count', fill: 'count', x: 'min', y: 'min'}, 
                    {x: "power", y: "toughness", stroke: 'black', tip: true, interval: 1, inset: 0.5},
                ),
                }
            )
        ]
      });
}

const rarity_domain = (dataset) => {
    const rarities = ['common', 'uncommon', 'rare', 'mythic', 'special']
    const found_rarities = [];
    const used_rarities = []
    dataset.forEach(card => {
        if (!found_rarities.includes(card.rarity)) {
            found_rarities.push(card.rarity);
        }
    })

    if (found_rarities.length == 0) {
        return rarities
    }

    rarities.forEach(rarity => {
        if (found_rarities.includes(rarity)) {
            used_rarities.push(rarity)
        }
    })
    return used_rarities;
}

export const cards_rarity_power = (all_sets, color_name, cards) => {
    const dataset = get_color_dataset(all_sets, color_name, cards);
    return Plot.plot({
        marginLeft: 100,
        padding: 0,
        x: {grid: true,  domain: Array.from({length: 20}, (_, i) => i-1)},
        fy: {domain: rarity_domain(dataset)},
        color: {legend: true, scheme: color_scheme_map(color_name)},
        marks: [
            Plot.rect(
                dataset, 
                Plot.binX(
                    {fill: "count", x: 'min'}, 
                    {x: "power", fy: "rarity", inset: 0.1, interval: 1, tip: true}
                ))
        ]
      })
}

export const cards_rarity_toughness = (all_sets, color_name, cards) => {
    const dataset = get_color_dataset(all_sets, color_name, cards);
    return Plot.plot({
        marginLeft: 100,
        padding: 0,
        x: {grid: true, domain: Array.from({length: 18}, (_, i) => i)},
        fy: {domain: rarity_domain(dataset)},
        color: {legend: true, scheme: color_scheme_map(color_name)},
        marks: [
            Plot.rect(
                dataset, 
                Plot.binX(
                    {fill: "count", x: 'min'}, 
                    {x: "toughness", fy: "rarity", inset: 0.1, interval: 1, tip: true}
                ))
        ]
      })
}
