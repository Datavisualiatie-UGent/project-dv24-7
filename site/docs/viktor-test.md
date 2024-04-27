---
title: Small Test Viktor
---

```js
const exclude = [
  'alchemy', 'archenemy', 'duel_deck', 'from_the_vault', 'funny', 
  'masterpiece', 'memorabilia', 'minigame', 'premium_deck', 'promo',
  'spellbook', 'token', 'treasure_chest', 'vanguard'  
];

const preproc_sets = (sets) => {
    return sets.map(set => {
        return {
            ...set,
            release: new Date(set.released_at)
        };
    }).sort((a, b) => a.release - b.release);
};
const remove_excluded_sets = (sets) => {
    return sets.filter(set => set.parent_set_code === undefined).filter(set => !exclude.includes(set.set_type));
};

const sets = preproc_sets(remove_excluded_sets((await FileAttachment("./data/sets.json").json()).data));

const load_cards = async () => {
    const cards = {};
    const card_zip = await FileAttachment("./data/cards.zip").zip();
    await Promise.all(sets.map(async set => {
        cards[set.code] = await card_zip.file(`out/${set.code}.json`).json();
    }));
    console.log(cards);
    return cards;
};
const cards_by_sets = await load_cards();

const set_selector_filter = (all_sets, selected_set) => {
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
```

## Evolution of color distribution
```js
import {color_per_year_bar} from './components/renderers.js';
display(color_per_year_bar(sets, cards_by_sets));
```

```js
import {color_per_year_area} from './components/renderers.js';
display(color_per_year_area(sets, cards_by_sets));
```

<br>

```js
// import {color_per_year_area_plot} from './components/renderers.js';
// display(color_per_year_area_plot(sets, cards_by_sets));
```

```js
import {rarity_per_year_area} from './components/renderers.js';
display(rarity_per_year_area(sets, cards_by_sets));
```
<br>

## Number of cards per color per type
```js
import {cards_color_type} from './components/renderers.js';
const selector = ['All'];
selector.push(...sets.map(set => set.name).sort())
const selected_set_name = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
display(cards_color_type(set_selector_filter(sets, selected_set_name), cards_by_sets));
```


## Power vs Toughness per color
```js
import {cards_color_power} from './components/renderers.js';
const color_list = ['All', 'Red', 'Blue', 'Green', 'White', 'Black', 'Mixed'];
const selected_color_2 = view(Inputs.checkbox(color_list, {label: "Color", value: ["Red"],}));
const selected_set_name_2 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
const plots_power = [];
selected_color_2.forEach(color => {
    plots_power.push(cards_color_power(set_selector_filter(sets, selected_set_name_2), color, cards_by_sets));
});
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${plots_power}</div>`)
```

## Power vs rarity per color
```js
import {cards_rarity_power} from './components/renderers.js';
const selected_color_3 = view(Inputs.checkbox(color_list, {label: "Color", value: ["Red"],}));
const selected_set_name_3 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
const plots_power = []
selected_color_3.forEach(color => {
    plots_power.push(cards_rarity_power(set_selector_filter(sets, selected_set_name_3), color, cards_by_sets));
});
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${plots_power}</div>`)
```

## Toughness vs rarity per color
```js
import {cards_rarity_toughness} from './components/renderers.js';
const selected_color_4 = view(Inputs.checkbox(color_list, {label: "Color", value: ["Red"],}));
const selected_set_name_4 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
const plots_toughness = []
selected_color_4.forEach(color => {
    plots_toughness.push(cards_rarity_toughness(set_selector_filter(sets, selected_set_name_4), color, cards_by_sets));
});
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${plots_toughness}</div>`)
```

## Evolution of set size
```js
import {cards_per_set_per_year} from './components/renderers.js';
display(cards_per_set_per_year(sets, cards_by_sets));
```

## Number of cards released per year
```js
import {cards_per_year} from './components/renderers.js';
display(cards_per_year(sets, cards_by_sets));
```