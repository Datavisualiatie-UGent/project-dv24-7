import * as d3 from 'npm:d3';
import * as Plot from "npm:@observablehq/plot";

const marginTop = 20, marginBottom = 40, marginLeft = 40, marginRight = 20;

export const color_per_year_bar = (data, {w, h} = {w: 1200, h: 600}) => {
    const subgroups = d3.union(data.map(d => d.color));
    const series = d3.stack()
        .keys(subgroups)
        .value(([, group], key) => group.get(key).color_count)(d3.index(data, d => d.year, d => d.color));

    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([marginLeft, w - marginRight])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([h - marginBottom, marginTop]);

    const svg = d3.create("svg").attr('width', w).attr('height', h);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#838383', '#006600', '#CC0000', '#000000', '#0066CC', '#FFFFFF', '#FFCC00'])
        .unknown("#ccc");

    svg.append("g")
        .attr('transform', `translate(0,${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.append('g')
        .selectAll()
        .data(series)
        .join('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(D => D.map(d => (d.key = D.key, d)))
        .join('rect')
        .attr('x', d => x(d.data[0]))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());

    return svg.node();
};

export const color_per_year_area = (data, {w, h} = {w: 1200, h: 600}) => {
    return Plot.plot({
        marginLeft: marginLeft,
        width: w,
        color: {
            type: 'categorical',
            legend: true,
            range: ['grey', '#a2c933', '#c2270a', '#23171b', '#2aabee', 'white', '#feb927'],
            domain: ['colorless', 'green', 'red', 'black', 'blue', 'white', 'mixed']
        },
        y: {
            grid: false,
            label: "↑ Colors in set (ratio)"
        },
        marks: [
            Plot.areaY(data, {x: 'year', y: 'color_count', fill: 'color', tip: 'x'}),
            Plot.ruleY([0])
        ]
    });
};