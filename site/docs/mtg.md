---
title: MTG card report
---

# MTG card report

```js
const data = FileAttachment("./data/mtg-loader.json").json();
```

## Card Layout

Cards can have different kinds of layout. This is a simple grouping of the layouts.

x: number of cards with the same layout

y: layout of the card

```js
import {layout_bars} from "./data/mtg-graphs.js";
const layout_count = data.cards.layout_count;
const bars_data = Object.keys(layout_count).map((key) => ({layout: key, count: layout_count[key]}));
import {html} from "npm:htl";
display(html`The following graph excludes the ${layout_count["normal"]} cards with a normal layout.`)
display(layout_bars(bars_data.filter(d => d.layout !== 'total' && d.layout !== 'normal')));
```

Source data:
```js
data.cards.layout_count
```

## Card Mana Cost

Mana cost of a card.

x: number of cards

y: mana cost of card

```js
import {cmc_bars} from "./data/mtg-graphs.js";
const cmc_count = data.cards.cmc_count;
const cmc_data = Object.keys(cmc_count).map((key) => ({mana_cost: key, count: cmc_count[key]}));
display(cmc_bars(cmc_data.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null')));
```

Source data:
```js
data.cards.cmc_count
```

## Card Color Distribution

Source data:
```js
data.cards.color_distribution
```

```js
import {pie_chart_color_distribution} from "./data/mtg-graphs.js";
const color_distribution = data.cards.color_distribution;
display(pie_chart_color_distribution(color_distribution));
```

## Card Mana Cost By Color
```js
/* import {cmc_bars_by_color_left} from "./data/mtg-graphs.js";
const cmc_count_by_color = data.cards.cmc_count_by_color['black'];
const cmc_data = Object.keys(cmc_count_by_color).map((key) => ({mana_cost: key, count: cmc_count_by_color[key]}));
display(cmc_bars_by_color_left(cmc_data.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null'))); */
```

<!-- <select name="colors" id="colors">
  <option value="white">white</option>
  <option value="green">green</option>
  <option value="red">red</option>
  <option value="blue">blue</option>
</select> -->

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

Source data:
```js
data.cards.cmc_count_by_color
```

## Card Power By Color

```js
const power_colors = ["colorless", "white", "green", "red", "blue", "black", "mixed"]
const power_color1 = view(Inputs.select(power_colors, {value: "mixed", label: "Left Card Color"}));
const power_color2 = view(Inputs.select(power_colors, {value: "green", label: "Right Card Color"}));
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

Source data:
```js
data.cards.power_count_by_color
```

## Card Power

Power value of a card.

x: number of cards

y: power value

```js
import {power_bars} from "./data/mtg-graphs.js";
const power_count = data.cards.power_count;
const power_data = Object.keys(power_count).map((key) => ({power: key, count: power_count[key]}));
display(power_bars(power_data.filter(d => d.power !== 'total' && d.power !== 'null')));
```

Source data:
```js
data.cards.power_count
```

## Card Toughness By Color

```js
const toughness_colors = ["colorless", "white", "green", "red", "blue", "black", "mixed"]
const toughness_color1 = view(Inputs.select(toughness_colors, {value: "mixed", label: "Left Card Color"}));
const toughness_color2 = view(Inputs.select(toughness_colors, {value: "green", label: "Right Card Color"}));
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

Source data:
```js
data.cards.toughness_count_by_color
```

## Card Toughness

Toughness value of a card.

x: number of cards

y: toughness value

```js
import {toughness_bars} from "./data/mtg-graphs.js";
const toughness_count = data.cards.toughness_count;
const toughness_data = Object.keys(toughness_count).map((key) => ({toughness: key, count: toughness_count[key]}));
display(toughness_bars(toughness_data.filter(d => d.toughness !== 'total' && d.toughness !== 'null')));
```

Source data:
```js
data.cards.toughness_count
```

## Card Power/Toughness Difference

Difference between power and toughness value of a card.

x: number of cards

y: difference calculated as follows: Power - Toughness

```js
import {pow_tough_diff_bars} from "./data/mtg-graphs.js";
const pow_tough_diff_count = data.cards.power_toughness_diff_count;
const pow_tough_diff_data = Object.keys(pow_tough_diff_count).map((key) => ({power_toughness_difference: key, count: pow_tough_diff_count[key]}));
display(pow_tough_diff_bars(pow_tough_diff_data.filter(d => d.power_toughness_difference !== 'total' && d.power_toughness_difference !== 'NaN')));
```

Source data:
```js
data.cards.power_toughness_diff_count
```

## Power-Toughness Difference By Color
```js
/* import {cmc_bars_by_color_left} from "./data/mtg-graphs.js";
const cmc_count_by_color = data.cards.cmc_count_by_color['black'];
const cmc_data = Object.keys(cmc_count_by_color).map((key) => ({mana_cost: key, count: cmc_count_by_color[key]}));
display(cmc_bars_by_color_left(cmc_data.filter(d => d.mana_cost !== 'total' && d.mana_cost !== 'null'))); */
```

```js
import {power_toughness_difference_bars_by_color_d3} from "./data/mtg-graphs.js";
const color_left = 'red';
const power_toughness_difference_count_by_color_left = data.cards.power_toughness_difference_count_by_color[color_left];
const power_toughness_difference_data_left = Object.keys(power_toughness_difference_count_by_color_left).map((key) => ({power_toughness_difference: key, count: power_toughness_difference_count_by_color_left[key]}));
const data_left = power_toughness_difference_data_left.filter(d => d.power_toughness_difference !== 'total' && d.power_toughness_difference !== 'NaN' && d.power_toughness_difference !== '0');

const color_right = 'blue';
const power_toughness_difference_count_by_color_right = data.cards.power_toughness_difference_count_by_color[color_right];
const power_toughness_difference_data_right = Object.keys(power_toughness_difference_count_by_color_right).map((key) => ({power_toughness_difference: key, count: power_toughness_difference_count_by_color_right[key]}));
const data_right = power_toughness_difference_data_right.filter(d => d.power_toughness_difference !== 'total' && d.power_toughness_difference !== 'NaN' && d.power_toughness_difference !== '0');
display(power_toughness_difference_bars_by_color_d3(data_left, data_right, color_left, color_right));
```

Source data:
```js
data.cards.cmc_count_by_color
```


## Card Set Sizes

Distribution of sets by their size (= number of cards in set).

x: size of set

y: number of sets with size x

You can hover over bars to get exact values.

```js
import {set_sizes_bars} from "./data/mtg-graphs.js";
const set_size_count = data.cards.set_size_count;
const group_sets_by_size = Object.keys(set_size_count).reduce((acc, curr) => {
    const code = curr;
    const size = set_size_count[curr];
    if (curr !== 'total') {
        acc[size] ? acc[size]++ : acc[size] = 1;
    }
    return acc;
}, {});
const set_sizes_data = Object.keys(group_sets_by_size).map((key) => ({number_of_sets: group_sets_by_size[key], count: key}));
display(set_sizes_bars(set_sizes_data, {height: 900, width: 1200}));
```

Source data:
```js
data.cards.set_size_count
```

## Set sizes by release date

Number of cards in a set. Sets are ordered by release date.

x: release date

y: size of set

You can hover over points to get name, release date and size of the set.
```js
import {set_sizes} from "./data/mtg-graphs.js";
const sets = data.sets.sets;
const sets_data = Object.keys(sets).map((key) => ({code: key, name: sets[key]['name'], release: sets[key]['release'], size: sets[key]['size']}));
display(set_sizes(sets_data, {height: 900, width: 1200}));
```

Source data:
```js
data.sets.sets
```