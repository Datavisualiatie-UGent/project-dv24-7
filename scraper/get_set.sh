#!/usr/bin/env bash

here_dir=$(dirname "$(realpath "$0")")

echo " -> Downloading set $1 from API (saving output in $OUTDIR)..."
echo "   -> Downloading initial page..."
"$here_dir/throttle.sh"
curl "https://api.scryfall.com/cards/search?q=e:$1" >".tmp.json" 2>/dev/null

more_pgs=$(tr ',' '\n' <".tmp.json" | grep "has_more" | cut -d':' -f2)
echo "   -> Has more than one page? '$more_pgs'"
jq '[.data]' <".tmp.json" >".tmp.json.1"

while [[ "$more_pgs" = "true" ]]; do
  url=$(tr ',' '\n' <".tmp.json" | grep "next_page" | cut -d'"' -f4)
  echo "   -> Downloading next page..."
  "$here_dir/throttle.sh"
  curl "$url" >".tmp.json" 2>/dev/null

  more_pgs=$(tr ',' '\n' <".tmp.json" | grep "has_more" | cut -d':' -f2)
  echo "," >>"$OUTDIR/$1.json"
  jq '.data' <".tmp.json" >".tmp.json.2"
  jq -s 'add' ".tmp.json.1" ".tmp.json.2" >".tmp.json.3"
  mv ".tmp.json.3" ".tmp.json.1"
done

mv ".tmp.json.1" "$OUTDIR/$1.json"
rm -f ".tmp.json" ".tmp.json.1" ".tmp.json.2" ".tmp.json.3"
