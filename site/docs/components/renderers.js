import * as d3 from 'npm:d3';
import * as Plot from "npm:@observablehq/plot";

const marginTop = 20, marginBottom = 40, marginLeft = 40, marginRight = 20;

const date_options = { day: 'numeric', 'month': 'short', year: 'numeric' };
const mk_utc_x = (width, extent) => d3.scaleUtc().domain(extent).range([marginLeft, width - marginRight]);
const mk_lin_y = (height, extent) => d3.scaleLinear().domain(extent).range([height - marginBottom, marginTop]);

const diff_months = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

const filter_years = (sets, from, to) => sets.filter(set => set.release.getFullYear() >= from && set.release.getFullYear() <= to);

const cards_per_set = (cards_list) => {
    let n_cards = 0;

        cards_list.forEach(card => {
        n_cards++;
    });
    return n_cards;
}

const get_color_by_code = (code) => {
    switch (code) {
        case 'W':
            return 'white';

        case 'U':
            return 'blue';
        
        case 'B':
            return 'black';

        case 'R':
            return 'red';
            
        case 'G':
            return 'green';
    }
}

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

export const color_per_year_area_plot = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}, legend_w = 150, area_opacity = 0.75) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push(...color_set_year(year_sets, i, cards));
    }

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
          Plot.areaY(year_to_count, {x: "year", y: "color_count", fill: "color", title: "color", tip: "x"}),
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

export const cards_per_set_per_year = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
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
            Plot.line(actual, {x: "release", y: "n", tip: true})
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
        y: {abel: "Number of cards", grid: true},
        marks: [
          Plot.barY(year_to_count, {x: "year", y: "cards_in_set", tip: true, fill:'#4e79a7', width:10}),
          // Plot.ruleY([0]),
        ]
      })
}

const get_card_color = (card) => {
    if (card.colors.length > 1) {
        return 'mixed';
    } else {
        return  get_color_by_code(card.colors[0]);
    }
}

const get_card_type = (card) => {
    const card_type_str = (new String(card.type_line)).split(' — ')[0].split(' ')
    if (card_type_str.length > 1) {
        return 'multi';
    } else {
        return card_type_str[0]
    }
}


export const cards_color_type = (sets, cards) => {
    const aggregate = [];
    const colors = [];
    const types = [];

    sets.forEach(set => {
        const cards_list = cards[set.code].flat()
            .filter(card => card.colors != null)
            .filter(card => card.colors.length != 0)
            .filter(card => card.type_line != null)
            .map(card => {
                const color = get_card_color(card);
                const type = get_card_type(card);
                if (!colors.includes(color)) {
                    colors.push(color)
                }

                if (!types.includes(type)) {
                    types.push(type)
                }

                return {
                    card: card,
                    color: color,
                    type: type
                }
        });
        aggregate.push(...cards_list);
    })

    return Plot.plot({
        marginLeft: 80,
        padding: 0.05,
        x: {grid: true, label: 'Card type'},
        y: {grid: true, label: 'Card color'},
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

const color_scheme_map = (color_name) => {
    const map = {
        colorless: 'Viribdis',
        green: 'Greens',
        red: 'Reds',
        black: 'Greys',
        blue: 'Blues',
        white: 'YlOrBr',
        mixed: 'Purples',
        all: 'YlGnBu'
    }
    return map[color_name.toLowerCase()];
}

const get_color_dataset = (all_sets, color_name, cards) => {
    const aggregate = [];

    all_sets.forEach(set => {
        const cards_list = cards[set.code].flat()
            .filter(card => card.colors != null)
            .filter(card => card.colors.length != 0)
            .filter(card => card.type_line != null)
            .filter(card => card.power != null)
            .filter(card => !card.power.includes('*'))
            .filter(card => !card.toughness.includes('*'))
            .map(card => {
                const color = get_card_color(card);
                const type = get_card_type(card);

                return {
                    card: card,
                    color: color,
                    type: type,
                    power: parseFloat(card.power),
                    toughness: parseFloat(card.toughness),
                    rarity: card.rarity,
                    count: 1
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
                // fill: 'red'
                }
            )
        ]
      });
}

export const cards_rarity_power = (all_sets, color_name, cards) => {
    const dataset = get_color_dataset(all_sets, color_name, cards);
    return Plot.plot({
        marginLeft: 100,
        padding: 0,
        x: {grid: true,  domain: Array.from({length: 20}, (_, i) => i-1)},
        fy: {domain: ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus']},
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
        fy: {domain: ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus']},
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
