---
title: Small Test Viktor
---

```js
const exclude = [
  'alchemy', 'archenemy', 'duel_deck', 'from_the_vault', 'funny', 
  'masterpiece', 'memorabilia', 'minigame', 'premium_deck', 'promo',
  'spellbook', 'token', 'treasure_chest', 'vanguard'  
];

const preproc_sets = (sets) => {
    return sets.map(set => {
        return {
            ...set,
            release: new Date(set.released_at)
        };
    }).sort((a, b) => a.release - b.release);
};
const remove_excluded_sets = (sets) => {
    return sets.filter(set => set.parent_set_code === undefined).filter(set => !exclude.includes(set.set_type));
};

const sets = preproc_sets(remove_excluded_sets((await FileAttachment("./data/sets.json").json()).data));

const load_cards = async () => {
    const cards = {};
    const card_zip = await FileAttachment("./data/cards.zip").zip();
    await Promise.all(sets.map(async set => {
        cards[set.code] = await card_zip.file(`out/${set.code}.json`).json();
    }));
    console.log(cards);
    return cards;
};
const cards_by_sets = await load_cards();
```

## Evolution of color distribution
```js
import {color_per_year_bar} from './components/renderers.js';
display(color_per_year_bar(sets, cards_by_sets));
```

```js
import {color_per_year_area} from './components/renderers.js';
display(color_per_year_area(sets, cards_by_sets));
```

<br>
<br>

```js
import {color_per_year_area_plot} from './components/renderers.js';
display(color_per_year_area_plot(sets, cards_by_sets));
```


## Evolution of set size
```js
import {cards_per_set_per_year} from './components/renderers.js';
display(cards_per_set_per_year(sets, cards_by_sets));
```

## Number of cards released per year
```js
import {cards_per_year} from './components/renderers.js';
display(cards_per_year(sets, cards_by_sets));
```

## Number of cards per color per type
```js
import {cards_color_type} from './components/renderers.js';
const selector = ['All'];
selector.push(...sets.map(set => set.name))
const selected_set_name = view(Inputs.select(selector, {value: "All", label: "Sets", sort: 'ascending'}));
```

```js
display(cards_color_type(sets, selected_set_name, cards_by_sets));
```


## Card power vs color
```js
import {cards_color_power} from './components/renderers.js';
const color_list = ['All', 'Black', 'Blue', 'Green', 'Multi', 'Red', 'White']
const selected_color = view(Inputs.select(color_list, {value: "All", label: "Color", sort: 'ascending'}));
```


```js
display(cards_color_power(sets, selected_color, cards_by_sets));
```