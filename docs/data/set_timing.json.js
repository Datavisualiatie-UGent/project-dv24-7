import {load_base_data} from "./base-loader.js";

const diff_months = (d1, d2) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

const {filtered} = (await load_base_data());

const release_time = filtered.map((v, i) => {
    return {
        ...v,
        idx: i,
        diff: i === 0 ? 0 : diff_months(filtered[i - 1].release, v.release)
    };
});

const year_to_avg = [];
const per_year = [];

for(let i = filtered[0].release.getFullYear(); i <= filtered.at(-1).release.getFullYear(); i++) {
    const year_sets = release_time.filter(set => set.release.getFullYear() === i);
    year_to_avg.push({
        year: i,
        avg: year_sets.reduce((acc, set) => acc + set.diff, 0) / year_sets.length
    });
    per_year.push({ year: i, count: year_sets.length });
}

process.stdout.write(JSON.stringify({
    timing_data: {
        release_difference: release_time,
        difference_per_year: year_to_avg,
        per_year: per_year
    }
}));