import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import regression from "npm:regression";

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

export function filter_sets(sets_pre) {
    const sets = Object.keys(sets_pre).map(k => (sets_pre[k]));
    // const valid = [
    //     "commander", "core", "draft_innovation", "duel_deck", "expansion",
    //     "planechase"," starter"
    // ];
    const valid = ['core', 'expansion', 'commander'];
    return sets.filter(x => valid.includes(x.type));
    /*
     SET TYPES
      9 "alchemy"
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
      */
}

export function set_times(sets, {width, height} = {}, {min, max} = {min: 1990, max: 2024}) {
  // let count = 0;
  // let min_y = Date.now();
  // let max_y = Date.UTC(1970, 0);
  const events_pre = sets
      .map(set => {
          // count++;
          const date = Date.parse(set.release);
          // if (min_y > date) min_y = date;
          // if (max_y < date) max_y = date;
          return {
              code: set.code,
              name: set.name,
              year: set.release,
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

  const mouse_over = (d) => {
      tooltip.style("visibility", "visible");
  }
  const mouse_move = (event, d) => {
      tooltip.html(`Set ${d.name} (Code ${d.code})<br>Released: ${d.year}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY) + "px");
  }

  const mouse_leave = (d) => {
      tooltip.style("visibility", "hidden");
  }

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

    return svg.node();
}

const color_names = [
    "colorless", "green", "red", "gruul", "black", "golgari", "rakdos", "jund",
    "blue", "simic", "izzet", "temur", "dimir", "sultai", "grixis", "non-white",
    "white", "selesnya", "boros", "naya", "orzhov", "abzan", "mardu", "non-blue",
    "azorius", "bant", "jeskai", "non-black", "esper", "non-red", "non-green", "all"
];

const colors = [
    //     WUBRG
    0,  // 00000 colorless
    1,  // 00001 green
    2,  // 00010 red
    3,  // 00011 gruul (red-green)
    4,  // 00100 black
    5,  // 00101 golgari (black-green)
    6,  // 00110 rakdos (black-red)
    7,  // 00111 jund (black-red-green)
    8,  // 01000 blue
    9,  // 01001 simic (blue-green)
    10, // 01010 izzet (blue-red)
    11, // 01011 temur (blue-red-green)
    12, // 01100 dimir (blue-black)
    13, // 01101 sultai (blue-black-green)
    14, // 01110 grixis (blue-black-red)
    15, // 01111 non-white (blue-black-red-green)
    16, // 10000 white
    17, // 10001 selesnya (white-green)
    18, // 10010 boros (white-red)
    19, // 10011 naya (white-red-green)
    20, // 10100 orzhov (white-black)
    21, // 10101 abzan (white-black-green)
    22, // 10110 mardu (white-black-red)
    23, // 10111 non-blue (white-black-red-green)
    24, // 11000 azorius (white-blue)
    25, // 11001 bant (white-blue-green)
    26, // 11010 jeskai (white-blue-red)
    27, // 11011 non-black (white-blue-red-green)
    28, // 11100 esper (white-blue-black)
    29, // 11101 non-red (white-blue-black-green)
    30, // 11110 non-green (white-blue-black-red)
    31  // 11111 all colors/WUBRG/...
];

export function set_colors(sets, cards) {
    const area_colors = {
        0: 'grey', 1: 'green', 2: 'red', 4: 'blue', 8: 'purple', 16: 'white'
    };

    const cards_proc = cards.map(c => {
        return {
            colors: c.colors,
            set: c.set_id
        };
    });

    const data = sets.map(set => {
        const by_color = {
            white: 0, blue: 0, black: 0, red: 0, green: 0,
            colorless: 0, multicolor: 0
        };
        let total = 0;
        cards_proc.filter(c => c.set === set.code).forEach(card => {
            switch (color_names[card.colors]) {
                case 'white':
                    by_color['white']++;
                    break;

                case 'blue':
                    by_color['blue']++;
                    break;

                case 'black':
                    by_color['black']++;
                    break;

                case 'red':
                    by_color['red']++;
                    break;

                case 'green':
                    by_color['green']++;
                    break;

                case 'colorless':
                    by_color['colorless']++;
                    break;

                default:
                    by_color['multicolor']++;
                    break;
            }
            total++;
        });

        by_color.white = by_color.white / total * 100.0;
        by_color.blue = by_color.blue / total * 100.0;
        by_color.black = by_color.black / total * 100.0;
        by_color.red = by_color.red / total * 100.0;
        by_color.green = by_color.green / total * 100.0;
        by_color.colorless = by_color.colorless / total * 100.0;
        by_color.multicolor = by_color.multicolor / total * 100.0;

        return {
            code: set.code,
            date: new Date(Date.parse(set.release)),
            total: total,
            ...by_color
        };
    }).sort((a, b) => a.date - b.date);

    const margin = {top: 20, right: 30, bottom: 30, left: 55};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
        .domain(color_names)
        // .range(['#ded8b9', '#b7eaf4', '#d2c1a7', '#f4976e', '#a9d899', '#6887a7', '#e8d46d']);
        .range(['#ffff8f', '#0000ff', '#200020', '#ff0000', '#00ff00', '#606060', '#ffff00']);

    const keys = ['white', 'blue', 'black', 'red', 'green', 'colorless', 'multicolor'];
    const colors = {
        white: '#ffff8f',
        blue: '#0000ff',
        black: '#200020',
        red: '#ff0000',
        green: '#00ff00',
        colorless: '#606060',
        multicolor: '#ffff00'
    };

    const stacked = d3.stack()
        .keys(keys)(data);

    console.log(stacked);

    svg.selectAll('mylayers')
        .data(stacked)
        .join('path')
        .style('fill', (d) => colors[d.key])
        .attr('d', d3.area()
            .x((d, i) => x(data[i].date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
        );
    return svg.node();
}

export function complexity(sets, cards) {
    const data = sets.map(set => {
        const complexity = cards
            .filter(c => c.set_id === set.code)
            .map(card => card.oracle_text == null ? '' : card.oracle_text)
            .map(card => card.replace('/\s*\(.*?\)\s*/g', '')) // remove reminder text
            .map(card => card.split(' ').length) // #words in oracle text

        const min = Math.min(...complexity);
        const max = Math.max(...complexity);
        const avg = complexity.reduce((a, b) => a + b, 0) / complexity.length;

        return {
            code: set.code,
            date: new Date(Date.parse(set.release)),
            min: min,
            max: max,
            avg: avg
        };
    }).sort((a, b) => a.date - b.date);

    const begin = data[0].date.getTime();

    const reg_avg_in = data.map(k => [k.date.getTime() - begin, k.avg]);
    const reg_max_in = data.map(k => [k.date.getTime() - begin, k.max]);

    console.log('Average regression input', reg_avg_in);
    console.log('Maximum regression input', reg_max_in);

    const reg_avg = regression.linear(reg_avg_in, {order: 3, precision: 10}).equation;
    const reg_max = regression.linear(reg_max_in, {order: 3, precision: 10}).equation;

    console.log('Average regression', reg_avg);
    console.log('Maximum regression', reg_max);

    const reg_avg_points = [
        { x: begin, y: reg_avg[1] },
        { x: data[data.length - 1].date.getTime(), y: reg_avg[1] + reg_avg[0] * (data[data.length - 1].date.getTime() - begin) }
    ];

    const reg_max_points = [
        { x: begin, y: reg_max[1] },
        { x: data[data.length - 1].date.getTime(), y: reg_max[1] + reg_max[0] * (data[data.length - 1].date.getTime() - begin) }
    ];

    const margin = {top: 20, right: 30, bottom: 30, left: 55};
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d.max))])
        .range([height - margin.bottom, margin.top]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(d.date))
            .y(d => y(d.avg))
        );

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(d.date))
            .y(d => y(d.max))
        );

    svg.append('path')
        .datum(reg_avg_points)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(new Date(d.x)))
            .y(d => y(d.y))
        );

    svg.append('path')
        .datum(reg_max_points)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(new Date(d.x)))
            .y(d => y(d.y))
        );

    return svg.node();
}