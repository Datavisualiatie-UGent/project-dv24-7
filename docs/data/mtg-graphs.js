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

export function pie_chart_set_type_distribution(typeData) {
    // Specify the chart’s dimensions.
  const width = 500;
  const height = 500;

  // Create the color scale.
  const color = d3.scaleOrdinal()
    // .domain(['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'])
    // .range(['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'])
      .domain(typeData.distribution.sort((a,b) => d3.descending(a.count, b.count)).map(d => d.count))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), typeData.distribution.length).reverse())

  // Create the pie layout and arc generator.
  const pie = d3.pie()
      .sort((a,b) => d3.descending(a.count, b.count))
      .value(d => d.count);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = arc.outerRadius()() * 0.8;

  // A separate arc generator for labels.
  const arcLabel = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

  console.log("HELPIO")
  console.log(typeData.distribution)
  const arcs = pie(typeData.distribution);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Add a sector path for each value.
  svg.append("g")
      .attr("stroke", "white")
    .selectAll()
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.count))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.type}: ${d.data.count}\n${d.data.type === 'other' ? 'set types: arsenal & planechase' : ''}`);

  // Create a new arc generator to place a label close to the edge.
  // The label shows the value if there is enough room.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
        //   .attr("fill", "gray")
          .attr("font-size", 12)
          .attr("font-weight", "bold")
          .text(d => d.data.type))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.1).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
        //   .attr("fill", "gray")
          .attr("font-size", 12)
          .attr("fill-opacity", 0.7)
          .text(d => d.data.count));

  return svg.node();
}

export function pie_chart_color_distribution(colorData, width = 500, height = 500) {
    // Specify the chart’s dimensions.
//   width = Math.min(width, height);
//   height = Math.min(width, height);

  // Create the color scale.
  const color = d3.scaleOrdinal()
    .domain(['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'])
    .range(['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'])
    //   .domain(colorData.map(d => d.color))
    //   .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), colorData.length).reverse())
//   const color = function (colorname) {
//     if (colorname === 'multicolor') {
//         return 'purple';
//     }
//     if (colorname === 'colorless') {
//         return 'gray';
//     } 
//     if (colorname === 'white') {
//         return 'lightgray';
//     }
//     return colorname;
//   }

  // Create the pie layout and arc generator.
  const pie = d3.pie()
      .sort((a,b) => d3.ascending(a.order, b.order))
      .value(d => d.total);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = arc.outerRadius()() * 0.8;

  // A separate arc generator for labels.
  const arcLabel = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

  const arcs = pie(colorData);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Add a sector path for each value.
  svg.append("g")
      .attr("stroke", "white")
    .selectAll()
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.color))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.color}: ${d.data.total}`);

  // Create a new arc generator to place a label close to the edge.
  // The label shows the value if there is enough room.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("fill", "gray")
          .attr("font-size", 15)
          .attr("font-weight", "bold")
          .text(d => d.data.color))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill", "gray")
          .attr("font-size", 15)
          .attr("fill-opacity", 0.7)
          .text(d => d.data.total));

  return svg.node();
}

export function cmc_bars_by_color_left(dataLeft, {width, height} = {}) {
    // return Plot.rectY(data, Plot.binX({y: "count"}, {x: d3.randomNormal()})).plot();
    return Plot.plot({
        width: 400,
        height: height,
        marks: [
            Plot.barX(dataLeft, {
                marginLeft: 100,
                // y: (d) => d.layout,
                // x: (d) => d.count
                x: 'count',
                y: d => parseInt(d['mana_cost'])
            })
        ],
        y: {reverse: true},
        x: {reverse: true}
    });
}

