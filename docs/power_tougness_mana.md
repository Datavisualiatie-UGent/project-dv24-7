---
title: Power, Toughness and Mana Cost
---

```js
const data = await FileAttachment('./data/ptm.json').json();

const data_filtered = (source, filter, mana_filter, color_filter) => {
    const col = color_filter.toLowerCase();
    const filter_color = () => col === 'all' ? source : source.filter(d => d.color === col);
    const filter_set = () => filter === 'All' ? filter_color() : filter_color().filter(d => d.set === filter);
    return mana_filter === 'All' ? filter_set() : filter_set().filter(d => d.mana_cost === mana_filter);
};

const sets = ['All', ...data.sets.map(set => set.name).sort()];
const color_options = ['All', 'Red', 'Blue', 'Green', 'White', 'Black', 'Multicolor', 'Colorless'];
```

## Power vs Toughness per Color per Mana Cost
Heat map showing the relation between power and toughness. You can select a color (or all colors) can be selected to see this data. Multiple colors can be selected to compare the data. Finally, it is possible to enable a mana cost slider. This then shows how mana cost factors in to the equation. By moving the slider, you can see how mana cost is directly proportional to power and toughness.
```js
import {cards_color_power} from './components/power_tougness_mana-loader.js';
const color_ptm = view(Inputs.checkbox(color_options, {label: "Color", value: ["All"]}));
const set_ptm = view(Inputs.select(sets, {value: "All", label: "Sets"}));
const show_mana_ptm = view(Inputs.toggle({label: "Show all mana costs", value: true}));
```
```js
const mana_slider_ptm_input = Inputs.range(
    [0, 16],
    {step: 1, value: 1, label: 'Mana Cost', disabled: show_mana_ptm ? true : false}
)
const mana_slider_ptm = view(mana_slider_ptm_input)
```

```js
console.log(data.ptm);
display(html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">
    ${color_ptm.map(col => cards_color_power(col, data_filtered(data.ptm, set_ptm, show_mana_ptm ? 'All' : mana_slider_ptm, col)))}
    </div>
`);
```

## Rarity vs Power, Toughness and Mana Cost
Heatmap showing how cards are distributed in terms of rarity. You can select a color (or all colors) can be selected to see this data. Multiple colors can be selected to compare the data. Finally, you can select which property you want to compare to rarity. The possible options are power, toughness and mana cost.
```js
import {cards_color_rarity} from './components/power_tougness_mana-loader.js';
const color_rarity = view(Inputs.checkbox(color_options, {label: "Color", value: ["All"]}));
const set_rarity = view(Inputs.select(sets, {value: "All", label: "Sets"}));
const property_rarity = view(Inputs.select(['Power', 'Toughness', 'Mana Cost'], {value: "Power", label: "Property"}));
```

```js
display(html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">
    ${color_rarity.map(col => cards_color_rarity(col, data_filtered(data.ptm, set_rarity, 'All', col), property_rarity.toLowerCase().replace(' ', '_')))}
    </div>
`);
```