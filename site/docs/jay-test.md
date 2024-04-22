---
title: Small Test Jonas
---

```js
const exclude_always = [ 'minigame', 'token', 'promo', 'memorabilia', 'treasure_chest', 'vanguard' ];

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

const sets_raw = preproc_sets((await FileAttachment("./data/sets.json").json()).data)
    .filter(x => !exclude_always.includes(x.set_type));
const sets = remove_excluded_sets(sets_raw);
const set_kinds = [...new Set(sets_raw.map(set => set.set_type))]; 

const load_cards = async () => {
    const cards = {};
    const card_zip = await FileAttachment("./data/cards.zip").zip();
    await Promise.all(sets_raw.map(async set => {
        cards[set.code] = await card_zip.file(`out/${set.code}.json`).json();
    }));
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

## Evolution of set complexity by set kind
```js
import {complexity_by_kind} from './components/renderers.js';
display(complexity_by_kind(set_kinds, sets_raw, cards_by_sets));
```