---
title: Set Info
---

# Set Data
<div>
Magic: The Gathering cards are released as sets. Each set is a collection of cards that are released together and used with the same rules. Cards from a set can be obtained randomly through booster packs or in box sets. There are many different types of sets, each fulfilling a different purpose in the game.
</div>
<br>

```js
const timing = FileAttachment('./data/set_timing.json').json();
const data = FileAttachment('./data/cards_evolution.json').json();
```

## Time between releases (in months)
<div>
Wizards of the Coast (the company that makes Magic: The Gathering) releases more and more sets per year.
Here we show a figure that shows the time between releases of sets in months (e.g. <i>Alliances</i> (June 1996) was released 8 months after <i>Homelands</i> (October 1995)).
However, we also have to note that many sets these days are accompanied by supplementary products, which might skew the results (e.g. 2016's Welcome Decks were released alongside <i>Shadows over Innistrad</i>). 
We've attempted to filter these out based on set type, but that is not always possible.
Additionally, Wizards' line of digital-only products (e.g. <i>Explorer Anthology 1</i>) also skews the results.
</div>
<br>
<div>
What should be clear is that the amount of recent sets with only a month between them (e.g. <i>Fallout</i> (March 2024) and <i>Outlaws at Thunder Junction</i> (April 2024)) is increasing.
A lot of these include so-called <i>Universes Beyond</i> sets, which are sets in cooperation with other IPs (e.g. <i>Lord of the Rings</i>, the <i>Fallout</i> games, ...).
</div>
<br>
<div>
On the interactive plot above, you can over each set (dot) to see some details.
The blue line shows the average time between releases for each year.
</div>
<br>

```js
import {set_release_time} from './components/renderers-loader.js';
display(set_release_time(timing.timing_data));
```

## Set types
<div>
As previously mentioned, each set is of a certain type. This type is descriptive of the sets purpose. The first and most important set type is the expansion. Expansions feature the latest legal cards in the standard ruleset. Usually a few consequtive sets have an overarching theme. Each of these themes can define the current meta and determine how the game is played. Older sets are often taken out of rotation. Another type are the box sets. These are sold as packages often containing one or more preconstructed decks. Starter sets on the other hand feature a simple way of learning the game. Sets such as the master series feature exclusively reprints. Finally some sets such as masters or planechase sets are exclusively mae for a different playstyle than the standard format. We're now gonna delve deeper into how common each of these sets are.
</div>
<br>

### Set Type Distribution
<div>
Below you can find a pie chart showing all currently released Magic: The Gathering sets and how common they are. By far, expansions are the most common. This emphasises again that these sets form the base of the game. In second and third you can find box sets. Box sets are important in provinding easily accessible decks without the need of collecting cards and buying random packs. Master sets on the other hand provide reprints to add new versions of old cards.
</div>

```js
import {pie_chart_set_type_distribution} from "./data/mtg-graphs.js";
display(pie_chart_set_type_distribution(data.set_type_dist_pie));
```

### Evolution of Set Type Distribution
<div>
The distribution of sets released each year can be seen below. Both in absolute numbers as relative to the total number of sets released that year. Both views provide a different interpretation. we can see that not all set types see new releases each year. The only type that is present each year is the expansions. Box sets also seem to be a staple, such as starter set. The core set for example has been recently discontinued. And planechase sets have only been released in 2009, 1012 and 2016. Intrestlingly, starter sets have only been released in 2 small burst with the first one being between 1996 adn 2000 and the second one between 2016 and 2020. 
</div>
<div>
Finally, this plot also emphasises the conclusion drawn at the top of this page. The number of released sets each years had been relatively stable until 2014. After 2014, the number of sets released has been steadily increasing
</div>

```js
import {set_types} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_types(data.set_type_dist)}${set_types(data.set_type_dist, true)}</div>`)
```