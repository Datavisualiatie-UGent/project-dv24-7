#!/usr/bin/zsh

cat $1 | jq '[.[] | {(.set): { "code": .set, "name": .set_name, "release": .released_at, "type": .set_type }}] | add'
