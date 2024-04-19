---
title: Small Test Jonas
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