export function attribute_bars_by_color_d3(cards, colorLeft, colorRight, attribute, {w, h} = {}) {
    const width = 800/3*2;
    const height = 600/3*2;
    /* const barPadding = 1;
    // d3.select("div.d3-cmc-bars-by-color").append("svg").attr("class", "d3-cmc-bars-by-color").attr("width", width).attr("height", height);
    // d3.select("svg.d3-cmc-bars-by-color")
    
    const xScale = d3.scaleLinear()

    // const data = Object.entries(dataLeft);
    const data = dataLeft;
    console.log("hey");
    console.log(dataLeft);
    console.log(data);
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);;

    svg.append("g")
      .selectAll("rect")
    //   .data(dataLeft.entries())
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => width - parseInt(d.mana_cost) * 4)
      .attr("y", (d, i) => i * (height / data.length))
      .attr("width", d => d.count)
      .attr("height", d => height / data.length - barPadding)
    //   .style("x", d => parseInt(d[0]))
    //   .style("y", d => parseInt(d[1]/4) + "px");
    return svg.node(); */
    let dataLeft;
    let dataRight;
    if (attribute === "mana cost") {
        const cmc_count_by_color_left = cards.cmc_count_by_color[colorLeft];
        const cmc_data_left = Object.keys(cmc_count_by_color_left).map((key) => ({mana_cost: key, count: cmc_count_by_color_left[key]}));
        dataLeft = cmc_data_left.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null' && parseInt(d.mana_cost) <= 8 && d.mana_cost !== '0.5');
        
        const cmc_count_by_color_right = cards.cmc_count_by_color[colorRight];
        const cmc_data_right = Object.keys(cmc_count_by_color_right).map((key) => ({mana_cost: key, count: cmc_count_by_color_right[key]}));
        dataRight = cmc_data_right.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null' && parseInt(d.mana_cost) <= 8 && d.mana_cost !== '0.5');
    }
    if (attribute === "power") {
        const power_count_by_color_left = cards.power_count_by_color[colorLeft];
        const power_data_left = Object.keys(power_count_by_color_left).map((key) => ({power: key, count: power_count_by_color_left[key]}));
        dataLeft = power_data_left.filter(d => d.power !== 'total' && d.power !== 'null' && parseInt(d.power) <= 8 && d.power !== '*' && d.power !== '-1' && d.power !== '+1' && d.power !== '+0' && d.power !== '1+*' && d.power !== '+2' && d.power !== '+4' && d.power !== '2.5' && d.power !== '?' && d.power !== '+3' && d.power !== '*²' && d.power !== '3.5' && d.power !== '∞' && d.power !== '2+*' && d.power !== '1.5' && d.power !== '.5');
        
        const power_count_by_color_right = cards.power_count_by_color[colorRight];
        const power_data_right = Object.keys(power_count_by_color_right).map((key) => ({power: key, count: power_count_by_color_right[key]}));
        dataRight = power_data_right.filter(d => d.power !== 'total' && d.power !== 'null' && parseInt(d.power) <= 8 && d.power !== '*' && d.power !== '-1' && d.power !== '+1' && d.power !== '+0' && d.power !== '1+*' && d.power !== '+2' && d.power !== '+4' && d.power !== '2.5' && d.power !== '?' && d.power !== '+3' && d.power !== '*²' && d.power !== '3.5' && d.power !== '∞' && d.power !== '2+*' && d.power !== '1.5' && d.power !== '.5');
    }
    if (attribute === "toughness") {
        const toughness_count_by_color_left = cards.toughness_count_by_color[colorLeft];
        const toughness_data_left = Object.keys(toughness_count_by_color_left).map((key) => ({toughness: key, count: toughness_count_by_color_left[key]}));
        dataLeft = toughness_data_left.filter(d => d.toughness !== 'total' && d.toughness !== 'null' && parseInt(d.toughness) <= 8 && d.toughness !== '*' && d.toughness !== '-1' && d.toughness !== '+1' && d.toughness !== '+0' && d.toughness !== '1+*' && d.toughness !== '+2' && d.toughness !== '+4' && d.toughness !== '2.5' && d.toughness !== '?' && d.toughness !== '+3' && d.toughness !== '*²' && d.toughness !== '3.5' && d.toughness !== '∞' && d.toughness !== '2+*' && d.toughness !== '1.5' && d.toughness !== '.5' && d.toughness !== '-0' && d.toughness !== '7-*');
        
        const toughness_count_by_color_right = cards.toughness_count_by_color[colorRight];
        const toughness_data_right = Object.keys(toughness_count_by_color_right).map((key) => ({toughness: key, count: toughness_count_by_color_right[key]}));
        dataRight = toughness_data_right.filter(d => d.toughness !== 'total' && d.toughness !== 'null' && parseInt(d.toughness) <= 8 && d.toughness !== '*' && d.toughness !== '-1' && d.toughness !== '+1' && d.toughness !== '+0' && d.toughness !== '1+*' && d.toughness !== '+2' && d.toughness !== '+4' && d.toughness !== '2.5' && d.toughness !== '?' && d.toughness !== '+3' && d.toughness !== '*²' && d.toughness !== '3.5' && d.toughness !== '∞' && d.toughness !== '2+*' && d.toughness !== '1.5' && d.toughness !== '.5' && d.toughness !== '-0' && d.toughness !== '7-*');
    }

    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    const data = left_data.concat(right_data);

    
  const color = d3.scaleOrdinal()
  .domain(['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'])
  .range(['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'])

    let colorLeft_color = color(colorLeft)
    // let colorLeft_color = colorLeft
    // if (colorLeft === "multicolor") {
    //     colorLeft_color = "purple";
    // }
    // if (colorLeft === "colorless") {
    //     colorLeft_color = "gray";
    // }
    // if (colorLeft === "white") {
    //     colorLeft_color = "lightgray";
    // }

    let colorRight_color = color(colorRight)
    // let colorRight_color = colorRight 
    // if (colorRight === "multicolor") {
    //     colorRight_color = "purple";
    // }
    // if (colorRight === "colorless") {
    //     colorRight_color = "gray";
    // }
    // if (colorRight === "white") {
    //     colorRight_color = "lightgray";
    // }

    
    let attr = attribute;
    if (attribute === "mana cost") {
        attr = "mana_cost"
    }

    const margin = ({top: 20, right: 20, bottom: 40, left: 20})

    const xLeft = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count*1.1)])
    .rangeRound([width / 2, margin.left])

    const xRight = d3.scaleLinear()
    .domain(xLeft.domain())
    .rangeRound([width / 2, width - margin.right])

    const y = d3.scaleBand()
    .domain(data.map(d => d[attr]))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(g => g.append("g").call(d3.axisBottom(xLeft).ticks(width / 150, "m").tickSizeOuter(0)))
    // .call(g => g.append("g").call(d3.axisBottom(xM).tickSizeInner(width / 80, "m")))
    .call(g => g.append("g").call(d3.axisBottom(xRight).ticks(width / 150, "m").tickSizeOuter(0)))
    .call(g => g.selectAll(".domain"))
    .call(g => g.selectAll(".tick:first-of-type"))
    .call(g => g.selectAll(".tick text").attr("fill", "black").attr("font-size", 15))
    // .call(d3.innerTickSize(-100))

    const yAxis = g => g
    // .attr("transform", `translate(${xM(0)},0)`)
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.selectAll(".tick text").attr("fill", "black").attr("font-size", 15))

    // const yAxisGrid = d3.axisLeft(y).tickSize(margin.left + margin.right - width).tickFormat('')
    const xAxisGridRight = d3.axisBottom(xRight)
        .tickSize(margin.top + margin.bottom - height)
        .tickFormat('')
        .ticks(width/150, "m")
        .tickSizeOuter(0)
    
    const xAxisGridLeft = d3.axisBottom(xLeft)
        .tickSize(margin.top + margin.bottom - height)
        .tickFormat('')
        .ticks(width/150, "m")
        .tickSizeOuter(0)

    const svg = d3.create("svg").attr("width", width).attr("height", height)
        .attr("font-family", "sans-serif")
        .attr("font-size", 15);
      
        // svg.append("g")
        //     .attr("fill", "black")
        //   .selectAll("text")
        //   .data(data)
        //   .join("text")
        //     .attr("text-anchor", d => d.side === "L" ? "end" : "start")
        //     .attr("x", d => d.side === "L" ? xM(d.count) - 4 : xF(d.count) + 4)
        //     .attr("y", d => y(d[attr]) + y.bandwidth() / 2)
        //     .attr("dy", "0.35em")
        //     .text(d => d.count);
      
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", colorLeft_color)
        .attr("dy", "0.35em")
        .attr("x", 125)
        .attr("y", 75)
        .attr("font-size", 30)
        .text(colorLeft);
      
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", colorRight_color)
        .attr("dy", "0.35em")
        .attr("x", width - 125)
        .attr("y", 75)
        .attr("font-size", 30)
        .text(colorRight);
      
    svg.append("g")
        .call(xAxis);
      
    svg.append("g")
        .call(yAxis);

        // svg.append("g")
        //     .attr('class', 'x axis-grid')
        //     .attr('transform', 'translate(' + margin.left+ ', 0)')
        //     .call(yAxisGrid);

    svg.append("g")
        .attr('class', 'y axis-grid')
        .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
        .call(xAxisGridRight);

    svg.append("g")
        .attr('class', 'y axis-grid')
        .attr('transform', 'translate(0, ' + (height - margin.bottom) + ')')
        .call(xAxisGridLeft);
            // .selectAll(".axis-grid")
            // .attr("stroke", "blue");
        
        // svg.append("g")
        //     .call(xAxisGridF);
            
        // var xAxisGrid = xAxis.ticks(6)
        //     .tickSize(-h, 0)
        //     .tickFormat("")
        //     .orient("top");

        // svg.append("g")
        //     .classed('x', true)
        //     .classed('grid', true)
        //     .call(xAxisGrid);

    svg.append("g")
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height - 6)
        .text("card count");

    svg.append("g")
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", 5)
        .attr("dy", ".75em")
        .text(`↑ ${attribute}`);

    svg.selectAll(".axis-grid .tick line")
        .attr("stroke", "lightgray")
      
    svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("fill", d => d.side === "L" ? colorLeft_color : colorRight_color)
        .attr("x", d => d.side === "L" ? xLeft(d.count) : xRight(0))
        .attr("y", d => y(d[attr]))
        .attr("width", d => d.side === "L" ? xLeft(0) - xLeft(d.count) : xRight(d.count) - xRight(0))
        .attr("height", y.bandwidth())
        .append("title")
        .text(d => `${attribute}: ${d[attr]}\ncount: ${d.count}`);
      
    return svg.node();
}

