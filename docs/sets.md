---
title: Set Info
---

```js
const timing = FileAttachment('./data/set_timing.json').json();
const data = FileAttachment('./data/cards_evolution.json').json();
```

## Time between releases (in months)
```js
import {set_release_time} from './components/renderers-loader.js';
display(set_release_time(timing.timing_data));
```

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

## Evolution of set type
```js
import {set_types} from './components/evolution-loader.js';
display(html`<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 20px;">${set_types(data.set_type_dist)}${set_types(data.set_type_dist, true)}</div>`)
```

## Set type distribution

```js
import {pie_chart_set_type_distribution} from "./data/mtg-graphs.js";
display(pie_chart_set_type_distribution(data.set_type_dist_pie));
```