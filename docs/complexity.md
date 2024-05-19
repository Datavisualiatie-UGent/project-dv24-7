---
title: Card Complexity
---

```js
const complexity_data = await FileAttachment('./data/complexity.json').json();
```

## Evolution of set complexity
<div>
It is often joked that Magic: The Gathering cards are small novellas these days. 
The figure below shows the evolution of the average complexity of cards in each set.
We measure the complexity of a card by the number of words in its rules text (summed up if a card has multiple faces/parts).
With this figure, we aim to show that, while complexity has indeed increased on average, it will still take a while before we get to the point where every card is a novel (if we assume 70K words for an average novel, the first set featuring novel-length cards will be released in the year 3620).
</div>
<br>
<div>
You can hover over each set (a dot in the graph) to see the details of the set.<br>
The most complex set to date was <i>March of the Machine</i> (released in 2023), with a whopping 40 words per card on average.
On the other end of the spectrum, we have the sets <i>2017 Gift Pack</i> and <i>Arena New Player Experience</i> (from 2017 and 2018, respectively), which had only basic lands in them (with full rules text "{T}: Add {?}").
If we remove these outliers, we end up with <i>Starter 2000</i>, a very small set of 20 cards aimed at beginning players (with an average complexity of 5.8 words per card).
</div>

```js
import {complexity} from './components/renderers-loader.js';
display(complexity(complexity_data.raw.map(d => ({...d, release: new Date(d.release)}))));
```

<br><br>

## Set complexity by kind
<div>
Magic: The Gathering's sets are divided into multiple categories (more on those on <a href="sets">the sets page</a>).
All categories are equal in complexity, but some are more equal than others.
It is clear that starter sets (cyan) and core sets (black) are less complex than, e.g. expansion sets (dark blue).
Looking back at our previous sets, we see that <i>Starter 2000</i> is indeed among the starter sets, with <i>March of the Machine</i> being an expansion set.
</div>
<br>
<div>
Among the really complex sets are also the draft innovation sets (orange) and commander (yellow) sets. <br>
You can hover over the sets (dots) in the plot to see their details, as well as showing a regression line for the complexity of that set kind.
The regression line can also be enabled by hovering over the legend.
You can prevent a regression line from disappearing by clicking on its entry in the legend.
</div>

```js
import {complexity_by_kind} from './components/renderers-loader.js';
display(complexity_by_kind(complexity_data.kinds, complexity_data.by_kind));
```