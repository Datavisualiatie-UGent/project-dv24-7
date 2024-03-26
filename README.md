# project-dv24-7

## Installation
Run `npm install` in the `site/` folder.
Don't forget to generate the data...

## Running
Run `npm run dev` in the `site/` folder.

## Generating data
Requirements: `jq`, `curl`.
Run this script from the repository root!

```sh
curl https://data.scryfall.io/all-cards/all-cards-20240326091741.json >./scryfall.json
./jq_extract_sets.sh scryfall.json >site/docs/data/sets.json
./jq_extract_cards.sh scryfall.json >site/docs/data/cards.json
./jq_extract_faces.sh scryfall.json >site/docs/data/faces.json
./jq_extract_keywords.sh scryfall.json >site/docs/data/keywords.json
```