export function cmc_bars_by_color_d3(dataLeft, dataRight, colorLeft, colorRight, {w, h} = {}) {
    const width = 800;
    const height = 600;
    /* const barPadding = 1;
    // d3.select("div.d3-cmc-bars-by-color").append("svg").attr("class", "d3-cmc-bars-by-color").attr("width", width).attr("height", height);
    // d3.select("svg.d3-cmc-bars-by-color")
    
    const xScale = d3.scaleLinear()

    // const data = Object.entries(dataLeft);
    const data = dataLeft;
    console.log("hey");
    console.log(dataLeft);
    console.log(data);
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);;

    svg.append("g")
      .selectAll("rect")
    //   .data(dataLeft.entries())
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => width - parseInt(d.mana_cost) * 4)
      .attr("y", (d, i) => i * (height / data.length))
      .attr("width", d => d.count)
      .attr("height", d => height / data.length - barPadding)
    //   .style("x", d => parseInt(d[0]))
    //   .style("y", d => parseInt(d[1]/4) + "px");
    return svg.node(); */
    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    const data = left_data.concat(right_data);
    console.log(data);

    let colorLeft_color = colorLeft 
    if (colorLeft === "multicolor") {
        colorLeft_color = "purple";
    }
    if (colorLeft === "colorless") {
        colorLeft_color = "gray";
    }
    if (colorLeft === "white") {
        colorLeft_color = "lightgray";
    }

    let colorRight_color = colorRight 
    if (colorRight === "multicolor") {
        colorRight_color = "purple";
    }
    if (colorRight === "colorless") {
        colorRight_color = "gray";
    }
    if (colorRight === "white") {
        colorRight_color = "lightgray";
    }

    const margin = ({top: 10, right: 50, bottom: 20, left: 50})

    const xM = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .rangeRound([width / 2, margin.left])

    const xF = d3.scaleLinear()
    .domain(xM.domain())
    .rangeRound([width / 2, width - margin.right])

    const y = d3.scaleBand()
    .domain(data.map(d => d.mana_cost))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "m")))
    .call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "m")))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll(".tick:first-of-type").remove())

    const yAxis = g => g
    .attr("transform", `translate(${xM(0)},0)`)
    .call(d3.axisRight(y).tickSizeOuter(0))
    .call(g => g.selectAll(".tick text").attr("fill", "white").attr("font-size", 15))

        const svg = d3.create("svg").attr("width", width).attr("height", height)
            .attr("font-family", "sans-serif")
            .attr("font-size", 15);
      
        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("fill", d => d.side === "L" ? colorLeft_color : colorRight_color)
            .attr("x", d => d.side === "L" ? xM(d.count) : xF(0))
            .attr("y", d => y(d.mana_cost))
            .attr("width", d => d.side === "L" ? xM(0) - xM(d.count) : xF(d.count) - xF(0))
            .attr("height", y.bandwidth());
      
        svg.append("g")
            .attr("fill", "black")
          .selectAll("text")
          .data(data)
          .join("text")
            .attr("text-anchor", d => d.side === "L" ? "end" : "start")
            .attr("x", d => d.side === "L" ? xM(d.count) - 4 : xF(d.count) + 4)
            .attr("y", d => y(d.mana_cost) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.count);
      
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("fill", colorLeft_color)
            .attr("dy", "0.35em")
            .attr("x", 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorLeft);
      
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("fill", colorRight_color)
            .attr("dy", "0.35em")
            .attr("x", width - 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorRight);
      
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        return svg.node();
}

