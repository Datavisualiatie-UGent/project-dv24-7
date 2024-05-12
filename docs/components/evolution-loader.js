import * as d3 from 'npm:d3';
import * as Plot from "npm:@observablehq/plot";

const marginTop = 20, marginBottom = 40, marginLeft = 40, marginRight = 20;

export const color_per_year_area = (data, width = 640) => {
    return Plot.plot({
        width: width,
        color: {
            type: 'categorical',
            legend: true,
            label: 'Color',
            range: ['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'],
            domain: ['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless']
        },
        x: {
            label: "Time [year]",
            interval: 1,
            tickFormat: d => `${d}`
        },
        y: {
            grid: false,
            label: "↑ Colors in set  [%]",
            percent: true
        },
        marks: [
            Plot.areaY(
                data, {
                    x: "year",
                    y: "color_count",
                    fill: "color",
                    channels: {
                        year: {value: d => `${d.year}`, label: 'Year'},
                        black: {value: d => `${d.map.black} - ${(d.map.black * 100 / d.total).toFixed(2)}%`, label: 'Black'},
                        red: {value: d => `${d.map.red} - ${(d.map.red * 100 / d.total).toFixed(2)}%`, label: 'Red'},
                        white: {value: d => `${d.map.white} - ${(d.map.white * 100 / d.total).toFixed(2)}%`, label: 'White'},
                        green: {value: d => `${d.map.green} - ${(d.map.green * 100 / d.total).toFixed(2)}%`, label: 'Green'},
                        blue: {value: d => `${d.map.blue} - ${(d.map.blue * 100 / d.total).toFixed(2)}%`, label: 'Blue'},
                        multicolor: {value: d => `${d.map.multicolor} - ${(d.map.multicolor * 100 / d.total).toFixed(2)}%`, label: 'multicolor'},
                        colorless: {value: d => `${d.map.colorless} - ${(d.map.colorless * 100 / d.total).toFixed(2)}%`, label: 'Colorless'},
                    },
                    tip: {
                        format: {
                            x: false,
                            y: false,
                            fill: false,
                            year: true,
                            black: true,
                            red: true,
                            white: true,
                            green: true,
                            blue: true,
                            multicolor: true,
                            colorless: true,
                        }
                    },
                    order: ['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'],
                }),
            Plot.ruleY([0])
        ]
    });
};

export const rarity_per_year_area = (data) => {
    return Plot.plot({
        marginLeft: marginLeft,
        color: {
            type: 'categorical',
            legend: true,
            label: 'Color',
            range: ['#F09EA7','#F6CA94','#FAFABE', '#C1EBC0', '#C7CAFF', '#F6C2F3'],
            domain: ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus']
        },
        x: {
            label: "Time [year]",
            interval: 1,
            tickFormat: d => `${d}`
        },
        y: {
            grid: false,
            label: "↑ Rarities [%]",
            percent: true
        },
        marks: [
            Plot.areaY(
                data, {
                    x: "year",
                    y: "rarity_count",
                    fill: "rarity",
                    channels: {
                        year: {value: d => `${d.year}`, label: 'Year'},
                        common: {value: d => `${d.map.common} - ${(d.map.common * 100 / d.total).toFixed(2)}%`, label: 'Common'},
                        uncommon: {value: d => `${d.map.uncommon} - ${(d.map.uncommon * 100 / d.total).toFixed(2)}%`, label: 'Uncommon'},
                        rare: {value: d => `${d.map.rare} - ${(d.map.rare * 100 / d.total).toFixed(2)}%`, label: 'Rare'},
                        mythic: {value: d => `${d.map.mythic} - ${(d.map.mythic * 100 / d.total).toFixed(2)}%`, label: 'Mythic'},
                        special: {value: d => `${d.map.special} - ${(d.map.special * 100 / d.total).toFixed(2)}%`, label: 'Special'},
                        bonus: {value: d => `${d.map.bonus} - ${(d.map.bonus * 100 / d.total).toFixed(2)}%`, label: 'Bonus'},
                    },
                    tip: {
                        format: {
                            x: false,
                            y: false,
                            fill: false,
                            year: true,
                            common: true,
                            uncommon: true,
                            rare: true,
                            mythic: true,
                            special: true,
                            legend: false
                        }
                    },
                    order: ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus'],
                }),
            Plot.ruleY([0])
        ]
    });
};

export const reprints = (data, normalized=false) => {
    const config = {
        x: "year",
        y: "count",
        fill:'type',
        marginLeft: normalized ? 10 : 50,
        width:10,
        channels: {
            count_total: {value: "total", label: "Total number of Cards"},
            new: {value: d => `${d.count_new} - ${((d.count_new / d.total)*100).toFixed(2)}%`, label: 'New Cards'},
            reprint: {value: d => `${d.count_reprint} - ${((d.count_reprint / d.total)*100).toFixed(2)}%`, label: 'Reprints'},
            time: {value: d => `${d.year}`, label: "Year"},
        },
        tip: {format: {
                count_total: true,
                new: true,
                reprint: true,
                time: true,
                x: false,
                y: false,
                fill: false
            }
        }
    }

    if (normalized) {
        config.offset = "normalize"
    }


    return Plot.plot({
        x: {tickFormat: "", interval: 1, label: "Time [year]", dx: 1},
        y: {label: "Fraction of cards [%]", grid: true, percent: normalized},
        color: {legend: true, scheme: "Spectral", label: "Release type"},
        marks: [
            Plot.barY(data, config),
            Plot.ruleY([0]),
        ]
    });
}

export const set_types = (data, normalized=false) => {
    const config = {
        x: "year",
        y: "count",
        fill: "type",
        tip: true,
        order: "type"
    }

    if (normalized) {
        config.offset = 'normalize'
    }

    return Plot.plot({
        x: {tickFormat: "", interval: 1, label: "Time [year]", dx: 1},
        y: {label: "Number of sets", grid: true, percent: normalized},
        color: {legend: true, scheme: 'spectral', label: 'Set Type'},
        marks: [
            Plot.barY(data, config)
        ]
    })
}

export const set_type_dist = (data) => {
    return Plot.plot({
        x: {label: 'Set type'},
        y: {label: 'Number of sets'},
        width: 700,
        marginBottom: 50,
        color: {legend: true, scheme: 'Spectral'},
        marks: [
            Plot.barY(data, {
                x: "type",
                y: 'count',
                tip: false,
                sort: {x: "y", reverse: true},
                fill:'#4e79a7',
                insetLeft: 5,
                insetRight: 5
            })
        ]
    })
}