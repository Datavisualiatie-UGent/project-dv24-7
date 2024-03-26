import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as d3r from "npm:d3-regression";

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

function diff_months(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function set_times(sets, {width, height} = {}, {min, max} = {min: 1990, max: 2000}) {
  let count = 0;
  let min_y = Date.now();
  let max_y = Date.UTC(1970, 0);
  const events_pre = Object.keys(sets)
      .map(k => {
          count++;
          const date = Date.parse(sets[k].release);
          if (min_y > date) min_y = date;
          if (max_y < date) max_y = date;
          return {
              code: k,
              name: sets[k].name,
              year: sets[k].release,
              y: new Date(date).getUTCFullYear(),
              date: new Date(date)
          };
      })
      .filter(d => d.y >= min && d.y <= max && !d.name.includes("Tokens"))
      .sort((a, b) => a.date - b.date);
  const events = events_pre
      .map((v, i) => ({
        ...v,
        idx: i,
        diff: i === 0 ? 0 : diff_months(events_pre[i - 1].date, v.date),
      }));

  const marginTop = 20, marginBottom = 30, marginLeft = 40, marginRight = 20;

  const x = d3.scaleUtc()
      .domain(d3.extent(events, d => d.date))
      .range([marginLeft, width - marginRight]);

  console.log(events.map(d => d.diff));
  const y = d3.scaleLinear()
      .domain(d3.extent(events, d => d.diff))
      .range([height - marginBottom, marginTop]);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

  const tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

  const mouse_over = (d) => tooltip.style("opacity", 1);
  const mouse_move = (d) =>
      tooltip.html(`Set ${d.name} (${d.code})<br>Released: ${d.year}`)
          .style("left", (d3.mouse(this)[0]/*+90*/) + "px")
          .style("top", (d3.mouse(this)[1]) + "px");

  const mouse_leave = (d) =>
      tooltip.transition().duration(200).style("opacity", 0);

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("stroke", "steelblue")
        .attr("fill", "currentColor")
        .selectAll("circle")
        .data(events)
        .join("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.diff))
        .attr("r", 5)
        .on("mouseover", mouse_over)
        .on("mousemove", mouse_move)
        .on("mouseleave", mouse_leave);

    svg.append("path")
        .datum(events)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.date))
            .y(d => y(d.diff))
        );

    svg.append("path")
        .datum(events)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3r.regressionPoly()
            .x(d => x(d.date))
            .y(d => y(d.diff))
        )


    /*svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("stroke", "white")
        .attr("font-size", 10)
        .selectAll("text")
        .data(events)
        .join("text")
        .attr("dy", "-1em")
        .attr("dx", "0.5em")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.idx))
        .text(d => d.code);*/

    return svg.node();
}
/*
* SET TYPES
*       9 "alchemy"
      4 "archenemy"
      3 "arsenal"
     37 "box"
     31 "commander"
     24 "core"
     15 "draft_innovation"
     27 "duel_deck"
    106 "expansion"
     10 "from_the_vault"
     19 "funny"
     14 "masterpiece"
     29 "masters"
     67 "memorabilia"
     13 "minigame"
      6 "planechase"
      3 "premium_deck"
    272 "promo"
      3 "spellbook"
     15 "starter"
    180 "token"
      2 "treasure_chest"
      2 "vanguard"
* */
export function set_colors(sets, cards, color_combo, width, height) {
    const area_colors = {
        0: 'grey', 1: 'green', 2: 'red', 4: 'blue', 8: 'purple', 16: 'white'
    };

    const cards_proc = cards.map(c => {
        return {
            colors: c.colors,
            set: c.set_id
        };
    });

    const data = Object.keys(sets).map(k => {
        const cards_in_set = cards_proc.filter(c => c.set === k);
        const colored_cards_in_set = cards_in_set.filter(c => c.colors === color_combo);
        return {
            code: k,
            date: new Date(Date.parse(sets[k].release)),
            total: cards_in_set.length,
            selected: colored_cards_in_set.length
        }
    }).sort((a, b) => a.date - b.date);

    const marginTop = 20, marginBottom = 30, marginLeft = 40, marginRight = 20;

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", area_colors[color_combo] === undefined ? 'brown' : area_colors[color_combo])
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.selected / d.total))
        );

    return svg.node();
}