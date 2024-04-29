import * as d3 from 'npm:d3';
import * as Plot from "npm:@observablehq/plot";
import {filter_years, cards_per_set, get_color_by_code} from './utils.js';

const marginTop = 20, marginBottom = 40, marginLeft = 40, marginRight = 20;

const color_set_year = (year_sets, year, cards) => {
    const color_counts = {
        colorless: 0,
        green: 0,
        red: 0,
        black: 0,
        blue: 0,
        white: 0,
        mixed: 0,
    };

    let card_colors = [];
    let cards_in_set = 0;

    year_sets.forEach(set => {
        const cards_list = cards[set.code].flat().filter(card => card.colors != null).map(card => card.colors);
        const double_faced = cards[set.code].flat().filter(card => card.colors == null).map(card => card.card_faces);
        double_faced.forEach(faces =>{
            const face_colors = []
            faces.forEach(face => {
                face_colors.push(...face.colors);
            });
            cards_list.push(face_colors.filter((value, index, array) => array.indexOf(value) === index));
        });
        cards_in_set += cards_per_set(cards_list);
        cards_list.forEach(colors => {
            if (colors.length == 0) {
                color_counts.colorless++;
            } else if (colors.length > 1) {
                color_counts.mixed++;
            } else {
                color_counts[get_color_by_code(colors[0])]++;
            }
        });
    });

    Object.keys(color_counts).forEach(key => {
        card_colors.push({
            year: year,
            color: key,
            color_count: color_counts[key] / cards_in_set,
            map: color_counts,
            total: cards_in_set
        });
    });
    return card_colors;
}

export const color_per_year_bar = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...color_set_year(year_sets, i, cards)); 
    }

    const data = year_to_count;
    const subgroups = d3.union(data.map(d => d.color));

    var series = d3.stack()
        .keys(subgroups)
        .value(([, group], key) => group.get(key).color_count)
        (d3.index(data, d => d.year, d => d.color));


    const x = d3.scaleBand()
        .domain(year_to_count.map(year => year.year))
      .range([marginLeft, w - marginRight])
      .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([h - marginBottom, marginTop]);


    const svg = d3.create("svg").attr("width", w).attr("height", h);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#838383','#006600','#CC0000', '#000000', '#0066CC', '#FFFFFF', '#FFCC00'])
    .unknown("#ccc");


    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll()
        .data(series)
        .join("g")
          .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(D => D.map(d => (d.key = D.key, d)))
        .join("rect")
          .attr("x", d => x(d.data[0]))
          .attr("y", d => y(d[1]))
          .attr("height", d => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())

    return svg.node();
}

export const color_per_year_area_plot = (sets, cards, {w, h} = {w:800, h:400}, {from, to} = {from:1990, to:2030}, legend_w = 150, area_opacity = 0.75) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...color_set_year(year_sets, i, cards));
    }
    return Plot.plot({
        marginLeft: marginLeft,
        width: w,
        height: h,
        color: {
            type: 'categorical',
            legend: true,
            label: 'Color',
            range: ['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'],
            domain: ['black', 'red', 'white', 'green', 'blue', 'mixed', 'colorless']
        },
        x: {
            label: "Time [year]",
            interval: 1,
            tickFormat: d => new String(d)
        },
        y: {
            grid: false,
            label: "↑ Colors in set  [%]",
            percent: true
        },
        marks: [
          Plot.areaY(
            year_to_count, {
                x: "year", 
                y: "color_count", 
                fill: "color", 
                channels: {
                    year: {value: d => new String(d.year), label: 'Year'},
                    black: {value: d => `${d.map.black} - ${(d.map.black * 100 / d.total).toFixed(2)}%`, label: 'Black'},
                    red: {value: d => `${d.map.red} - ${(d.map.red * 100 / d.total).toFixed(2)}%`, label: 'Red'},
                    white: {value: d => `${d.map.white} - ${(d.map.white * 100 / d.total).toFixed(2)}%`, label: 'White'},
                    green: {value: d => `${d.map.green} - ${(d.map.green * 100 / d.total).toFixed(2)}%`, label: 'Green'},
                    blue: {value: d => `${d.map.blue} - ${(d.map.blue * 100 / d.total).toFixed(2)}%`, label: 'Blue'},
                    mixed: {value: d => `${d.map.mixed} - ${(d.map.mixed * 100 / d.total).toFixed(2)}%`, label: 'Mixed'},
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
                        mixed: true,
                        colorless: true,
                    }
                },
                order: ['black', 'red', 'white', 'green', 'blue', 'mixed', 'colorless'],
            }),
          Plot.ruleY([0])
        ]
      });
}

