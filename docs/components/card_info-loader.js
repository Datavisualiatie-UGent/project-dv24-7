import * as Plot from "npm:@observablehq/plot";

export const cards_color_type = (data) => {
    return Plot.plot({
        marginLeft: 80,
        padding: 0.05,
        x: {grid: true, label: 'Card type', domain: ['Creature', 'Artifact', 'Enchantment', 'Sorcery', 'Instant', 'Multi']}, // 'Land', 'Card', 'Emblem', 'Phenomenon', 'Plane'
        y: {grid: true, label: 'Card color', domain: ['red', 'blue', 'green', 'white', 'black', 'multicolor', 'colorless']},
        color: {legend: true, scheme: 'YlGnBu', label: "Card count"},
        marks: [
            Plot.rect(
                data,
                Plot.group(
                    {fill: "count"},
                    {x: "type", y: "color", tip: true}
                ))
        ]
    })
}

export const cards_prices = (data, n, is_filter = false, order = 'Descending') => {
    if(data.length === 0) return Plot.plot();

    const sorted = data.slice(0, data.length > n ? n : data.length);
    return Plot.plot({
        marginLeft: 250,
        marginRight: 100,
        width: 900,
        height: 55 + 20 * n,
        x: {
            axis: "top",
            grid: true,
            label: 'Price [€]',
            type: 'linear',
            domain: [0, data[0].price]
        },
        y: {
            label: 'Card name'
        },
        marks: [
            Plot.ruleX([0]),
            Plot.barX(
                sorted,
                {
                    x: "price",
                    y: is_filter ? 'name' : 'card_name',
                    sort: {y: "x", reverse: order === 'Descending'},
                    channels: {
                        card_name: {value: "card_name", label: "Card"},
                        set_name: {value: "set", label: "Set"}
                    },
                    tip: {format: {
                            card_name: true,
                            price: true,
                            set_name: true,
                            y: false
                        }}
                }
            ),
            Plot.text(sorted, {
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

export const artists = (data, n) => {
    const filtered = data.filter(a => !a.reprint);
    return Plot.plot({
        marginLeft: 150,
        marginRight: 50,
        width: 900,
        height: 55 + 20 * n,
        x: {
            axis: "top",
            grid: true,
            label: 'Number of unique arts made',
            type: 'linear',
        },
        y: {
            label: 'Artist Name'
        },
        marks: [
            Plot.barX(filtered, Plot.groupY(
                {x: "count"},  {
                    y: "artist",
                    reduce: 'min',
                    tip: true,
                    sort: {y: "-x", limit: n}
                })),
            Plot.ruleY([0]),
            Plot.text(filtered, Plot.groupY(
                {x: "count", text: "count"},  {
                    y: "artist",
                    reduce: 'min',
                    sort: {y: "-x", limit: n},
                    dx: 12
                })
            )
        ]
    })
};

export const artists_reprints = (data, n) => {
    return Plot.plot({
        marginLeft: 150,
        marginRight: 50,
        width: 900,
        height: 55 + 20 * n,
        color: {legend: true, scheme: "spectral", tickFormat: d => d ? 'Reprint': 'New Card'},
        x: {
            axis: "top",
            grid: true,
            label: 'Number of cards',
            type: 'linear',

        },
        y: {
            label: 'Artist Name'
        },
        marks: [
            Plot.barX(data, Plot.groupY(
                {x: d => d[0].reprint ? -d.length: d.length},  {
                    y: "artist",
                    fill: "reprint",
                    reduce: 'min',
                    sort: {y: "-x", limit: n},
                })),
            Plot.ruleY([0]),
            Plot.text(data, Plot.groupY(
                {x: d => d[0].reprint ? -d.length + 15: d.length - 15, text: "count"},  {
                    y: "artist",
                    z: 'reprint',
                    'fill': 'white',
                    reduce: 'min',
                    sort: {y: "-x", limit: n},
                })
            )
        ]
    });
}