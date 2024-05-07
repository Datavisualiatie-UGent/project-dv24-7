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

.imageflex { display: flex; }
.imageflexcontent { margin-left: 5px; margin-top: 0; }

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
  <h1>Magic: The Gathering</h1>
  <h2> The world of the most popular collectable card game visualised </h2>
</div>


```js
const cards_data = await FileAttachment("./data/mtg.json").json();
const evolution_data = await FileAttachment('./data/cards_evolution.json').json();
const data_cards_info = await FileAttachment('./data/cards_color_pricing_artists.json').json();
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Number of cards released</h2>
    <span class="big">${data_cards_info.card_info.artist.length}</span>
  </div>
  <div class="card">
    <h2>Number of sets released</h2>
    <span class="big">${evolution_data.set_type_dist.length}</span>
  </div>
  <div class="card">
    <h2>Number of artists</h2>
    <span class="big">${(new Set(data_cards_info.card_info.artist.map(card => card.artist))).size}</span>
  </div>
  <div class="card">
    <h2>Price most expensive card:</h2>
    <span class="big">€ ${Math.max(...data_cards_info.card_info.prices.map(d => d.price))}</span>
  </div>
</div>

## Magic: The Gathering
```js
import {reprints} from './components/evolution-loader.js';
```

<div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <p>Magic: the gathering (MTG) is the most popular trading card game in the world. It has been captivation players since its inception in 1993 by mathematician Richard Garfield. The cards are printed and published by Wizards of the Coast. MTG combines strategic gameplay with rich lore, making it a beloved staple of both casual and competitive gaming communities. Despite the age of the game, MTG has great longevity and is still very popular to this day with new cards and sets being released frequently <br> <br>
  In MTG, players assume the role of powerful wizards known as Planeswalkers, using decks of spell cards representing magical spells, creatures, artifacts, and lands to defeat their opponents. With thousands of unique cards and a dynamic, ever-evolving metagame, MTG offers endless opportunities for creativity, strategic thinking, and skillful play. <br> <br>
  As an addition to the physical card game, Magic: The Gathering also provides a free online mode in 
<a href="https://magic.wizards.com/en/mtgarena">MTG Arena</a>. This serves as an easy and accessible playstyle for new players to learn how to play the game. It boasts a comprehensive tutorial and uses the same rules, cards and sets as the TCG.
  </p>
  <div class="card">
    <h1 class="plot-title">Cards released per year</h1>
    A bar plot showing how many new cards and how many reprinted cards were released each year
    <div>
      ${resize((width) => {
        return reprints(evolution_data.reprint_dist);})
      }
    </div>
  </div>
</div>

<br>
<h4> Further Reading: </h4>
<div class="grid grid-cols-4">
  <div class="card">
    <h3>Find out more about cards in Magic: The Gathering on <a href="cards-loader">this page</a></h3>
  </div>
  <div class="card">
    <h3>Find out more about sets in Magic: The Gathering on <a href="sets">this page</a></h3>
  </div>
</div>

---

## Cards: A short introduction



<div class="imageflex">
  ${FileAttachment("w17-22-shivan-dragon.jpg").image({height: 350})}

  <p class="imageflexcontent">In magic the gathering, cards are </p>
</div>

#### Card Name

#### Mana Cost

#### Card Type

#### Card Text

#### Flavor Text

#### Card Name
  

<!-- <div class="container">
  <div class="image">
    ${FileAttachment("w17-22-shivan-dragon.jpg").image({height: 400})}
  </div>
  <div class="text">
    <h1>This is a beautiful picture.</h1>
  </div>
</div> -->


```js
FileAttachment("color.jpg").image({height: 40})
```

---

## Dataset: Scryfall

We used [Scryfall.com](https://scryfall.com/) for our data.

---

## Frameworks

This site is made using [Observable Framework](https://observablehq.com/framework/).

For the plots we used both [Observable Plot](https://observablehq.com/plot/) and [D3](https://d3js.org/).