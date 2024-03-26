---
title: Small Test Report
---

# Let's try

## Time between set releases (months)

```js
import {set_times} from "./components/timeline.js";
```

```js
const events = FileAttachment("./data/sets.json").json();
```

```js
display(set_times(events, {height: 600, width: 800}));
```

## Sets by color
```js
import {set_colors} from "./components/timeline.js";
FileAttachment("./data/sets.json").json().then(sets => {
    FileAttachment("./data/cards.json").json().then(cards => {
        display(set_colors(sets, cards, 1, 800, 600));
    });
});
```