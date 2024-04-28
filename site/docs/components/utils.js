export const filter_years = (sets, from, to) => sets.filter(set => set.release.getFullYear() >= from && set.release.getFullYear() <= to);

export const cards_per_set = (cards_list) => {
    let n_cards = 0;

        cards_list.forEach(card => {
        n_cards++;
    });
    return n_cards;
}

export const get_color_by_code = (code) => {
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

export const color_scheme_map = (color_name) => {
    const map = {
        colorless: 'Viridis',
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

export const set_selector_filter = (all_sets, selected_set) => {
    const used_sets = []

    if (selected_set === 'All') {
        used_sets.push(...all_sets);
        console.log('true');
    } else {
        used_sets.push(...all_sets.filter(set => set.name === selected_set));
        console.log('false');
    }
    return used_sets;
}