---
title: Small Test Jonas
---

```js
const data = await FileAttachment('./data/basic-preproc.json').json();
```

## Time between releases (in months)
```js
import {set_release_time} from './components/renderers-loader.js';
display(set_release_time(data.timing_data));
```

## Sets per year
```js
import {sets_per_year} from './components/renderers-loader.js';
display(sets_per_year(data.timing_data.per_year));
```

## Evolution of set complexity
```js
import {complexity} from './components/renderers-loader.js';
display(complexity(data.complexity.raw.map(d => ({...d, release: new Date(d.release)}))));
```

## Set complexity by kind
```js
import {complexity_by_kind} from './components/renderers-loader.js';
display(complexity_by_kind(data.sets.kinds, data.complexity.by_kind));
```