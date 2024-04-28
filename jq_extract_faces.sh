#!/usr/bin/zsh

query='
def mapcolor(c): if c == "G" then 1 elif c == "R" then 2 elif c == "B" then 4 elif c == "U" then 8 elif c == "W" then 16 end;
def mergecolors(a): if a == null then null elif a|length == 0 then 0 else a | map(mapcolor(.)) | add end;
def extract_face(id; f): {"card_id": id, "name": f.name, "mana_cost": f.mana_cost, "cmc": f.cmc, "colors": mergecolors(f.colors), "defense":f.defense, "loyalty":f.loyalty, "oracle_text":f.oracle_text, "power":f.power, "toughness":f.toughness, "type_line":f.type_line};
[.[] | select(.card_faces|length!=0) | .id as $card_id | [.card_faces[] | extract_face($card_id; .)]] | add
'

cat $1 | jq $query
