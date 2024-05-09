---
title: Influence of color
---

# Influence of color

```js
const data = FileAttachment("./data/mtg.json").json();
const data_evolution = await FileAttachment('./data/cards_evolution.json').json();
```

## Card Color Distribution

Black, white, red, green and blue are the five core colors of Magic: The Gathering. Some cards can have more than one color and are called 'multicolor'. Colorless cards exist as well. The pie chart below shows the color distribution of all cards in the game. Looking at the core colors, we see that these are balanced quite well.

```js
import {pie_chart_color_distribution} from "./data/mtg-graphs.js";
const color_distribution = data.data.cards.color_distribution;
display(pie_chart_color_distribution(color_distribution));
```

## Card Attributes By Color

Different colors focus on different strategies and cards of the same color often have a lot of synergy together. Below we can compare attribute distributions for the different colors.

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

## Evolution of color distribution
```js
import {color_per_year_area} from './components/evolution-loader.js';
display(color_per_year_area(data_evolution.color_dist));
```

