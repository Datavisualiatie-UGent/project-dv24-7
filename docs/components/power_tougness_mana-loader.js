import * as Plot from "npm:@observablehq/plot";
import {color_scheme_map, get_card_color, get_card_type} from './utils.js';

export const cards_color_power = (color, data) => {
    return Plot.plot({
        grid: true,
        color: {legend: true, scheme: color_scheme_map(color)},
        style: {fontSize: "14px"},
        marginLeft: 150,
        marginRight: 150,
        width: 800,
        height: 500,
        x: {label: "Toughness", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
        y: {label: "Power", type: 'linear', domain: Array.from({length: 20}, (_, i) => i-1)},
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
                    x: 'toughness',
                    y: 'power',
                    text: 'text',
                    textAnchor: "start",
                    dx: 10
                }
            ),
            Plot.dot(
                data,
                {
                    ...Plot.bin(
                        {r: 'count', fill: 'count', x: 'min', y: 'min'},
                        {x: "toughness", y: "power", stroke: 'black', tip: true, interval: 1, inset: 0.5},
                    ),
                }
            )
        ]
    });
}

export const cards_color_rarity = (color, data, property) => {
    const rarities = ['common', 'uncommon', 'rare', 'mythic', 'special']
        .filter(r => data.some(d => d.rarity === r));
    const config = {x:property, fy: "rarity", inset: 0.1, interval: 1, tip: true}

    return Plot.plot({
        marginLeft: 100,
        padding: 0,
        x: {grid: true,  domain: Array.from({length: 20}, (_, i) => i-1), label: property.replace('_', ' ')},
        fy: {domain: rarities},
        color: {legend: true, scheme: color_scheme_map(color)},
        marks: [
            Plot.rect(
                data,
                Plot.binX(
                    {fill: "count", x: 'min'},
                    config
                ))
        ]
    })
}