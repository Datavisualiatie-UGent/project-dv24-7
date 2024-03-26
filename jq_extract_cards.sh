#!/usr/bin/zsh

query='
def mapcolor(c): if c == "G" then 1 elif c == "R" then 2 elif c == "B" then 4 elif c == "U" then 8 elif c == "W" then 16 end;
def mergecolors(a): if a|length == 0 then 0 else a | map(mapcolor(.)) | add end;
[.[] | {"id": .id,"name":.name,"set_id":.set,"colors":mergecolors(.colors),"color_identity":mergecolors(.color_identity), "layout":.layout,"cmc":.cmc,"defense":.defense,"loyalty":.loyalty,"mana_cost":.mana_cost,"oracle_text":.oracle_text,"power":.power,"toughness":.toughness,"type_line":.type_line}]
'

cat $1 | jq $query
