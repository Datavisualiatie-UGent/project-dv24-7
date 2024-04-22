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

    const reg = regression.polynomial(year_to_count.map(year => [year.year - year_to_count[0].year, year.count]), { order: 2 });
    const reg_line = [];
    for(let i = year_to_count[0].year; i <= year_to_count.at(-1).year; i++) {
        reg_line.push({ year: i, count: reg.predict(i - year_to_count[0].year)[1] });
    }

    svg.append('path')
        .datum(reg_line)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.year))
            .y(d => y(d.count))
        );

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

    svg.append('path')
        .datum(actual)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.avg))
        );

    svg.append('g')
        .selectAll('circle')
        .data(actual)
        .join('circle')
        .attr('stroke', 'steelblue')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.5)
        .attr('cx', d => x(d.release))
        .attr('cy', d => y(d.avg))
        .attr('r', 5)
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

    const mouse_over = (d) => {
        tooltip.style("visibility", "visible");
    }
    const mouse_move = (event, d) => {
        tooltip.html(`Set ${d.name} (Code ${d.set})<br>Average ${d.avg.toFixed(2)} words/card.<br>Set type: ${d.type}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
    }

    const ids = kinds.map(kind => `line-${kind}`);
    const circ_ids = kinds.map(kind => `circle-${kind}`);
    const color_for = (kind) => d3.interpolateTurbo(kinds.indexOf(kind) / kinds.length);

    let last_enter = '';

    const mouse_move_line = (event, d) => {
        tooltip.html(`Set kind: ${d[0].type}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
        ids.forEach(id => d3.select(`#${id}`)
            .transition()
            .style('opacity', id === `line-${d[0].type}` ? 1.0 : 0.2));

        circ_ids.forEach(id => d3.selectAll(`.${id}`).transition().style('opacity', id === `circle-${d[0].type}` ? 1.0 : 0.0));

        d3.select(`#line-${d[0].type}`).transition().style('stroke', 'black');
        d3.select(`#reg-line-${d[0].type}`).transition().style('visibility', 'visible');
        last_enter = d[0].type;
    }

    const mouse_leave = (d) => {
        tooltip.style("visibility", "hidden");
    }

    const mouse_leave_line = (d) => {
        tooltip.style("visibility", "hidden");
        ids.forEach(id => d3.select(`#${id}`).transition().style('opacity', 1.0));
        d3.select(`#line-${last_enter}`).transition().style('stroke', color_for(last_enter));
        circ_ids.forEach(id => d3.selectAll(`.${id}`).transition().style('opacity', 0.25));
        d3.select(`#reg-line-${last_enter}`).transition().style('visibility', 'hidden');
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
            .attr('d', d3.line()
                .x(d => x(d.release))
                .y(d => y(d.avg))
            )
            .attr('id', `line-${kind}`)
            .on('mouseover', mouse_over)
            .on('mousemove', mouse_move_line)
            .on('mouseleave', mouse_leave_line);

        svg.append('g')
            .selectAll('circle')
            .data(datum)
            .join('circle')
            .attr('stroke', 'steelblue')
            .attr('fill', 'currentColor')
            .attr('class', `circle-${kind}`)
            .attr('opacity', 0.25)
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

    return svg.node();
};