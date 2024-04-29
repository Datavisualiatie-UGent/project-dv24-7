---
title: Evolution over time
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
import {set_selector_filter} from './components/utils.js';
```

## Evolution of color distribution
```js
import {color_per_year_bar} from './components/evolution.js';
display(color_per_year_bar(sets, cards_by_sets));
```

```js
// import {color_per_year_bar_plot} from './components/evolution.js';
// display(color_per_year_bar_plot(sets, cards_by_sets));
```

```js
import {color_per_year_area} from './components/evolution.js';
display(color_per_year_area(sets, cards_by_sets));
```

<br>

```js
import {color_per_year_area_plot} from './components/evolution.js';
display(color_per_year_area_plot(sets, cards_by_sets));
```

```js
import {rarity_per_year_area} from './components/evolution.js';
display(rarity_per_year_area(sets, cards_by_sets));
```
<br>

## Reprints vs New Cards
```js
import {reprints} from './components/evolution.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(sets, cards_by_sets, 'bar')}${reprints(sets, cards_by_sets, 'bar', true)}</div>`)
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(sets, cards_by_sets, 'area', )}${reprints(sets, cards_by_sets, 'area', true)}</div>`)
```

## Evolution of set size
```js
import {cards_per_set_per_year} from './components/evolution.js';
display(cards_per_set_per_year(sets, cards_by_sets));
```

## Evolution of set type
```js

import {set_type_dist, set_type} from './components/evolution.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_type(sets, 'bar')}${set_type(sets, 'bar', true)}</div>`)
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_type(sets, 'area')}${set_type(sets, 'area', true)}</div>`)
display(set_type_dist(sets))
```

## Number of cards released per year
```js
import {cards_per_year} from './components/evolution.js';
display(cards_per_year(sets, cards_by_sets));
```