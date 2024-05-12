---
title: Card data
---

# Card Data
<div>
Welcome to our card data page, where we delve into fascinating statistics and insights about Magic: The Gathering cards. We'll uncover intriguing details that go beyond the gameplay. We will explore the frequency of new card releases and the frequency of card reprints. We will look into card pricing and discover the most notable and influential artists behind the cards. Finally, we'll also delve into how the distribution of rarities of the cards have evolved.
</div>
<br>

```js
const data = await FileAttachment('./data/cards_color_pricing_artists.json').json();
const data_evolution = await FileAttachment('./data/cards_evolution.json').json();

const data_filtered = (source, filter) => {
    return filter === 'All' ? source : source.filter(d => d.set === filter);
};

const sets = ['All', ...data.sets.filtered.map(set => set.name).sort()];
```

## Reprints vs New Cards


```js
import {reprints} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(data_evolution.reprint_dist)}${reprints(data_evolution.reprint_dist, true)}</div>`)
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
A bar graph showing the ${tex`n`} most expensive cards. You can select if you want to see this for all sets or a specific set. The number of cards displayed can be changed using the slider.

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
// display(artists(data_filtered(data.card_info.artist, set_for_artists), parseInt(number_artists)));
display(artists_reprints(data_filtered(data.card_info.artist, set_for_artists), parseInt(number_artists)));
```

## Evolution of rarity distribution
```js
import {rarity_per_year_area} from './components/evolution-loader.js';
display(rarity_per_year_area(data_evolution.rarity_dist));
```