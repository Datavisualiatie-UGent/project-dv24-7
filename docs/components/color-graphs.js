import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";

export function pie_chart_set_type_distribution(typeData, width = 500, height = 500) {
    // Maps data sorted on count to a spectral colorscheme.
    const color = d3.scaleOrdinal()
                    .domain(typeData.distribution.sort((a,b) => d3.descending(a.count, b.count))
                                                                  .map(d => d.count))
                    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), typeData.distribution.length)
                             .reverse())

    // Create the pie layout and arc generator.
    const pie = d3.pie()
                  .sort((a,b) => d3.descending(a.count, b.count))
                  .value(d => d.count);

    // Pie slices start from center of pie and extend to value of outerradius.
    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(Math.min(width, height) / 2 - 1);

    // Calculates radius on which we wish to place our labels
    const labelRadius = arc.outerRadius()() * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3.arc()
                       .innerRadius(labelRadius)
                       .outerRadius(labelRadius);

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
                         .attr("font-size", 12)
                         .attr("font-weight", "bold")
                         .text(d => d.data.type))
       .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.1)
                         .append("tspan")
                         .attr("x", 0)
                         .attr("y", "0.7em")
                         .attr("font-size", 12)
                         .attr("fill-opacity", 0.7)
                         .text(d => d.data.count));

    return svg.node();
}

export function pie_chart_color_distribution(colorData, width = 500, height = 500) {
    // Link card colors to manually chosen color representation
    const color = d3.scaleOrdinal()
                    .domain(['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'])
                    .range(['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'])

    // Create the pie layout and arc generator.
    const pie = d3.pie()
                  .sort((a,b) => d3.ascending(a.order, b.order))
                  .value(d => d.total);

    // Pie slices start from center of pie and extend to value of outerradius.
    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(Math.min(width, height) / 2 - 1);

    // Calculates radius on which we wish to place our labels
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
       .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
                         .append("tspan")
                         .attr("x", 0)
                         .attr("y", "0.7em")
                         .attr("fill", "gray")
                         .attr("font-size", 15)
                         .attr("fill-opacity", 0.7)
                         .text(d => d.data.total));

    return svg.node();
}

