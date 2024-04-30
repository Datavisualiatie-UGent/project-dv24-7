---
title: Evolution over time (dataloaders)
---

```js
const data = await FileAttachment('./data/basic-preproc.json').json();
```

## Evolution of color distribution
```js
import {color_per_year_area} from './components/evolution-loader.js';
display(color_per_year_area(data.evolution.color_dist));
```

## Evolution of rarity distribution
```js
import {rarity_per_year_area} from './components/evolution-loader.js';
display(rarity_per_year_area(data.evolution.rarity_dist));
```

## Reprints vs New Cards
```js
import {reprints} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(data.evolution.reprint_dist)}${reprints(data.evolution.reprint_dist, true)}</div>`)
```

## Evolution of set type
```js
import {set_types} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_types(data.evolution.set_type_dist)}${set_types(data.evolution.set_type_dist, true)}</div>`)
```

## Set type distribution
```js
import {set_type_dist} from './components/evolution-loader.js';
display(set_type_dist(data.evolution.set_type_dist));
```