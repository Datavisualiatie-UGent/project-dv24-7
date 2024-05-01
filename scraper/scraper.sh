#!/usr/bin/env bash

if [[ "$1" = "-h" ]]; then
  echo "Usage: $0 [output directory (optional, defaults to ./out/)]"
  exit 0
fi

here_dir=$(dirname "$(realpath "$0")")

if [[ "$1" = "" ]]; then
  out_dir="$PWD/out/"
else
  out_dir="$1"
fi

echo "(Using '$out_dir' as output directory)"
mkdir -p "$out_dir"

export OUTDIR=$out_dir

echo "### Step 1: Scrape sets ###"
"$here_dir/scrape_sets.sh"

echo "### Step 2: Extract sets ###"
count=$(wc -l <"$out_dir/set_codes.txt")
curr=1

while read -r set; do
  echo "  --- Getting set $set ($curr/$count) --- "
  "$here_dir/get_set.sh" "$set"
  ((curr++))
done <"$out_dir/set_codes.txt"