export function attribute_bars_by_color_d3(cards, colorLeft, colorRight, attribute, {w, h} = {}) {
    let dataLeft;
    let dataRight;
    // Load correct data to the left and right side of the plot
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

    // Add information to the data points to indicate wether it belongs to the left or right side of the plot
    const left_data = dataLeft.map(d => {
        d['side'] = "L";
        return d;});
    const right_data = dataRight.map(d => {
        d['side'] = "R";
        return d;})
    // Join all data together
    const data = left_data.concat(right_data);

    // Link card colors to manually chosen color representation
    const color = d3.scaleOrdinal()
                    .domain(['black', 'red', 'white', 'green', 'blue', 'multicolor', 'colorless'])
                    .range(['#C4D0D0', '#F09EA7', '#FAFABE', '#C1EBC0', '#C7CAFF', '#CDABEB', '#F6C2F3'])

    // Get correct color depending on selected card colors
    let colorLeft_color = color(colorLeft)
    let colorRight_color = color(colorRight)

    // Get correct attribute name
    let attr = attribute;
    if (attribute === "mana cost") {
        attr = "mana_cost"
    }

    const width = 800/3*2;
    const height = 600/3*2;

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 40;
    const marginLeft = 20;

    // Scale for data on left side of plot
    const barLeft = d3.scaleLinear([0, d3.max(data, d => d.count*1.1)], [width / 2, marginLeft])
    // Scale for data on right side of plot
    const barRight = d3.scaleLinear(barLeft.domain(), [width / 2, width - marginRight])
    // Scale for data on y axis of plot. Also add padding so there will be space between the bars in the plot.
    const y = d3.scaleBand(data.map(d => d[attr]), [height - marginBottom, marginTop])
                .padding(0.1)

    // Construct the x axis
    const xAxis = g => g.attr("transform", `translate(0,${height - marginBottom})`)
                        .call(g => g.append("g")  // Axis for left data
                                    .call(d3.axisBottom(barLeft)
                                            .ticks(width / 150, "m")
                                    .tickSizeOuter(0)))
                        .call(g => g.append("g")  // Axis for right data
                                    .call(d3.axisBottom(barRight)
                                            .ticks(width / 150, "m")
                                    .tickSizeOuter(0)))
                        .call(g => g.selectAll(".domain"))
                        .call(g => g.selectAll(".tick text")
                                    .attr("fill", "black")
                                    .attr("font-size", 15))

    // Construct the y axis
    const yAxis = g => g.attr("transform", `translate(${marginLeft},0)`)
                        .call(d3.axisLeft(y).tickSizeOuter(0))
                        .call(g => g.selectAll(".tick text").attr("fill", "black").attr("font-size", 15))

    // Vertical gridlines on left side of plot
    const xAxisGridLeft = d3.axisBottom(barLeft)
                            .tickSize(marginTop + marginBottom - height)
                            .tickFormat('')
                            .ticks(width/150, "m")
                            .tickSizeOuter(0)

    // Vertical gridlines on right side of plot
    const xAxisGridRight = d3.axisBottom(barRight)
                             .tickSize(marginTop + marginBottom - height)
                             .tickFormat('')
                             .ticks(width/150, "m")
                             .tickSizeOuter(0)

    // Add svg element that is root of our ploot
    const svg = d3.create("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 15);

    // Draw x axis
    svg.append("g")
       .call(xAxis);
    
    // Draw y axis
    svg.append("g")
       .call(yAxis);

    // Draw gridlines on left side
    svg.append("g")
       .attr('class', 'y axis-grid')
       .attr('transform', 'translate(0, ' + (height - marginBottom) + ')')
       .call(xAxisGridLeft);

    // Draw gridlines on right side
    svg.append("g")
       .attr('class', 'y axis-grid')
       .attr('transform', 'translate(0, ' + (height - marginBottom) + ')')
       .call(xAxisGridRight);

    // Give gridlines a light gray color
    svg.selectAll(".axis-grid .tick line")
       .attr("stroke", "lightgray")

    // Place x label
    svg.append("g")
       .append("text")
       .attr("class", "x label")
       .attr("text-anchor", "middle")
       .attr("x", width/2)
       .attr("y", height - 6)
       .text("card count");

    // Place y label
    svg.append("g")
       .append("text")
       .attr("class", "y label")
       .attr("text-anchor", "start")
       .attr("x", 0)
       .attr("y", 5)
       .attr("dy", ".75em")
       .text(`↑ ${attribute}`);
    
    // Draw the bars on the left and right side and add hover tooltip
    svg.append("g")
       .selectAll("rect")
       .data(data)
       .join("rect")
       .attr("fill", d => d.side === "L" ? colorLeft_color : colorRight_color)
       .attr("x", d => d.side === "L" ? barLeft(d.count) : barRight(0))
       .attr("y", d => y(d[attr]))
       .attr("width", d => d.side === "L" ? barLeft(0) - barLeft(d.count) : barRight(d.count) - barRight(0))
       .attr("height", y.bandwidth())
       .append("title")
       .text(d => `${attribute}: ${d[attr]}\ncount: ${d.count}`);

    // Add color label of data on the left side to the axis
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("dy", "0.35em")
        .attr("x", 260)
        .attr("y", height - 50)
        .attr("font-size", '15px')
        .text(`${colorLeft} ←`);

    // Add color label of data on the right side to the axis
    svg.append("text")
        .attr("text-anchor", "start")
        .attr("dy", "0.35em")
        .attr("x", width - 260)
        .attr("y", height - 50)
        .attr("font-size", '15px')
        .text(`→ ${colorRight}`);
      
    return svg.node();
}

