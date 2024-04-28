import * as Plot from "npm:@observablehq/plot";
import {get_card_color, get_card_type} from './utils.js';


export const cards_color_type = (sets, cards) => {
    const aggregate = [];
    sets.forEach(set => {
        aggregate.push(...cards[set.code].flat()
            .filter(card => card.colors != null)
            .filter(card => card.type_line != null)
            .filter(card => !card.type_line.includes('Token'))
            .map(card => {
                const color = get_card_color(card);

                return {
                    card: card,
                    color: card.colors.length != 0 ? color : "colorless",
                    type: get_card_type(card)
                }
        }));
    })

    return Plot.plot({
        marginLeft: 80,
        padding: 0.05,
        x: {grid: true, label: 'Card type', domain: ['Creature', 'Artifact', 'Enchantment', 'Sorcery', 'Instant', 'Multi']}, // 'Land', 'Card', 'Emblem', 'Phenomenon', 'Plane'
        y: {grid: true, label: 'Card color', domain: ['red', 'blue', 'green', 'white', 'black', 'mixed', 'colorless']},
        color: {legend: true, scheme: 'YlGnBu', label: "Card count"},
        marks: [
            Plot.rect(
                aggregate, 
                Plot.group(
                    {fill: "count"}, 
                    {x: "type", y: "color", tip: true}
                ))
        ]
      })
}

export const card_prices = (all_sets, cards, n, order) => {
    const test = []

    const dataset = [];
    all_sets.forEach(set => {
        const cards_list = cards[set.code].flat().filter(card => card.prices != null).filter(card => card.prices.eur != null).map(card => {
            const addition = card.reprint ? ' : ' + card.set_name : ''
            return {
                card_name: card.name,
                name: card.name + addition,
                price: parseFloat(card.prices.eur),
                set_name: set.name
            }
        });
        dataset.push(...cards_list);
    })

    const selected_data = dataset.sort((a, b) => b.price - a.price);
    if (selected_data.length == 0) return Plot.plot();

    const sorted_data = selected_data.slice(0, selected_data.length > n ? n: selected_data.length)

    return Plot.plot({
        marginLeft: 250,
        marginRight: 100,
        width: 1000,
        x: {
          axis: "top",
          grid: true,
          label: 'Price [€]',
          type: 'linear',
          domain: [0, selected_data[0].price]
        },
        y: {
            label: 'Card name'
        },
        marks: [
            Plot.ruleX([0]),
            Plot.barX(
                sorted_data, 
                {
                    x: "price", 
                    y: "name", 
                    sort: {y: "x", reverse: order == 'Descending' ? true : false},
                    channels: {
                        card_name: {value: "card_name", label: "Card"},
                        set_name: {value: "set_name", label: "Set"}
                    },
                    tip: {format: {
                        card_name: true,
                        price: true,
                        set_name: true,
                        y: false
                    }}
                }
            ),
            Plot.text(sorted_data, {
                text: d => `€ ${d.price} `,
                x: d => d.price,
                y: d => d.name,
                textAnchor: "start",
                dx: 3,
                fill: "black"
            })
        ]
      })
}