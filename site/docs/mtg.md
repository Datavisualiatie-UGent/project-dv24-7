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