export const color_per_year_bar_plot = (sets, cards, {w, h} = {w:800, h:400}, {from, to} = {from:1990, to:2030}, legend_w = 150, area_opacity = 0.75) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...color_set_year(year_sets, i, cards));
    }

    return Plot.plot({
        marginLeft: marginLeft,
        width: w,
        height: h,
        color: {
            type: 'categorical',
            legend: true,

            range: ['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'],
            domain: ['black', 'red', 'white', 'green', 'blue', 'mixed', 'colorless']
        },
        x: {tickFormat: d => new String(d), interval: 1, label: "Time [year]"},
        y: {
          grid: false,
          label: "↑ Colors in set (ratio)"
        },
        marks: [
          Plot.barY(year_to_count, {x: "year", y: "color_count", fill: "color", title: "color", tip: "x", order: ['black', 'red', 'white', 'green', 'blue', 'mixed', 'colorless']}),
          Plot.ruleY([0])
        ]
      });
}

export const color_per_year_area = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}, legend_w = 150, area_opacity = 0.75) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...color_set_year(year_sets, i, cards));
    }

    const data = year_to_count;
    const subgroups = d3.union(data.map(d => d.color));
    const idx = d3.index(data, d => d.year, d => d.color);

    var series = d3.stack()
        .keys(subgroups)
        .value(([, group], key) => group.get(key).color_count)
        (idx);

    const x = d3.scaleUtc()
        .domain(d3.extent(series[0], d => d.data[0]))
        .range([marginLeft, w-legend_w - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([h - marginBottom, marginTop]);


    const svg = d3.create("svg")
    .attr("width", w-marginRight-legend_w + 10)
    .attr("height", h-marginBottom-marginTop)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;")
    .style("-webkit-tap-highlight-color", "transparent")
    .style("overflow", "visible")
    .on("pointerenter pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#838383','#006600','#CC0000', '#000000', '#0066CC', '#FFFFFF', '#FFCC00']);

    const area = d3.area()
      .x(d => x(d.data[0]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    svg.append("g")
    .attr("transform", `translate(0,${h - marginBottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("Y")).ticks(w / 62).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(h / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", w-legend_w - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Set composition"));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", w-legend_w/2)
        .attr("y", h-40 )
        .text("→ Time (year)");

    svg.append("g")
        .selectAll("myLayers")
        .data(series)
        .join("path")
            .attr("class", function(d) {return "myArea " + d.key;})
            .attr("fill", d => color(d.key))
            .attr("d", area)
            .attr('opacity', area_opacity)

    const tooltip_legend = d3.select("body")
        .append("div")
        .style("visibility", "hidden")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("width", "250px")
        .style("height", "auto")
        .style("position", "absolute");

    var highlight = function(event, d){
        console.log(event);
        d3.selectAll(".myArea").style("opacity", .25);
        d3.select("." + d).style("opacity", 1);
        tooltip_legend.style("visibility", "visible");
        tooltip_legend.html(`set ${d}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }
    
    var noHighlight = function(event, d){
        d3.selectAll(".myArea").style("opacity", area_opacity);
        tooltip_legend.style("visibility", "hidden");
    }

    var label_size = 20
    svg.selectAll("myrect")
        .data(subgroups)
        .join("rect")
        .attr("x", w - legend_w)
        .attr("y", function(d,i){ return 200 - i*(label_size+5)})
        .attr("width", label_size)
        .attr("height", label_size)
        .style("fill", function(d){ return color(d)})
        .style("stroke", "black")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    svg.selectAll("mylabels")
        .data(subgroups)
        .join("text")
          .attr("x", w - legend_w + label_size*1.2)
          .attr("y", function(d,i){ return 200 - i*(label_size+5) + (label_size/2)})
          .style("fill", 'black')
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)
    
    // Create the tooltip container.

  function formatValue(value) {
    return value.toLocaleString("en");
  }

  const rule = svg.append("g")
      .append("line")
      .attr("y1", h-marginBottom-marginTop)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr('stroke-width', 2)
      .style("display", "none");

  const tooltips = [];
  const circles = []
  const cs = ['colorless', 'green', 'red', 'black', 'blue', 'white', 'mixed']
  for (let j = 0; j < cs.length; j++) {
    const tooltip = svg.append("g");
    const circle = svg.append("circle")
        .attr("id", "circleBasicTooltip")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "#000000")
        .style("display", "none");
    tooltips.push(tooltip)
    circles.push(circle)
  }
  
  // Add the event listeners that show or hide the tooltip.
  const bisect = d3.bisector(d => d.year).center;
  function pointermoved(event) {
    const pointer_x = d3.pointer(event)[0]
    if (pointer_x < w - legend_w) {
        const i = bisect(data, x.invert(pointer_x));
        const x_trans = idx.get(data[i].year).get('green').year;
        let y_trans = 0;
            for (let j = 0; j < tooltips.length; j++) {
                y_trans += idx.get(data[i].year).get(cs[j]).color_count;
                const tooltip = tooltips[j]
                const circle = circles[j]

                tooltip.style("display", null);
                tooltip.attr("transform", `translate(${x(x_trans) + 20},${y(y_trans)})`);

                circle.style("display", null);
                circle.attr("transform", `translate(${x(x_trans)},${y(y_trans)})`);

                rule.style("display", null);
                rule.attr("transform", `translate(${x(x_trans)},${y(y_trans)})`);

                const path = tooltip.selectAll("path")
                .data([,])
                .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black");

                const text = tooltip.selectAll("text")
                .data([,])
                .join("text")
                .call(text => text
                    .selectAll("tspan")
                    .data([formatValue(idx.get(data[i].year).get(cs[j]).color_count)])
                    .join("tspan")
                    .attr("x", 0)
                    .attr("y", (_, i) => `${i * 1.1}em`)
                    .attr('font-weight', 900)
                    .attr('stroke', 'white')
                    .attr("font-size", '18')
                    .text(d => d));
            }
    }
    
  }

  function pointerleft() {
    tooltips.forEach(tooltip => {tooltip.style("display", "none");})
    circles.forEach(circle => {circle.style("display", "none");})
    rule.style("display", "none");
    }
    return svg.node();
}

const rarity_set_year = (year_sets, year, cards) => {
    const rarity_count = {
        common: 0,
        uncommon: 0,
        rare: 0,
        mythic: 0,
        special: 0,
        bonus: 0
    };

    let card_colors = [];
    let cards_in_set = 0;

    year_sets.forEach(set => {
        const cards_list = cards[set.code].flat().filter(card => card.rarity != null).map(card => card.rarity);
        cards_in_set += cards_per_set(cards_list);
        cards_list.forEach(rarity => rarity_count[rarity]++);
    });

    Object.keys(rarity_count).forEach(key => {
        card_colors.push({
            year: year,
            rarity: key,
            rarity_count: rarity_count[key] / cards_in_set,
        });
    });
    return card_colors;
}

export const rarity_per_year_area = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}, legend_w = 150, area_opacity = 1) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...rarity_set_year(year_sets, i, cards));
    }

    const data = year_to_count;
    const subgroups = d3.union(data.map(d => d.rarity));
    const idx = d3.index(data, d => d.year, d => d.rarity);

    var series = d3.stack()
        .keys(subgroups)
        .value(([, group], key) => group.get(key).rarity_count)
        (idx);
    
    const x = d3.scaleUtc()
        .domain(d3.extent(series[0], d => d.data[0]))
        .range([marginLeft, w-legend_w - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([h - marginBottom, marginTop]);


    const svg = d3.create("svg")
    .attr("width", w-marginRight-legend_w + 10)
    .attr("height", h-marginBottom-marginTop)
    .attr("style", "max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;")
    .style("-webkit-tap-highlight-color", "transparent")
    .style("overflow", "visible")
    .on("pointerenter pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#F09EA7','#F6CA94','#FAFABE', '#C1EBC0', '#C7CAFF', '#F6C2F3']);

    const area = d3.area()
      .x(d => x(d.data[0]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    svg.append("g")
    .attr("transform", `translate(0,${h - marginBottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("Y")).ticks(w / 62).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(h / 80))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", w-legend_w - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Rarity ratio"));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", w-legend_w/2)
        .attr("y", h-40 )
        .text("→ Time (year)");

    svg.append("g")
        .selectAll("myLayers")
        .data(series)
        .join("path")
            .attr("class", function(d) {return "myArea " + d.key;})
            .attr("fill", d => color(d.key))
            .attr("d", area)
            .attr('opacity', area_opacity)

    const tooltip_legend = d3.select("body")
        .append("div")
        .style("visibility", "hidden")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("width", "250px")
        .style("height", "auto")
        .style("position", "absolute");

    var highlight = function(event, d){
        console.log(event);
        d3.selectAll(".myArea").style("opacity", .25);
        d3.select("." + d).style("opacity", 1);
        tooltip_legend.style("visibility", "visible");
        tooltip_legend.html(`set ${d}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }
    
    var noHighlight = function(event, d){
        d3.selectAll(".myArea").style("opacity", area_opacity);
        tooltip_legend.style("visibility", "hidden");
    }

    var label_size = 20
    svg.selectAll("myrect")
        .data(subgroups)
        .join("rect")
        .attr("x", w - legend_w)
        .attr("y", function(d,i){ return 200 - i*(label_size+5)})
        .attr("width", label_size)
        .attr("height", label_size)
        .style("fill", function(d){ return color(d)})
        .style("stroke", "black")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    svg.selectAll("mylabels")
        .data(subgroups)
        .join("text")
          .attr("x", w - legend_w + label_size*1.2)
          .attr("y", function(d,i){ return 200 - i*(label_size+5) + (label_size/2)})
          .style("fill", 'black')
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)
    
    // Create the tooltip container.

  function formatValue(value) {
    return value.toLocaleString("en");
  }

  const rule = svg.append("g")
      .append("line")
      .attr("y1", h-marginBottom-marginTop)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr('stroke-width', 2)
      .style("display", "none");

  const tooltips = [];
  const circles = []
  const cs = ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus']
  for (let j = 0; j < cs.length; j++) {
    const tooltip = svg.append("g");
    const circle = svg.append("circle")
        .attr("id", "circleBasicTooltip")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "#000000")
        .style("display", "none");
    tooltips.push(tooltip)
    circles.push(circle)
  }
  
  // Add the event listeners that show or hide the tooltip.
  const bisect = d3.bisector(d => d.year).center;
  function pointermoved(event) {
    const pointer_x = d3.pointer(event)[0]
    if (pointer_x < w - legend_w) {
        const i = bisect(data, x.invert(pointer_x));
        const x_trans = idx.get(data[i].year).get('common').year;
        let y_trans = 0;
            for (let j = 0; j < tooltips.length; j++) {
                y_trans += idx.get(data[i].year).get(cs[j]).rarity_count;
                const tooltip = tooltips[j]
                const circle = circles[j]

                tooltip.style("display", null);
                tooltip.attr("transform", `translate(${x(x_trans) + 20},${y(y_trans)})`);

                circle.style("display", null);
                circle.attr("transform", `translate(${x(x_trans)},${y(y_trans)})`);

                rule.style("display", null);
                rule.attr("transform", `translate(${x(x_trans)},${y(y_trans)})`);

                const path = tooltip.selectAll("path")
                .data([,])
                .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black");

                const text = tooltip.selectAll("text")
                .data([,])
                .join("text")
                .call(text => text
                    .selectAll("tspan")
                    .data([formatValue(idx.get(data[i].year).get(cs[j]).rarity_count)])
                    .join("tspan")
                    .attr("x", 0)
                    .attr("y", (_, i) => `${i * 1.1}em`)
                    .attr('font-weight', 900)
                    .attr('stroke', 'white')
                    .attr("font-size", '18')
                    .text(d => d));
            }
    }
    
  }

  function pointerleft() {
    tooltips.forEach(tooltip => {tooltip.style("display", "none");})
    circles.forEach(circle => {circle.style("display", "none");})
    rule.style("display", "none");
    }
    return svg.node();
}

export const cards_per_set_per_year = (sets, cards, {from, to} = {from:1990, to:2030}) => {
    const actual = [];
    filter_years(sets, from, to).sort((a, b) => a.release - b.release).forEach(set => {
        const cards_list = cards[set.code].flat();
        const n_cards = cards_per_set(cards_list);

       actual.push({
          set: set.code,
          release: set.release,
          n: n_cards
       });
    });

    return Plot.plot({
        x: {
          label: "Release date of set"
        },
        y: {
          label: "Number of cards",
        },
        grid: true,
        marks: [
            Plot.frame({fill: "#eaeaea"}),
            Plot.gridY({stroke: "white", strokeOpacity: 1}),
            Plot.gridX({stroke: "white", strokeOpacity: 1}),
            Plot.ruleY([0]),
            Plot.line(actual, {x: "release", y: "n", tip: true, stroke: '#4e79a7'})
        ]
      })
}

const data_reprints_vs_new = (sets, cards, from, to) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        let new_cards = 0;
        let reprints = 0;
        let total = 0;

        year_sets.forEach(set => {
            const card_list = cards[set.code].flat()
            const new_cards_list = card_list.filter(card => card.reprint);
            const reprint_cards_list = card_list.flat().filter(card => !card.reprint);
            new_cards += cards_per_set(new_cards_list);
            reprints += cards_per_set(reprint_cards_list);
            total += cards_per_set(card_list);
        })

        year_to_count.push({
            year: i, 
            count: new_cards,
            count_reprint: reprints,
            count_new: new_cards,
            total: total,
            type: 'New'
        });
        year_to_count.push({
            year: i, 
            count: reprints,
            count_reprint: reprints,
            count_new: new_cards,
            total: total,
            type: 'Reprint'
        });
    }

    return year_to_count;
}

