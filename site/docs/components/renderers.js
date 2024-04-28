import * as d3 from 'npm:d3';
import regression from 'npm:regression';

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

const days_since = (d1, d2) => (d2 - d1) / (1000 * 60 * 60 * 24);

export const set_release_time = (sets, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = filter_years(sets, from, to)
        .map((v, i) => ({ ...v, idx: i, diff: i === 0 ? 0 : diff_months(sets[i - 1].release, v.release) }));

    const year_to_avg = [];
    for(let i = Math.max(from, sets[0].release.getFullYear() + 1); i <= to; i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_avg.push({ year: i, avg: d3.mean(year_sets, set => set.diff) });
    }

    const x = mk_utc_x(w, d3.extent(actual, set => set.release));
    const y = mk_lin_y(h, d3.extent(actual, set => set.diff));
    const svg = d3.create("svg").attr("width", w).attr("height", h);

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
        tooltip.html(`Set ${d.name} (Code ${d.code})<br>Released: ${d.release.toLocaleDateString('en-US', date_options)}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
    }

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append('g')
        .selectAll('circle')
        .data(actual)
        .join('circle')
        .attr('stroke', 'steelblue')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.5)
        .attr('cx', d => x(d.release))
        .attr('cy', d => y(d.diff))
        .attr('r', 5)
        .on("mouseover", mouse_over)
        .on("mousemove", mouse_move)
        .on("mouseleave", mouse_leave);

    svg.append('path')
        .datum(year_to_avg)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(new Date(d.year, 5, 1)))
            .y(d => y(d.avg))
        );

    return svg.node();
};

export const sets_per_year = (sets, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = filter_years(sets, from, to);
    const year_to_count = [];
    for(let i = Math.max(from, sets[0].release.getFullYear()); i <= Math.min(to, sets.at(-1).release.getFullYear()); i++) {
        const year_sets = actual.filter(set => set.release.getFullYear() === i);
        year_to_count.push({ year: i, count: year_sets.length });
    }

    const x = d3.scaleBand().range([marginLeft, w - marginRight]).domain(year_to_count.map(year => year.year)).padding(0.1);
    const y = mk_lin_y(h, [0, Math.max(...year_to_count.map(year => year.count))]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.selectAll('bar')
        .data(year_to_count)
        .enter()
        .append('rect')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => h - marginBottom - y(d.count))
        .attr('fill', 'steelblue');

    return svg.node();
}

export const complexity = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = [];
    filter_years(sets, from, to).sort((a, b) => a.release - b.release).forEach(set => {
       const compl = cards[set.code]
           .flat()
           .map(card => {
               if(card.card_faces != null) {
                   let text = '';
                   card.card_faces.forEach(face => text += face.oracle_text + ' ');
                   return { ...card, oracle_text: text };
               }
               else if(card.oracle_text == null) {
                   return { ...card, oracle_text: '' };
               }
               else {
                   return card;
               }
           })
           .map(card => card.oracle_text.split(' ').length);
       const min = Math.min(...compl);
       const max = Math.max(...compl);
       const avg = d3.mean(compl);

       actual.push({
           name: set.name,
           set: set.code,
           release: set.release,
           avg: avg
       });
    });

    const x = mk_utc_x(w, d3.extent(actual, set => set.release));
    const y = mk_lin_y(h, [0, Math.max(...actual.map(set => set.avg))]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

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
        tooltip.html(`Set ${d.name} (Code ${d.set})<br>Average ${d.avg.toFixed(2)} words/card.`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
    }

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    // svg.append('path')
    //     .datum(actual)
    //     .attr('fill', 'none')
    //     .attr('stroke', 'maroon')
    //     .attr('stroke-width', 2)
    //     .attr('d', d3.line()
    //         .x(d => x(d.release))
    //         .y(d => y(d.avg))
    //     );

    svg.append('g')
        .selectAll('circle')
        .data(actual)
        .join('circle')
        .attr('stroke', 'steelblue')
        .attr('fill', 'steelblue')
        .attr('opacity', 0.5)
        .attr('cx', d => x(d.release))
        .attr('cy', d => y(d.avg))
        .attr('r', 3)
        .on("mouseover", mouse_over)
        .on("mousemove", mouse_move)
        .on("mouseleave", mouse_leave);


    const reg = regression.polynomial(actual.map(set => [days_since(actual[0].release, set.release), set.avg]), { order: 2, precision: 7 });
    const reg_line = actual.map(set => ({ release: set.release, avg: reg.predict(days_since(actual[0].release, set.release))[1] }))

    svg.append('path')
        .datum(reg_line)
        .attr('fill', 'none')
        .attr('stroke', 'navy')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.avg))
        );
    
    return svg.node();
};

export const complexity_by_kind = (kinds, unfiltered_sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const mapped = {};
    kinds.forEach(k => { mapped[k] = [] });

    filter_years(unfiltered_sets, from, to).sort((a, b) => a.release - b.release).forEach(set => {
        const compl = cards[set.code]
            .flat()
            .filter(card => card != null)
            .map(card => {
                if(card.card_faces != null) {
                    let text = '';
                    card.card_faces.forEach(face => text += face.oracle_text + ' ');
                    return { ...card, oracle_text: text };
                }
                else if(card.oracle_text == null) {
                    return { ...card, oracle_text: '' };
                }
                else {
                    return card;
                }
            })
            .map(card => card.oracle_text.split(' ').length);
        const min = Math.min(...compl);
        const max = Math.max(...compl);
        const avg = d3.mean(compl);

        mapped[set.set_type].push({
            name: set.name,
            set: set.code,
            release: set.release,
            avg: avg,
            type: set.set_type
        });
    });

    const release_dates = Object.values(mapped).flat().map(x => x.release)
    const complexities = Object.values(mapped).flat().map(x => x.avg).filter(x => x != undefined);

    const x = mk_utc_x(w, d3.extent(release_dates));
    const y = mk_lin_y(h, [0, Math.max(...complexities)]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

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
        tooltip.html(`Set ${d.name} (Code ${d.set})<br>Average ${d.avg.toFixed(2)} words/card.<br>Set type: ${d.type}`)
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

    Object.keys(mapped).forEach(kind => {
        const datum = mapped[kind];

        svg.append('path')
            .datum(datum)
            .attr('fill', 'none')
            .attr('stroke', color_for(kind))
            .attr('stroke-width', 3)
            .attr('visibility', 'hidden')
            .attr('d', d3.line()
                .x(d => x(d.release))
                .y(d => y(d.avg))
            )
            .attr('id', `line-${kind}`);

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
            .on("mouseover", mouse_over)
            .on("mousemove", mouse_move)
            .on("mouseleave", mouse_leave);

        const reg = regression.polynomial(datum.map(set => [days_since(datum[0].release, set.release), set.avg]), { order: 2, precision: 7 });
        const reg_line = datum.map(set => ({ release: set.release, avg: reg.predict(days_since(datum[0].release, set.release))[1] }))

        svg.append('path')
            .datum(reg_line)
            .attr('fill', 'none')
            .attr('stroke', 'navy')
            .attr('stroke-width', 2)
            .attr('visibility', 'hidden')
            .attr('id', `reg-line-${kind}`)
            .attr('d', d3.line()
                .x(d => x(d.release))
                .y(d => y(d.avg))
            );
    });

    svg.selectAll('legend-dots')
        .data(kinds)
        .enter()
        .append('circle')
        .attr('cx', 60)
        .attr('cy', (d, i) => 25 + i * 15)
        .attr('r', 3)
        .style('fill', d => color_for(d));

    svg.selectAll('legend-text')
        .data(kinds)
        .enter()
        .append('text')
        .attr('x', 65)
        .attr('y', (d, i) => 29 + i * 15)
        .text(d => d.replaceAll('_', ' '))
        .attr('text-anchor', 'left')
        .attr('alignment-baseline', 'middle')
        .on('mousemove', mouse_move_legend)
        .on('mouseleave', mouse_leave)
        .on('click', legend_click);

    return svg.node();
};