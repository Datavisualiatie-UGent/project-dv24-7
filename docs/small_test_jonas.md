---
title: Small Test Jonas
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
```

## Time between releases (in months)
```js
import {set_release_time} from './components/renderers.js';
display(set_release_time(sets));
```

## Number of sets per year
```js
import {sets_per_year} from './components/renderers.js';
display(sets_per_year(sets));
```

## Evolution of set complexity
```js
import {complexity} from './components/renderers.js';
display(complexity(sets, cards_by_sets));
```

## Evolution of set complexity by set kind
```js
import {complexity_by_kind} from './components/renderers.js';
display(complexity_by_kind(set_kinds, sets_raw, cards_by_sets));
```