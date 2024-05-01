---
title: MTG card report
---

# MTG card report

```js
const data = FileAttachment("./data/mtg-loader.json").json();
```

## Card Color Distribution


```js
import {pie_chart_color_distribution} from "./data/mtg-graphs.js";
const color_distribution = data.cards.color_distribution;
display(pie_chart_color_distribution(color_distribution));
```

## Card Mana Cost By Color

```js
const colors = ["colorless", "white", "green", "red", "blue", "black", "mixed"]
const color1 = view(Inputs.select(colors, {value: "mixed", label: "Left Card Color"}));
const color2 = view(Inputs.select(colors, {value: "green", label: "Right Card Color"}));
```

```js
import {cmc_bars_by_color_d3} from "./data/mtg-graphs.js";
const color_left = color1;
const cmc_count_by_color_left = data.cards.cmc_count_by_color[color_left];
const cmc_data_left = Object.keys(cmc_count_by_color_left).map((key) => ({mana_cost: key, count: cmc_count_by_color_left[key]}));
const data_left = cmc_data_left.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null' && parseInt(d.mana_cost) <= 8);

const color_right = color2;
const cmc_count_by_color_right = data.cards.cmc_count_by_color[color_right];
const cmc_data_right = Object.keys(cmc_count_by_color_right).map((key) => ({mana_cost: key, count: cmc_count_by_color_right[key]}));
const data_right = cmc_data_right.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null' && parseInt(d.mana_cost) <= 8);
display(cmc_bars_by_color_d3(data_left, data_right, color_left, color_right));
```


## Card Power By Color

```js
const power_colors = ["colorless", "white", "green", "red", "blue", "black", "mixed"]
const power_color1 = view(Inputs.select(power_colors, {value: "blue", label: "Left Card Color"}));
const power_color2 = view(Inputs.select(power_colors, {value: "red", label: "Right Card Color"}));
```

```js
import {power_bars_by_color_d3} from "./data/mtg-graphs.js";
const color_left = power_color1;
const power_count_by_color_left = data.cards.power_count_by_color[color_left];
const power_data_left = Object.keys(power_count_by_color_left).map((key) => ({power: key, count: power_count_by_color_left[key]}));
const data_left = power_data_left.filter(d => d.power !== 'total' && d.power !== 'null' && parseInt(d.power) <= 8 && d.power !== '*' && d.power !== '-1' && d.power !== '+1' && d.power !== '+0' && d.power !== '1+*' && d.power !== '+2' && d.power !== '+4' && d.power !== '2.5' && d.power !== '?' && d.power !== '+3' && d.power !== '*²' && d.power !== '3.5' && d.power !== '∞' && d.power !== '2+*' && d.power !== '1.5' && d.power !== '.5');

const color_right = power_color2;
const power_count_by_color_right = data.cards.power_count_by_color[color_right];
const power_data_right = Object.keys(power_count_by_color_right).map((key) => ({power: key, count: power_count_by_color_right[key]}));
const data_right = power_data_right.filter(d => d.power !== 'total' && d.power !== 'null' && parseInt(d.power) <= 8 && d.power !== '*' && d.power !== '-1' && d.power !== '+1' && d.power !== '+0' && d.power !== '1+*' && d.power !== '+2' && d.power !== '+4' && d.power !== '2.5' && d.power !== '?' && d.power !== '+3' && d.power !== '*²' && d.power !== '3.5' && d.power !== '∞' && d.power !== '2+*' && d.power !== '1.5' && d.power !== '.5');
display(power_bars_by_color_d3(data_left, data_right, color_left, color_right));
```


## Card Toughness By Color

```js
const toughness_colors = ["colorless", "white", "green", "red", "blue", "black", "mixed"]
const toughness_color1 = view(Inputs.select(toughness_colors, {value: "white", label: "Left Card Color"}));
const toughness_color2 = view(Inputs.select(toughness_colors, {value: "black", label: "Right Card Color"}));
```

```js
import {toughness_bars_by_color_d3} from "./data/mtg-graphs.js";
const color_left = toughness_color1;
const toughness_count_by_color_left = data.cards.toughness_count_by_color[color_left];
const toughness_data_left = Object.keys(toughness_count_by_color_left).map((key) => ({toughness: key, count: toughness_count_by_color_left[key]}));
const data_left = toughness_data_left.filter(d => d.toughness !== 'total' && d.toughness !== 'null' && parseInt(d.toughness) <= 8 && d.toughness !== '*' && d.toughness !== '-1' && d.toughness !== '+1' && d.toughness !== '+0' && d.toughness !== '1+*' && d.toughness !== '+2' && d.toughness !== '+4' && d.toughness !== '2.5' && d.toughness !== '?' && d.toughness !== '+3' && d.toughness !== '*²' && d.toughness !== '3.5' && d.toughness !== '∞' && d.toughness !== '2+*' && d.toughness !== '1.5' && d.toughness !== '.5' && d.toughness !== '-0' && d.toughness !== '7-*');

const color_right = toughness_color2;
const toughness_count_by_color_right = data.cards.toughness_count_by_color[color_right];
const toughness_data_right = Object.keys(toughness_count_by_color_right).map((key) => ({toughness: key, count: toughness_count_by_color_right[key]}));
const data_right = toughness_data_right.filter(d => d.toughness !== 'total' && d.toughness !== 'null' && parseInt(d.toughness) <= 8 && d.toughness !== '*' && d.toughness !== '-1' && d.toughness !== '+1' && d.toughness !== '+0' && d.toughness !== '1+*' && d.toughness !== '+2' && d.toughness !== '+4' && d.toughness !== '2.5' && d.toughness !== '?' && d.toughness !== '+3' && d.toughness !== '*²' && d.toughness !== '3.5' && d.toughness !== '∞' && d.toughness !== '2+*' && d.toughness !== '1.5' && d.toughness !== '.5' && d.toughness !== '-0' && d.toughness !== '7-*');
display(toughness_bars_by_color_d3(data_left, data_right, color_left, color_right));
```
