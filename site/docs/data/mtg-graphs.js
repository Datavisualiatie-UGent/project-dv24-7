import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";

export function timeline(events, {width, height} = {}) {
  return Plot.plot({
    width,
    height,
    marginTop: 30,
    x: {nice: true, label: null, tickFormat: ""},
    y: {axis: null},
    marks: [
      Plot.ruleX(events, {x: "year", y: "y", markerEnd: "dot", strokeWidth: 2.5}),
      Plot.ruleY([0]),
      Plot.text(events, {x: "year", y: "y", text: "name", lineAnchor: "bottom", dy: -10, lineWidth: 10, fontSize: 12})
    ]
  });
}

export function layout_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.barX(data, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: 'layout'
            })
        ]
    });
}

export function cmc_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.barX(data, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: d => parseInt(d['mana_cost'])
            })
        ]
    });
}

export function power_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.barX(data, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: d => parseFloat(d['power'])
            })
        ]
    });
}

export function toughness_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.barX(data, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: d => parseFloat(d['toughness'])
            })
        ]
    });
}

export function pow_tough_diff_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.barX(data, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: d => parseFloat(d['power_toughness_difference'])
            })
        ]
    });
}

export function set_sizes_bars(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        axisX: {tickSpacing: 10},
        marks: [
            Plot.rectY(data, {
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: d => parseInt(d['count']),
                y: d => parseInt(d['number_of_sets']),
                title: (d) => `Number of sets: ${d.number_of_sets} \n Set size: ${d.count} \n`
            })
        ]
    });
}


export function set_sizes(data, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: width,
        height: height,
        marks: [
            Plot.dot(data, {
                // marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: d => {
                    let date = new Date(d.release);
                    return date;
                },
                y: 'size',
                fill: "currentColor",
                r: 3,
                title: (d) => `${d.name} (Code '${d.code}')\n Release date: ${new Date(d.release)} \n Size: ${d.size} \n`
            })
        ]
    });
}
