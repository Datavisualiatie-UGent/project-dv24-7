---
title: Card info
---

```js
import {sets_raw, sets, cards_by_sets, set_kinds} from './components/preprocessing.js'
import {set_selector_filter} from './components/utils.js';
```

## Number of cards per color per type
A heatmap showing how often a card type occurs in a certain color.
```js
import {cards_color_type} from './components/card_info.js';
const selector = ['All'];
selector.push(...sets.map(set => set.name).sort())
const selected_set_name_1 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
```

```js
display(cards_color_type(set_selector_filter(sets, selected_set_name_1), cards_by_sets));
```

## Card prices
A bar graph showing the N most expensive cards. You can select if you want to see this for all sets or a specific set. The number of cards displayed can be changed using the slider.
```js
import {card_prices} from './components/card_info.js';
const selected_set_name_2 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
const number_prices = view(
  Inputs.range(
    [1, 100],
    {step: 1, value: 25, label: 'Number of cards'}
  )
);
```

```js
display(card_prices(set_selector_filter(sets, selected_set_name_2), cards_by_sets, parseInt(number_prices)));
```

## Most noteable artists
Bar graph showing the number of unique arts (i.e. reprints not counted) that the top artists made. You can select if you want to see this for all sets or a specific set. The number of cards displayed can be changed using the slider.
```js
import {artists, artists_reprints} from './components/card_info.js';
const selected_set_name_3 = view(Inputs.select(selector, {value: "All", label: "Sets"}));
const number_artists = view(
  Inputs.range(
    [1, 100],
    {step: 1, value: 25, label: 'Number of cards'}
  )
);
```

```js
display(artists(set_selector_filter(sets, selected_set_name_3), cards_by_sets, parseInt(number_artists)));
display(artists_reprints(set_selector_filter(sets, selected_set_name_3), cards_by_sets, parseInt(number_artists)));
```