export function power_bars_by_color_d3(dataLeft, dataRight, colorLeft, colorRight, {w, h} = {}) {
    const width = 800;
    const height = 600;
    /* const barPadding = 1;
    // d3.select("div.d3-cmc-bars-by-color").append("svg").attr("class", "d3-cmc-bars-by-color").attr("width", width).attr("height", height);
    // d3.select("svg.d3-cmc-bars-by-color")
    
    const xScale = d3.scaleLinear()

    // const data = Object.entries(dataLeft);
    const data = dataLeft;
    console.log("hey");
    console.log(dataLeft);
    console.log(data);
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);;

    svg.append("g")
      .selectAll("rect")
    //   .data(dataLeft.entries())
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => width - parseInt(d.mana_cost) * 4)
      .attr("y", (d, i) => i * (height / data.length))
      .attr("width", d => d.count)
      .attr("height", d => height / data.length - barPadding)
    //   .style("x", d => parseInt(d[0]))
    //   .style("y", d => parseInt(d[1]/4) + "px");
    return svg.node(); */
    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    const data = left_data.concat(right_data);
    console.log(data);

    let colorLeft_color = colorLeft 
    if (colorLeft === "multicolor") {
        colorLeft_color = "purple";
    }
    if (colorLeft === "colorless") {
        colorLeft_color = "gray";
    }
    if (colorLeft === "white") {
        colorLeft_color = "lightgray";
    }

    let colorRight_color = colorRight 
    if (colorRight === "multicolor") {
        colorRight_color = "purple";
    }
    if (colorRight === "colorless") {
        colorRight_color = "gray";
    }
    if (colorRight === "white") {
        colorRight_color = "lightgray";
    }

    const margin = ({top: 10, right: 50, bottom: 20, left: 50})

    const xM = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .rangeRound([width / 2, margin.left])

    const xF = d3.scaleLinear()
    .domain(xM.domain())
    .rangeRound([width / 2, width - margin.right])

    const y = d3.scaleBand()
    .domain(data.map(d => d.power))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "m")))
    .call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "m")))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll(".tick:first-of-type").remove())

    const yAxis = g => g
    .attr("transform", `translate(${xM(0)},0)`)
    .call(d3.axisRight(y).tickSizeOuter(0))
    .call(g => g.selectAll(".tick text").attr("fill", "white").attr("font-size", 15))

        const svg = d3.create("svg").attr("width", width).attr("height", height)
            .attr("font-family", "sans-serif")
            .attr("font-size", 15);
      
        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("fill", d => d.side === "L" ? colorLeft_color : colorRight_color)
            .attr("x", d => d.side === "L" ? xM(d.count) : xF(0))
            .attr("y", d => y(d.power))
            .attr("width", d => d.side === "L" ? xM(0) - xM(d.count) : xF(d.count) - xF(0))
            .attr("height", y.bandwidth());
      
        svg.append("g")
            .attr("fill", "black")
          .selectAll("text")
          .data(data)
          .join("text")
            .attr("text-anchor", d => d.side === "L" ? "end" : "start")
            .attr("x", d => d.side === "L" ? xM(d.count) - 4 : xF(d.count) + 4)
            .attr("y", d => y(d.power) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.count);
      
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("fill", colorLeft_color)
            .attr("dy", "0.35em")
            .attr("x", 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorLeft);
      
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("fill", colorRight_color)
            .attr("dy", "0.35em")
            .attr("x", width - 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorRight);
      
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        return svg.node();
}

