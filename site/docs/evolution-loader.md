---
title: Evolution over time (dataloaders)
---

```js
const data = await FileAttachment('./data/basic-preproc.json').json();
```

## Evolution of color distribution
```js
import {color_per_year_bar, color_per_year_area} from './components/evolution-loader.js';
console.log(data.evolution.color_dist);
display(color_per_year_bar(data.evolution.color_dist));
display(color_per_year_area(data.evolution.color_dist));
```