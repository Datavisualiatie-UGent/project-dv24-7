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
const evolution_data = FileAttachment('./data/cards_evolution.json').json();
const data_cards_info = FileAttachment('./data/cards_color_pricing_artists.json').json();
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
    <h2>Price most expensive card</h2>
    <span class="big">€ ${Math.max(...data_cards_info.card_info.prices.map(d => d.price))}</span>
  </div>
</div>

## Magic: The Gathering
```js
import {reprints} from './components/evolution-loader.js';
```

<div class="grid grid-cols-2" style="grid-auto-rows: 504px;">
  <p>Magic: The Gathering (MTG) is the most popular trading card game in the world. It has been captivating players since its inception in 1993 by mathematician Richard Garfield. The cards are printed and published by Wizards of the Coast. MTG combines strategic gameplay with rich lore, making it a beloved staple of both casual and competitive gaming communities. Despite the age of the game, MTG has great longevity and is still very popular to this day with new cards and sets being released frequently <br> <br>
  In MTG, players assume the role of powerful wizards known as Planeswalkers, using decks of spell cards representing magical spells, creatures, artifacts, lands, and even other planeswalkers to defeat their opponents. With thousands of unique cards and a dynamic, ever-evolving metagame, MTG offers endless opportunities for creativity, strategic thinking, and skillful play. <br> <br>
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
<br>
<h4> Further Reading: </h4>
<div class="grid grid-cols-4">
  <div class="card">
    <h3>Find out more about cards in Magic: The Gathering on <a href="cards">this page</a></h3>
  </div>
  <div class="card">
    <h3>Find out more about sets in Magic: The Gathering on <a href="sets">this page</a></h3>
  </div>
</div>


---

## Cards: A short introduction

<div>
In Magic: The Gathering, cards are the essential building blocks of the game. Each card contains a whole range of information. Each part of the card will be explained here.
</div>
<br>

<div class="imageflex">
  ${FileAttachment("w17-22-shivan-dragon.jpg").image({height: 500})}

  <div style="padding-left: 20px;">
  <h4> Card Name </h4>
  <p style="padding-left:10px;">The name of the card can be found at the top left of a card. Each different card has a unique name.</p>
  
  <h4> Mana Cost </h4>
  <p style="padding-left:10px;">The top right of the card contains the mana cost. During the game, you can play land in certain colors. The mana cost corresponds with how many of these land cards you need to play that specific card. If a color is present, this means that you need that specific color of land. If a number is present, in the example 4, this means that you can also need 4 additional lands, but they can be any color.</p>

  <h4> Card Color </h4>
  <p style="padding-left:10px;">A card's color is determined by its mana cost. You can either have no color (i.e. colorless), red, white, green, blue, black or multiple colors. A card with more than one color is called a multicolored card.</p>
</div>
<div>
  <h4> Card Type </h4>
  <p style="padding-left:10px;">The card type is located directly underneath the artwork on the card. The first word represents the class of card. The second word describes to which specific member of that class the card belongs.</p>
  
  <h4> Card Text </h4>
  <p style="padding-left:10px;">The card text is located underneath the card type and describes potential additional properties of a card and extra effects. A cards text often contains certain keywords. A card with more keywords is considered to be more complex, while less keywords refer to more simple cards.</p>

  <h4> Power and Toughness</h4>
  <p style="padding-left:10px;">A card's power and toughness are located in the bottom right corner. Power is found on the left while toughness is on the right. These values essentially represent the cards attack and defense.</p>
  </div>
</div>

<br>
<h4> Further Reading: </h4>
<div class="grid grid-cols-3">
  <div class="card">
    <h3>Find out more about cards in Magic: The Gathering on our <a href="cards">card analysis page</a>.</h3>
  </div>
  <div class="card">
    <h3>Find out more about sets in Magic: The Gathering on our <a href="sets">page about Magic sets</a>.</h3>
  </div>
  <div class="card">
    <h3>Find out more about complexity in Magic: The Gathering on our <a href="complexity">page about complexity</a>.</h3>
  </div>
  <div class="card">
    <h3>Find out more about color in Magic: The Gathering on the <a href="color">color page</a>.</h3>
  </div>
  <div class="card">
    <h3>Find out more about how power, toughness and mana cost relate to each other on <a href="power_toughness_mana">this page</a>.</h3>
  </div>
</div>

---

## Dataset - Scryfall

<div>
<a href=https://scryfall.com>Scryfall.com</a> serves as a search engine for Macic: The Gathering cards. You can look up cards and find info about them. Additionally, they provide their dataset freely through a download or through a <a href=https://scryfall.com/docs/api>REST API</a>. We used the Scryfall dataset for this project. Each day, the dataset is updated and updated locally through scryfall's API to keep everything up to date with the newest releases.
</div>

---

## Frameworks
<div>
This site is made using <a href=https://observablehq.com/framework>Observable Framework</a>.
</div>
<div>
For most of the plots and visualisations we used <a href=https://observablehq.com/plot>Observable Plot</a>. For the remaining visualisations we used <a href=https://d3js.org>D3.js</a>. D3 was mostly used in cases where Observable Plot was not possible.
</div>
