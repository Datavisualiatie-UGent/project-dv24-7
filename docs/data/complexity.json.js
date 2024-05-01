import {load_base_data} from "./base-loader.js";

const {filtered,kinds,cards} = await load_base_data();

const complexity_by_kind = {};
kinds.forEach(kind => complexity_by_kind[kind] = []);

const complexity_raw = filtered.map(set => {
    const c = cards[set.code].flat().map(card => {
        if(card.card_faces != null) {
            let text_len = 0;
            card.card_faces.forEach(face => text_len += face.oracle_text.split(' ').length);
            return {...card, oracle_text: text_len};
        }
        else if(card.oracle_text == null) {
            return {...card, oracle_text: 0};
        }
        return {...card, oracle_text: card.oracle_text.split(' ').length};
    });

    const avg = c.reduce((acc, card) => acc + card.oracle_text, 0) / c.length;

    complexity_by_kind[set.set_type].push({
        name: set.name,
        code: set.code,
        release: set.release,
        avg: avg,
        type: set.set_type
    });

    return {
        name: set.name,
        code: set.code,
        release: set.release,
        avg: avg
    }
});

process.stdout.write(JSON.stringify({
    raw: complexity_raw,
    by_kind: complexity_by_kind,
    kinds: kinds
}));