export function toughness_bars_by_color_d3(dataLeft, dataRight, colorLeft, colorRight, {w, h} = {}) {
    const width = 800;
    const height = 600;
    /* const barPadding = 1;
    // d3.select("div.d3-cmc-bars-by-color").append("svg").attr("class", "d3-cmc-bars-by-color").attr("width", width).attr("height", height);
    // d3.select("svg.d3-cmc-bars-by-color")
    
    const xScale = d3.scaleLinear()

    // const data = Object.entries(dataLeft);
    const data = dataLeft;
    console.log("hey");
    console.log(dataLeft);
    console.log(data);
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);;

    svg.append("g")
      .selectAll("rect")
    //   .data(dataLeft.entries())
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => width - parseInt(d.mana_cost) * 4)
      .attr("y", (d, i) => i * (height / data.length))
      .attr("width", d => d.count)
      .attr("height", d => height / data.length - barPadding)
    //   .style("x", d => parseInt(d[0]))
    //   .style("y", d => parseInt(d[1]/4) + "px");
    return svg.node(); */
    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    const data = left_data.concat(right_data);
    console.log(data);

    let colorLeft_color = colorLeft 
    if (colorLeft === "multicolor") {
        colorLeft_color = "purple";
    }
    if (colorLeft === "colorless") {
        colorLeft_color = "gray";
    }
    if (colorLeft === "white") {
        colorLeft_color = "lightgray";
    }

    let colorRight_color = colorRight 
    if (colorRight === "multicolor") {
        colorRight_color = "purple";
    }
    if (colorRight === "colorless") {
        colorRight_color = "gray";
    }
    if (colorRight === "white") {
        colorRight_color = "lightgray";
    }

    const margin = ({top: 10, right: 50, bottom: 20, left: 50})

    const xM = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .rangeRound([width / 2, margin.left])

    const xF = d3.scaleLinear()
    .domain(xM.domain())
    .rangeRound([width / 2, width - margin.right])

    const y = d3.scaleBand()
    .domain(data.map(d => d.toughness))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "m")))
    .call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "m")))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll(".tick:first-of-type").remove())

    const yAxis = g => g
    .attr("transform", `translate(${xM(0)},0)`)
    .call(d3.axisRight(y).tickSizeOuter(0))
    .call(g => g.selectAll(".tick text").attr("fill", "white").attr("font-size", 15))

        const svg = d3.create("svg").attr("width", width).attr("height", height)
            .attr("font-family", "sans-serif")
            .attr("font-size", 15);
      
        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("fill", d => d.side === "L" ? colorLeft_color : colorRight_color)
            .attr("x", d => d.side === "L" ? xM(d.count) : xF(0))
            .attr("y", d => y(d.toughness))
            .attr("width", d => d.side === "L" ? xM(0) - xM(d.count) : xF(d.count) - xF(0))
            .attr("height", y.bandwidth());
      
        svg.append("g")
            .attr("fill", "black")
          .selectAll("text")
          .data(data)
          .join("text")
            .attr("text-anchor", d => d.side === "L" ? "end" : "start")
            .attr("x", d => d.side === "L" ? xM(d.count) - 4 : xF(d.count) + 4)
            .attr("y", d => y(d.toughness) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.count);
      
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("fill", colorLeft_color)
            .attr("dy", "0.35em")
            .attr("x", 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorLeft);
      
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("fill", colorRight_color)
            .attr("dy", "0.35em")
            .attr("x", width - 150)
            .attr("y", 100)
            .attr("font-size", 30)
            .text(colorRight);
      
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        return svg.node();
}

