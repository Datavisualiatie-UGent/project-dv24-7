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
Heat map showing the relation between power and toughness. You can select a color (or all colors) can be selected to see this data. Multiple colors can be selected to compare the data. Finally, it is possible to enable a mana cost slider. This then shows how mana cost factors in to the equation. By moving the slider, you can see how mana cost is directly proportional to power and toughness.
```js
import {cards_color_power_mana, cards_color_power} from './components/power_toughness_mana.js';
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

## Rarity vs Power, Toughness and Mana Cost
Heatmap showing how cards are distributed in terms of rarity.
You can select a color (or all colors) can be selected to see this data. Multiple colors can be selected to compare the data. Finally, you can select which property you want to compare to rarity. The possible options are power, toughness and mana cost.
```js
import {rarity_vs_property} from './components/power_toughness_mana.js';
const selected_color_3 = view(Inputs.checkbox(color_list, {label: "Color", value: ["Red"],}));
const selected_set_name_3 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
const selected_property = view(Inputs.select(['Power', 'Toughness', 'Mana Cost'], {value: "Power", label: "Property"}));
```

```js
const plots_power = []
selected_color_3.forEach(color => {
    plots_power.push(rarity_vs_property(set_selector_filter(sets, selected_set_name_3), color, cards_by_sets, selected_property.toLowerCase().replace(' ', '_')));
});
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${plots_power}</div>`)
```

# Box and whisker plot 
```js
const selected_color_6 = view(Inputs.select(color_list, {label: "Color", value: "Red",}));
const selected_set_name_6 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
import {rarity_morley} from './components/power_toughness_mana.js';
display(rarity_morley(set_selector_filter(sets, selected_set_name_6), selected_color_6, cards_by_sets))
```