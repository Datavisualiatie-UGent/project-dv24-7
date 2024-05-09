---
title: Set Info
---

```js
const data = await FileAttachment('./data/cards_evolution.json').json();
const timing = await FileAttachment('./data/set_timing.json').json();
```

## Time between releases (in months)
```js
import {set_release_time} from './components/renderers-loader.js';
display(set_release_time(timing.timing_data));
```

## Evolution of set type
```js
import {set_types} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_types(data.set_type_dist)}${set_types(data.set_type_dist, true)}</div>`)
```

## Set type distribution

```js
import {pie_chart_set_type_distribution} from "./data/mtg-graphs.js";
display(pie_chart_set_type_distribution(data.set_type_dist_pie));
```