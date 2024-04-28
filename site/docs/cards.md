---
title: Card info
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
import {set_selector_filter} from './components/utils.js';
```

## Number of cards per color per type
```js
import {cards_color_type} from './components/card_info.js';
const selector = ['All'];
selector.push(...sets.map(set => set.name).sort())
const selected_set_name = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
display(cards_color_type(set_selector_filter(sets, selected_set_name), cards_by_sets));
```

## Card prices
```js
import {card_prices} from './components/card_info.js';
const selected_set_name_5 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
const prices_order = view(Inputs.select(['Ascending', 'Descending'], {value: "Descending", label: "Order"}));
const number_prices = view(
  Inputs.range(
    [1, 100],
    {step: 1, value: 25, label: 'Number of cards'}
  )
);
```

```js
display(card_prices(set_selector_filter(sets, selected_set_name_5), cards_by_sets, parseInt(number_prices), prices_order));
```