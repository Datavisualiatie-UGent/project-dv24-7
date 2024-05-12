---
title: Influence of color
---

# Influence of color
<div>
In the universe of Magic: The Gathering color isn't just a visual characteristic but a fundamental aspect that shapes the game's mechanics, strategies, and lore. There are five colors in the game, White, Blue, Black, Red, and Green. Cards can also have no color, these cards are colorless. Cards can however also consist of more than one color. These cards are known as multicolored cards. Each color represents distinct philosophies, strengths, and weaknesses, offering players a rich tapestry of choices and strategies to explore. This page will explore how the colors are distributed in the game, and how these colors compare to each other. Finally, the relation between color and card type will be explored.
</div>
<br>

```js
const data = FileAttachment("./data/mtg.json").json();
const data_evolution = FileAttachment('./data/cards_evolution.json').json();
const data_color_type = await FileAttachment('./data/cards_color_pricing_artists.json').json();
const data_filtered = (source, filter) => {
    return filter === 'All' ? source : source.filter(d => d.set === filter);
};
const sets = ['All', ...data_color_type.sets.filtered.map(set => set.name).sort()];
```

## Card Color Distribution
<div>
We will start by looking at the overall distribution of colors in the game. The pie chart below shows how these colors are distributed. The main colors, White, Blue, Black, Red, and Green, seem to be represented equally, with multicolored cards being represented less than cards with a single color and colorless cards being the most common category.
</div>

```js
import {pie_chart_color_distribution} from "./data/mtg-graphs.js";
const color_distribution = data.data.cards.color_distribution;
display(pie_chart_color_distribution(color_distribution));
```

## Evolution of color distribution
<div>
Not only is it interesting to look at how colors are distributed over all cards, but changes in this distribution over the years are also yield very interesting insights. In the plot below we can see that the distribution of single colored cards have stayed relatively stable over the years. However, this has not been the case for colorless and multicolored cards. This is most noteable between 2002 and 2004 where barely any multicolored cards were produced. The lack of multicolored cards was mostly compensated by more colorless cards. Furthermore, in recent years, the proportion of multicolored and colorless cards have increased at the expense of the other colors.
</div>

```js
import {color_per_year_area} from './components/evolution-loader.js';
display(color_per_year_area(data_evolution.color_dist));
```

## Card Attributes By Color
<div>
Different colors focus on different strategies and cards of the same color often have a lot of synergy together. Some colors are more focused on defense, represented by higher average toughness while other colors might be more powerful. In the plot below, you can select two color categories to compare. Next you can select in which category you want to compare the colors. You can look at the difference in toughness, power or mana cost.
</div>

```js
const colors = ["colorless", "white", "green", "red", "blue", "black", "multicolor"]
const color1 = view(Inputs.select(colors, {value: "multicolor", label: "Left Card Color"}));
const color2 = view(Inputs.select(colors, {value: "green", label: "Right Card Color"}));
const attributes = ["mana cost", "power", "toughness"]
const attribute = view(Inputs.select(attributes, {value: "mana cost", label: "Attribute"}));
```

```js
import {attribute_bars_by_color_d3} from "./data/mtg-graphs.js";
const color_left = color1;
const color_right = color2;
display(attribute_bars_by_color_d3(data.data.cards, color_left, color_right, attribute));
```

## Number of Cards per Color per Card Type
<div>
Below, a heatmap is showing how often a card type occurs in a certain color. It is possible to select a certain set or all sets. Most colored cards are creatures, while most colorless cards are artifacts. Blue cards are the most often instant, while sorcery cards are mostly red and black. Enchantments again are mostly white. This tracks with white cards being more defensive.
</div>

```js
import {cards_color_type} from './components/card_info-loader.js';
const set_for_color_type = view(Inputs.select(sets, {value: "All", label: "Sets"}));
```

```js
display(cards_color_type(data_filtered(data_color_type.card_info.color_type, set_for_color_type)));
```
