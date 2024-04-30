---
title: Card info (dataloader)
---

```js
const data = await FileAttachment('./data/basic-preproc.json').json();

const data_filtered = (source, filter) => {
    return filter === 'All' ? source : source.filter(d => d.set === filter);
};

const sets = ['All', ...data.sets.filtered.map(set => set.name).sort()];
```

## Number of Cards per Color per Card Type
A heatmap showing how often a card type occurs in a certain color.

```js
import {cards_color_type} from './components/card_info-loader.js';
const set_for_color_type = view(Inputs.select(sets, {value: "All", label: "Sets"}));
```

```js
display(cards_color_type(data_filtered(data.card_info.color_type, set_for_color_type)));
```

## Card Prices
A bar graph showing the N most expensive cards. You can select if you want to see this for all sets or a specific set. The number of cards displayed can be changed using the slider.

```js
import {cards_prices} from './components/card_info-loader.js';
const set_for_prices = view(Inputs.select(sets, {value: "All", label: "Sets"}));
const prices_count = view(
  Inputs.range(
    [1, 100],
    {step: 1, value: 25, label: 'Number of cards'}
  )
);
```

```js
display(cards_prices(data_filtered(data.card_info.prices, set_for_prices), parseInt(prices_count), set_for_prices === 'All'));
```

## Most Notable Artists
Bar graph showing the number of unique arts (i.e. reprints not counted) that the top artists made. You can select if you want to see this for all sets or a specific set. The number of cards displayed can be changed using the slider.

```js
import {artists, artists_reprints} from './components/card_info-loader.js';
const set_for_artists = view(Inputs.select(sets, {value: "All", label: "Sets"}));
const number_artists = view(
    Inputs.range(
        [1, 100],
        {step: 1, value: 25, label: 'Number of cards'}
    )
);
```

```js
display(artists(data_filtered(data.card_info.artist, set_for_artists), parseInt(number_artists)));
display(artists_reprints(data_filtered(data.card_info.artist, set_for_artists), parseInt(number_artists)));
```