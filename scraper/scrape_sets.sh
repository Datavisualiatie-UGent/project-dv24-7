#!/usr/bin/env bash

echo " -> Downloading sets from API (saving output in $OUTDIR)..."
curl "https://api.scryfall.com/sets/" >"$OUTDIR/sets.json" 2>/dev/null
echo "   -> Done; curl exit code: $?"

echo " -> Extracting set codes..."
sed 's/"code":/\n/g' "$OUTDIR/sets.json" | cut -d'"' -f2 >"$OUTDIR/set_codes.txt"
echo "   -> Done; pipeline exit code: $?"
echo "   -> Have $(wc -l <"$OUTDIR/set_codes.txt") sets"