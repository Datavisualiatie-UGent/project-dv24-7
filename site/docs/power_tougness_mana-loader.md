---
title: Power, Toughness and Mana Cost
---

```js
const data = await FileAttachment('./data/basic-preproc.json').json();

const data_filtered = (source, filter, mana_filter) => {
    const filter_set = () => filter === 'All' ? source : source.filter(d => d.set === filter);
    return mana_filter === 'All' ? filter_set() : filter_set().filter(d => d.mana_cost === mana_filter);
};

const sets = ['All', ...data.sets.filtered.map(set => set.name).sort()];
const color_options = ['Red', 'Blue', 'Green', 'White', 'Black', 'Mixed', 'Colorless', 'All'];
```

## Power vs Toughness per Color per Mana Cost
Heat map showing the relation between power and toughness. You can select a color (or all colors) can be selected to see this data. Multiple colors can be selected to compare the data. Finally, it is possible to enable a mana cost slider. This then shows how mana cost factors in to the equation. By moving the slider, you can see how mana cost is directly proportional to power and toughness.
```js
import {cards_color_power} from './components/power_tougness_mana-loader.js';
const color_ptm = view(Inputs.checkbox(color_options, {label: "Color", value: ["All"]}));
const set_ptm = view(Inputs.select(sets, {value: "All", label: "Sets"}));
const show_mana_ptm = view(Inputs.toggle({label: "Show all mana costs", value: true}));
const mana_slider_ptm = view(Inputs.range(
    [0, 16],
    {step: 1, value: 1, label: 'Mana Cost'}
));
```

```js
display(html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">
    ${color_ptm.map(col => cards_color_power(col, data_filtered(data.card_info.color_power, set_ptm, show_mana_ptm ? 'All' : mana_slider_ptm)))}
    </div>
`);
```