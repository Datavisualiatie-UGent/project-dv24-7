---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 0;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1.25;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 50px;
  }
}

.plot-title{
  font-size: x-large;
}

</style>

<div class="hero">
  <h1>Magic: The Gathering Visualised</h1>
  <h2>Welcome to your new project! Edit <code style="font-size: 90%;">docs/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started" target="_blank">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

```js
const cards_data = await FileAttachment("./data/mtg.json").json();
const evolution_data = await FileAttachment('./data/cards_evolution.json').json();
import {pie_chart_color_distribution} from "./data/mtg-graphs.js";
import {color_per_year_area} from './components/evolution-loader.js';
```

<div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <div class="card">
    <h1 class="plot-title">Color distribution over time</h1>
    <div style="height: 95%">
      ${ resize((width, height) => {
        const color_distribution = cards_data.data.cards.color_distribution;
        return pie_chart_color_distribution(color_distribution, width, height);})
      }
    </div>
  </div>
  <div class="card">
    <h1 class="plot-title">Color distribution over time</h1>
    <div>
      ${ resize((width) => {
        return color_per_year_area(evolution_data.color_dist, width);})
      }
    </div>
  </div>
</div>

## Magic: The Gathering

Text

---

## Cards: A short introduction

```js
FileAttachment("w17-22-shivan-dragon.jpg").image({height: 400})
```

---

## Dataset: Scryfall

We used [Scryfall.com](https://scryfall.com/) for our data.

---

## Frameworks

This site is made using [Observable Framework](https://observablehq.com/framework/).

For the plots we used both [Observable Plot](https://observablehq.com/plot/) and [D3](https://d3js.org/).