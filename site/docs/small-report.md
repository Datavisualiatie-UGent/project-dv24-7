---
title: Small Test Report
---

# Let's try

```js
import { filter_sets } from "./components/timeline.js";
const sets = filter_sets(await FileAttachment("./data/sets.json").json());
const cards = await FileAttachment("./data/cards.json").json();
```

## Time between set releases (months)

```js
import {set_times} from "./components/timeline.js";
display(set_times(sets, {height: 600, width: 800}));
```

## Sets by color
```js
import {set_colors} from "./components/timeline.js";
display(set_colors(sets, cards));
```

## Evolution of complexity
```js
import {complexity} from "./components/timeline.js";
display(complexity(sets, cards));
```