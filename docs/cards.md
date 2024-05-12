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
<div>
The game of Magic: The Gathering is all about cards. New cards can completely change the meta, but older cards can also be made available again by reprinting them. The plot below shows 2 stacked bar charts representing the number of new cards and the number of reprints. The chart on the left shows the total number of new cards and reprints, while the chart on the right normalises these values to the total number of cards released. The normalised view therefore shows the proportion of new cards to reprints over the years.
<br><br>
The number of new cards has overall stayed relatively stable, we can however observe that since about 2010, the number of new cards have slowly been increasing. The number of new cards in 2024 is lower, but considering that we're not even halfway through the year, 2024 looks to be keeping that trend.
<br><br>
The total number of cards released sees more dramatic changes. For example, 2002, 2004 and 2006 saw almost no reprints while 2020 saw a massive number of reprints. This can be explained by the pandemic. With disruptions and more people at home wanting to collect cards, it was easy to focus on reprints rather than making new cards. 2022 also saw a spike in reprints which is a result of special releases for the 30th aniversary of the game featuring many reprints of classic cards. Similar to the trend seen in new cards, the number of reprints has also slowly been increasing over the recent years.
</div>

```js
import {reprints} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${reprints(data_evolution.reprint_dist)}${reprints(data_evolution.reprint_dist, true)}</div>`)
```

## Card Prices
<div>
Like any trading card game, Magic: The Gathering also features some wildly expensive cards. These cards are often very powerfull and/or have a limited number of prints. The bar graph below shows these statistics. It displays the ${tex`n`} most expensive cards. You can select if you want to see the prices for all sets or a specific set. The number of cards displayed can be changed using the slider. For the view featuring all sets, the name of the set is added to the labels since some cards are featured multiple times in the list of most expensive cards due to reprints.
</div>

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
<div>
Magic the gathering is not only just a card game. Some people in the community are also just collectors. These people don't play the game, but collect the cards for their artwork. Each card features artwork made by an artist. Some artists only design the artwork of a single card, while others can be seen very frequently. Th stacked bar chart below shows how many cards an artist has designed. On the left, the number of reprinted cards with their artwork is shown, while on the right the number of unique cards is shown. The bars are sorted by the number of unique cards made by the artist. Once again it is possible to select a set or to see this over all cards and to change the number of cards displayed.
</div>

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
<div>
Cards also have a rarity. This rarity determines how many of them are printed. A more rare card is thus also more difficult to pull. The plot below shows how the distribution of cards with different rarities have evolved. Common, uncommon and rare cards have always existed. 2008 saw the introduction of even rarer cards, called mythic cards. 2014 features a one-of bonus rarity. Similarly, 2021 has a special rarity. Rarities have kept stable, but more rare cards have been printed recently.
</div>

```js
import {rarity_per_year_area} from './components/evolution-loader.js';
display(rarity_per_year_area(data_evolution.rarity_dist));
```