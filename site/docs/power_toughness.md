---
title: Power and Toughness
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
import {set_selector_filter} from './components/utils.js';

const selector = ['All'];
selector.push(...sets.map(set => set.name).sort())
```


## Power vs Toughness per color per mana cost
```js
import {cards_color_power_mana, cards_color_power} from './components/power_toughness.js';
const color_list = ['Red', 'Blue', 'Green', 'White', 'Black', 'Mixed', 'Colorless', 'All'];
const selected_color_2 = view(Inputs.checkbox(color_list, {label: "Color", value: ["Red"],}));
const selected_set_name_2 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
const show_all_mana = view(Inputs.toggle({label: "Show all mana costs", value: true}));
const mana_cost_slider = view(Inputs.range(
    [0, 16],
    {step: 1, value: 1, label: 'Mana Cost'}
))
```

```js
const plots_power = [];
selected_color_2.forEach(color => {
    if (show_all_mana) {
        plots_power.push(cards_color_power(set_selector_filter(sets, selected_set_name_2), color, cards_by_sets));
    } else {
        plots_power.push(cards_color_power_mana(set_selector_filter(sets, selected_set_name_2), color, cards_by_sets, mana_cost_slider));
    }
});
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${plots_power}</div>`)
```

## Power vs rarity per color
```js
import {cards_rarity_power} from './components/power_toughness.js';
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
import {cards_rarity_toughness} from './components/power_toughness.js';
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