export const reprints = (sets, cards, plot_type='bar', normalized=false, {from, to} = {from:1990, to:2030}) => {
    const data = data_reprints_vs_new(sets, cards, from, to);

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

    let plt;
    if (plot_type == 'bar') {
        plt = Plot.barY(data, config)
    } else if (plot_type == 'area') {
        plt = Plot.areaY(data, config)
    }


    return Plot.plot({
        x: {tickFormat: "", interval: 1, label: "Time [year]", dx: 1},
        y: {label: "Fraction of cards [%]", grid: true, percent: true},
        color: {legend: true, scheme: "Spectral", label: "Release type"},
        marks: [
          plt,
          Plot.ruleY([0]),
        ]
      })
}

const set_type_data = (sets, from, to) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    const types = new Set(sets.map(set => set.set_type.replace('_', ' ')))

    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        const set_type_data = {}
        types.forEach(type => set_type_data[type] = 0)

        year_sets.forEach(set => {
            const type = set.set_type.replace('_', ' ');
            set_type_data[type]++;
        });

        types.forEach(type => {
            year_to_count.push({
                year: i,
                count: set_type_data[type],
                type: type
            })
        })
        
    }
    return year_to_count;
}

export const set_type = (sets, plot_type='bar', normalized=false, {from, to} = {from:1990, to:2030}) => {
    const data = set_type_data(sets, from, to)

    const config = {
        x: "year",
        y: "count",
        fill: "type", 
        tip: true,
        order: ['arsenal', 'box', 'commander', 'core', 'draft innovation', 'expansion', 'masters', 'planechase', 'starter'],
    }

    if (normalized) {
        config.offset = 'normalize'
    }

    let plt;
    if (plot_type == 'bar') {
        plt = Plot.barY(data, config)
    } else if (plot_type == 'area') {
        plt = Plot.areaY(data, config)
    }

    return Plot.plot({
        x: {tickFormat: "", interval: 1, label: "Time [year]", dx: 1},
        y: {label: "Number of sets", grid: true, percent: true},
        color: {legend: true, scheme: 'spectral', label: 'Set Type'},
        marks: [
          plt
        ]
      })
}

export const set_type_dist = (sets, {from, to} = {from:1990, to:2030}) => {
    const data = set_type_data(sets, from, to)
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

export const cards_per_year = (sets, cards, {from, to} = {from:1990, to:2030}) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        let cards_in_set = 0;
        year_sets.forEach(set => {
            const cards_list = cards[set.code].flat();
            cards_in_set += cards_per_set(cards_list);
        })

        year_to_count.push({
            year: i, 
            count: year_sets.length,
            sets: year_sets,
            cards_in_set: Math.round(cards_in_set)
        });
    }

    return Plot.plot({
        x: {tickFormat: "", interval: 1, label: "Time [year]", dx: 1},
        y: {label: "Number of cards", grid: true},
        marks: [
          Plot.barY(year_to_count, {x: "year", y: "cards_in_set", tip: true, fill:'#4e79a7', width:10}),
          // Plot.ruleY([0]),
        ]
      })
}
