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
       const compl = cards[set.code].flat().filter(card => card.oracle_text != null).map(card => card.oracle_text.split(' ').length);
       const min = Math.min(...compl);
       const max = Math.max(...compl);
       const avg = d3.mean(compl);

       actual.push({
          set: set.code,
          release: set.release,
          min: min,
          max: max,
          avg: avg
       });
    });

    const x = mk_utc_x(w, d3.extent(actual, set => set.release));
    const y = mk_lin_y(h, [Math.min(...actual.map(s => s.min)), Math.max(...actual.map(s => s.max))]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append('path')
        .datum(actual)
        .attr('fill', 'none')
        .attr('stroke', 'navy')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.max))
        );

    svg.append('path')
        .datum(actual)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.avg))
        );
    
    return svg.node();
};

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

const color_set = (cards) => {
    const card_color_list = {
        colorless: 0,
        green: 0,
        red: 0,
        black: 0,
        blue: 0,
        white: 0,
        mixed: 0,
    }
    const cards_list = cards.map(card => card.colors);
    cards_list.forEach(colors => {
        if (colors.length == 0) {
            card_color_list.colorless++;
        } else if (colors.length > 1) {
            card_color_list.mixed++;
        } else {
            card_color_list[get_color_by_code(colors[0])]++;
        }
    });
    return card_color_list;
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

export const color_per_year_area = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = filter_years(sets, from, to);
    const double = [];
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

    const area = d3.area()
      .x(d => x(d.data[0]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll()
        .data(series)
        .join("path")
          .attr("fill", d => color(d.key))
          .attr("d", area);

    return svg.node();
}

export const color_area = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
    const actual = [];
    let i = 0;
    let s;
    filter_years(sets, from, to).sort((a, b) => a.release - b.release).forEach(set => {
        const cards_list = cards[set.code].flat().filter(card => card.colors != null);
        const n_cards = cards_per_set(cards_list);
        const color_counts = color_set(cards_list)
        const new_date = set.release + i;
        
        if (i != 198){
            Object.keys(color_counts).forEach(key => {
                actual.push({
                    release: new_date,
                    color: key,
                    color_count: color_counts[key] / n_cards,
                });
            })
        } else {
            s = set;
        }
        i++;
    });

    const data = actual;
    const subgroups = d3.union(data.map(d => d.color));

    var series = d3.stack()
        .keys(subgroups)
        .value(([, group], key) => group.get(key).color_count)
        (d3.index(data, d => d.release, d => d.color));

    const x = d3.scaleBand()
    .domain(data.map(year => year.release))
    .range([marginLeft, w - marginRight])
    .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([h - marginBottom, marginTop])  ;


    const svg = d3.create("svg").attr("width", w).attr("height", h);

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#838383','#006600','#CC0000', '#000000', '#0066CC', '#FFFFFF', '#FFCC00'])
    .unknown("#ccc");

    const area = d3.area()
      .x(d => x(d.data[0]))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll()
        .data(series)
        .join("path")
          .attr("fill", d => color(d.key))
          .attr("d", area);

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

    const x = mk_utc_x(w, d3.extent(actual, set => set.release));
    const y = mk_lin_y(h, [Math.min(...actual.map(s => s.n)), Math.max(...actual.map(s => s.n))]);
    const svg = d3.create("svg").attr("width", w).attr("height", h);

    svg.append('g')
        .attr('transform', `translate(0, ${h - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .attr('transform', `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y));

    svg.append('path')
        .datum(actual)
        .attr('fill', 'none')
        .attr('stroke', 'navy')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.release))
            .y(d => y(d.n))
        );

    return svg.node();
}


export const cards_per_year = (sets, cards, {w, h} = {w:1200, h:600}, {from, to} = {from:1990, to:2030}) => {
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

    const x = d3.scaleBand().range([marginLeft, w - marginRight]).domain(year_to_count.map(year => year.year)).padding(0.1);
    const y = mk_lin_y(h, [0, Math.max(...year_to_count.map(year => year.cards_in_set))]);
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
        .attr('y', d => y(d.cards_in_set))
        .attr('width', x.bandwidth())
        .attr('height', d => h - marginBottom - y(d.cards_in_set))
        .attr('fill', 'steelblue');

    const reg = regression.polynomial(year_to_count.map(year => [year.year - year_to_count[0].year, year.cards_in_set]), { order: 2 });
    const reg_line = [];
    for(let i = year_to_count[0].year; i <= year_to_count.at(-1).year; i++) {
        reg_line.push({ year: i, cards_in_set: reg.predict(i - year_to_count[0].year)[1] });
    }

    svg.append('path')
        .datum(reg_line)
        .attr('fill', 'none')
        .attr('stroke', 'maroon')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(d.year))
            .y(d => y(d.cards_in_set))
        );

    return svg.node();
}
