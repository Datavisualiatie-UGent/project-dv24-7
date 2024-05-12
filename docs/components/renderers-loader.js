import * as d3 from 'npm:d3';
import regression from 'npm:regression';

const marginTop = 20;
const marginBottom = 40;
const marginLeft = 40;
const marginRight = 20;

const date_options = { day: 'numeric', 'month': 'short', year: 'numeric' };
const mk_utc_x = (width, extent) => d3.scaleTime().domain(extent).range([marginLeft, width - marginRight]);
const mk_lin_y = (height, extent) => d3.scaleLinear().domain(extent).range([height - marginBottom, marginTop]);
const days_since = (d1, d2) => (d2 - d1) / (1000 * 60 * 60 * 24);

export const set_release_time = (sets, {w,h}={w:1200,h:600}) => {
    const actual = sets.release_difference.map(set => ({ ...set, release: Date.parse(set.release) }));
    const year_to_avg = sets.difference_per_year;

    const x = mk_utc_x(w, d3.extent(actual, d => d.release)).nice();
    const y = mk_lin_y(h, [0, Math.max(...actual.map(set => set.diff + 1))]);
    const svg = d3.create('svg').attr('width', w).attr('height', h);

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
        tooltip.html(`Set ${d.name} (Code ${d.code})<br>Released: ${new Date(d.release).toLocaleDateString('en-US', date_options)}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
    }

    svg.append('g')
        .attr('transform', `translate(0,${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.append('g')
        .selectAll('circle')
        .data(actual)
        .join('circle')
        .attr('stroke', 'steelblue')
        .attr('fill', 'currentColor')
        .attr('cx', d => x(d.release))
        .attr('cy', d => y(d.diff))
        .attr('r', 5)
        .attr('opacity', 0.5)
        .attr('fill', 'black')
        .on('mouseover', mouse_over)
        .on('mousemove', mouse_move)
        .on('mouseleave', mouse_leave);

    svg.append('path')
        .datum(year_to_avg)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(new Date(d.year, 5, 1)))
            .y(d => y(d.avg))
        );

    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('font-size', '15px')
        .attr('x', w - 20)
        .attr('y', h - 45)
        .text('Year →');

    svg.append('text')
        .attr('class', 'y label')
        .attr('font-size', '15px')
        .attr('x', 45)
        .attr('y', 15)
        .attr('dy', '.75em')
        .text('↑ Months since previous set');

    return svg.node();
};

export const sets_per_year = (sets, {w,h}={w:1200,h:600}) => {
    const x = d3.scaleBand().range([marginLeft, w - marginRight]).domain(sets.map(year => year.year)).padding(0.1);
    const y = mk_lin_y(h, [0, Math.max(...sets.map(year => year.count))]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

    svg.append('g')
        .attr('transform', `translate(0,${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

    svg.selectAll('bar')
        .data(sets)
        .enter()
        .append('rect')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => h - marginBottom - y(d.count))
        .attr('fill', 'steelblue');

    return svg.node();
};

export const complexity = (sets, {w,h}={w:1200,h:600}) => {
    const x = mk_utc_x(w, d3.extent(sets, d => d.release)).nice();
    const y = mk_lin_y(h, [0, Math.max(...sets.map(set => set.avg))]);
    const svg = d3.create('svg').attr('width', w).attr('height', h);

    svg.append('g')
        .attr('transform', `translate(0,${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

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
        tooltip.html(`Set ${d.name} (Code ${d.code})<br>Average ${d.avg.toFixed(2)} words/card.`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
    }

    svg.append('g')
        .selectAll('circle')
        .data(sets)
        .join('circle')
        .attr('stroke', 'steelblue')
        .attr('fill', 'currentColor')
        .attr('cx', d => x(d.release))
        .attr('cy', d => y(d.avg))
        .attr('r', 3)
        .attr('opacity', 0.5)
        .attr('fill', 'black')
        .on('mouseover', mouse_over)
        .on('mousemove', mouse_move)
        .on('mouseleave', mouse_leave);

    const reg = regression.polynomial(sets.map(set => [days_since(sets[0].release, set.release), set.avg]), { order: 2, precision: 7 });
    const reg_line = sets.map(set => ({release: set.release, avg: reg.predict(days_since(sets[0].release, set.release))[1] }));
    console.log(reg);
    console.log(sets[0].release);

    svg.append('path')
        .datum(reg_line)
        .attr('fill', 'none')
        .attr('stroke', 'navy')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.avg))
        );

    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('font-size', '15px')
        .attr('x', w - 20)
        .attr('y', h - 45)
        .text('Year →');

    svg.append('text')
        .attr('class', 'y label')
        .attr('font-size', '15px')
        .attr('x', 45)
        .attr('y', 15)
        .attr('dy', '.75em')
        .text('↑ Average card complexity (#words)');

    return svg.node();
};

export const complexity_by_kind = (kinds, sets, {w,h}={w:1200,h:600}) => {
    const release_dates = Object.values(sets).flat().map(x => new Date(x.release));
    const complexities = Object.values(sets).flat().map(x => x.avg);

    const x = mk_utc_x(w, d3.extent(release_dates)).nice();
    const y = mk_lin_y(h, [0, Math.max(...complexities)]);
    const svg = d3.create('svg').attr('width', w).attr('height', h);

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

    let last_kind = '';
    let always_on = [];
    const circle_ids = kinds.map(k => `circle-${k}`);
    const color_for = (kind) => d3.interpolateTurbo(kinds.indexOf(kind) / kinds.length);

    const mouse_over = (d) => {
        tooltip.style("visibility", "visible");
    }

    const mouse_move = (event, d) => {
        tooltip.html(`Set ${d.name} (Code ${d.code})<br>Average ${d.avg.toFixed(2)} words/card.<br>Set type: ${d.type}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
        d3.select(`#reg-line-${d.type}`).transition().style('visibility', 'visible').style('stroke', color_for(d.type));
        last_kind = d.type;
        circle_ids.filter(id => id !== `circle-${d.type}`).filter(id => !always_on.includes(id.split('-')[1])).forEach(id => d3.selectAll(`.${id}`).transition().style('opacity', 0.15));
    }

    const mouse_move_legend = (event, d) => {
        d3.select(`#reg-line-${d}`).transition().style('visibility', 'visible').style('stroke', color_for(d));
        last_kind = d;
        circle_ids.filter(id => id !== `circle-${d}`).forEach(id => d3.selectAll(`.${id}`).transition().style('opacity', 0.15));
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
        if(!always_on.includes(last_kind)) d3.select(`#reg-line-${last_kind}`).transition().style('visibility', 'hidden');
        circle_ids.forEach(id => d3.selectAll(`.${id}`).transition().style('opacity', 1));
    }

    const legend_click = (event, d) => {
        const id = d.replaceAll(' ', '_');
        if(always_on.includes(id)) always_on = always_on.filter(x => x !== id);
        else always_on.push(id);
    }

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    kinds.forEach(kind => {
        const datum = sets[kind].map(set => ({ ...set, release: new Date(set.release) }));
        if(datum.length === 0) return;

        svg.append('g')
            .selectAll('circle')
            .data(datum)
            .join('circle')
            .attr('stroke', color_for(kind))
            .attr('fill', color_for(kind))
            .attr('class', `circle-${kind}`)
            .attr('opacity', 1)
            .attr('cx', d => x(d.release))
            .attr('cy', d => y(d.avg))
            .attr('r', 3.5)
            .on('mouseover', mouse_over)
            .on('mousemove', mouse_move)
            .on('mouseleave', mouse_leave);

        const reg = regression.polynomial(datum.map(set => [days_since(datum[0].release, set.release), set.avg]), { order: 2, precision: 7 });
        const reg_line = datum.map(set => ({release: set.release, avg: reg.predict(days_since(datum[0].release, set.release))[1] }));

        svg.append('path')
            .datum(reg_line)
            .attr('id', `reg-line-${kind}`)
            .attr('fill', 'none')
            .attr('stroke', color_for(kind))
            .attr('stroke-width', 1.5)
            .attr('d', d3.line()
                .x(d => x(new Date(d.release)))
                .y(d => y(d.avg))
            )
            .attr('visibility', 'hidden');
    });

    const per_col = kinds.filter(k => sets[k].length > 0).length / 2;

    svg.selectAll('legend-dots')
        .data(kinds.filter(k => sets[k].length > 0))
        .enter()
        .append('circle')
        .attr('cx', (d, i) => marginLeft + 20 + Math.floor(i / per_col) * 100)
        .attr('cy', (d, i) => marginTop + 30 + Math.floor(i % per_col) * 20)
        .attr('r', 5)
        .attr('fill', d => color_for(d))

    svg.selectAll('legend-text')
        .data(kinds.filter(k => sets[k].length > 0))
        .enter()
        .append('text')
        .attr('x', (d, i) => marginLeft + 30 + Math.floor(i / per_col) * 100)
        .attr('y', (d, i) => marginTop + 35 + Math.floor(i % per_col) * 20)
        .text(d => d.replace('_', ' '))
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'bottom')
        .on('click', legend_click)
        .on('mouseover', mouse_move_legend)
        .on('mouseleave', mouse_leave);

    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('font-size', '15px')
        .attr('x', w - 20)
        .attr('y', h - 45)
        .text('Year →');

    svg.append('text')
        .attr('class', 'y label')
        .attr('font-size', '15px')
        .attr('x', 45)
        .attr('y', 15)
        .attr('dy', '.75em')
        .text('↑ Average card complexity (#words)');

    return svg.node();
}