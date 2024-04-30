---
title: Evolution over time
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
import {set_selector_filter} from './components/utils.js';
```

## Evolution of color distribution
Graph showing how the distribution of colors changed over the years
<!-- ```js
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

<br> -->

```js
import {color_per_year_area_plot} from './components/evolution.js';
display(color_per_year_area_plot(sets, cards_by_sets));
```

## Evolution fo rarity distribution
Graph showing how the distribution of colors changed over the years
<!-- ```js
import {rarity_per_year_area} from './components/evolution.js';
display(rarity_per_year_area(sets, cards_by_sets));
``` -->

<br>

```js
import {rarity_per_year_area_plot} from './components/evolution.js';
display(rarity_per_year_area_plot(sets, cards_by_sets));
```

## Reprints vs New Cards
Graph showing how many cards were released each year and how many of those are new cards or reprints.
```js
import {reprints} from './components/evolution.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(sets, cards_by_sets, 'bar')}${reprints(sets, cards_by_sets, 'bar', true)}</div>`)
```

## Evolution of set type
Graph showing how many of each set type were released each year
```js
import {set_type, set_type_dist} from './components/evolution.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_type(sets, 'bar')}${set_type(sets, 'bar', true)}</div>`)
```

## Set type distribution
Graph showing how many sets of each set type there are
```js
display(set_type_dist(sets))
```