export function power_toughness_difference_bars_by_color_d3(dataLeft, dataRight, colorLeft, colorRight, {w, h} = {}) {
    const width = 600;
    const height = 400;
    /* const barPadding = 1;
    // d3.select("div.d3-cmc-bars-by-color").append("svg").attr("class", "d3-cmc-bars-by-color").attr("width", width).attr("height", height);
    // d3.select("svg.d3-cmc-bars-by-color")
    
    const xScale = d3.scaleLinear()

    // const data = Object.entries(dataLeft);
    const data = dataLeft;
    console.log("hey");
    console.log(dataLeft);
    console.log(data);
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);;

    svg.append("g")
      .selectAll("rect")
    //   .data(dataLeft.entries())
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => width - parseInt(d.mana_cost) * 4)
      .attr("y", (d, i) => i * (height / data.length))
      .attr("width", d => d.count)
      .attr("height", d => height / data.length - barPadding)
    //   .style("x", d => parseInt(d[0]))
    //   .style("y", d => parseInt(d[1]/4) + "px");
    return svg.node(); */
    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    const data = left_data.concat(right_data);
    console.log(data);

    const margin = ({top: 10, right: 0, bottom: 20, left: 0})

    const xM = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .rangeRound([width / 2, margin.left])

    const xF = d3.scaleLinear()
    .domain(xM.domain())
    .rangeRound([width / 2, width - margin.right])

    const y = d3.scaleBand()
    .domain(data.map(d => parseFloat(d.power_toughness_difference)))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

    const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "s")))
    .call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "s")))
    .call(g => g.selectAll(".domain").remove())
    .call(g => g.selectAll(".tick:first-of-type").remove())

    const yAxis = g => g
    .attr("transform", `translate(${xM(0)},0)`)
    .call(d3.axisRight(y).tickSizeOuter(0))
    .call(g => g.selectAll(".tick text").attr("fill", "white"))

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("padding", 20);
      
        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("fill", d => d.side === "L" ? colorLeft : colorRight)
            .attr("x", d => d.side === "L" ? xM(d.count) : xF(0))
            .attr("y", d => y(parseFloat(d.power_toughness_difference)))
            .attr("width", d => d.side === "L" ? xM(0) - xM(d.count) : xF(d.count) - xF(0))
            .attr("height", y.bandwidth());
      
        svg.append("g")
            .attr("fill", "black")
          .selectAll("text")
          .data(data)
          .join("text")
            .attr("text-anchor", d => d.side === "L" ? "end" : "start")
            .attr("x", d => d.side === "L" ? xM(d.count) - 4 : xF(d.count) + 4)
            .attr("y", d => y(parseFloat(d.power_toughness_difference)) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => d.count);
      
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .attr("dy", "0.35em")
            .attr("x", xM(0) - 4)
            .attr("y", y(parseFloat(data[0].power_toughness_difference)) + y.bandwidth() / 2)
            .text(colorLeft);
      
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("fill", "white")
            .attr("dy", "0.35em")
            .attr("x", xF(0) + 24)
            .attr("y", y(parseFloat(data[0].power_toughness_difference)) + y.bandwidth() / 2)
            .text(colorRight);
      
        svg.append("g")
            .call(xAxis);
      
        svg.append("g")
            .call(yAxis);
      
        return svg.node();
}

export function cmc_bars_by_color_original(data, {width, height} = {}) {
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
