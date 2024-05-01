---
title: Small Test Jonas
---

```js
const timing = await FileAttachment('./data/set_timing.json').json();
const complexity_data = await FileAttachment('./data/complexity.json').json();
```

## Time between releases (in months)
```js
import {set_release_time} from './components/renderers-loader.js';
display(set_release_time(timing.timing_data));
```

## Sets per year
```js
import {sets_per_year} from './components/renderers-loader.js';
display(sets_per_year(timing.timing_data.per_year));
```

## Evolution of set complexity
```js
import {complexity} from './components/renderers-loader.js';
display(complexity(complexity_data.raw.map(d => ({...d, release: new Date(d.release)}))));
```

## Set complexity by kind
```js
import {complexity_by_kind} from './components/renderers-loader.js';
display(complexity_by_kind(complexity_data.kinds, complexity_data.by_kind));
```