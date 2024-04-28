#!/usr/bin/zsh

cat $1 | jq '[[.[].keywords | select(.|length!=0) ] | add | map({(.):.}) | add | keys_unsorted | .[] | {"id":.}]'
