
module.exports = {
    "1": {
        c: 1,
        i: { // general info
            t: 0, // type: ship
            s: 0, // section: mercenaries
            r: 0, // race: none
            y: 1 // rarity: uncommon
        },
        a: { // attack info 
            s: 0, // attack state: can't attack
            p: 1, // attack power: 1
            t: 0 // attack type: normal
        },
        d: { // defense info
            c: 2, // current health: 1
            m: 2, // max health: 1
            t: 0 // defense type: normal
        },
        s: 8, // speed value between 1 and 10
        e: [ // event info (array of special objects)
            {
            l: 5, // event listener: ship destroyed
            a: [0, []] // action: [actionID, [arguments]]
        }
        ]
    },
    "2": {
        c: 1,
        i: {t: 0, s: 0, r: 0, y: 1},
        a: {s: 0, p: 1, t: 0},
        d: {c: 3, m: 3, t: 0},
        s: 5,
        e: [{l: 0, a: [0, []]}]
    },
    "3": {
        c: 1,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 1, t: 2},
        d: {c: 1, m: 1, t: 0},
        s: 2,
        e: [{l: 0, a: [0, []]}]
    },
    "4": {
        c: 1,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 1, t: 0},
        d: {c: 4, m: 4, t: 0},
        s: 1,
        e: [{l: 0, a: [0, []]}]
    },
    "5": {
        c: 1,
        i: {t: 0, s: 0, r: 1, y: 0},
        a: {s: 0, p: 2, t: 1},
        d: {c: 2, m: 2, t: 0},
        s: 3,
        e: [{l: 0, a: [0, []]}]
    },
    "6": {
        c: 1,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 1, t: 0},
        d: {c: 1, m: 1, t: 0},
        s: 10,
        e: [{l: 0, a: [0, []]}]
    },
    "7": {
        c: 2,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 3, t: 0},
        d: {c: 5, m: 5, t: 0},
        s: 6,
        e: [{l: 0, a: [0, []]}]
    },
    "8": {
        c: 2,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 2, t: 0},
        d: {c: 7, m: 7, t: 0},
        s: 3,
        e: [{l: 0, a: [0, []]}]
    },
    "9": {
        c: 2,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 4, t: 1},
        d: {c: 5, m: 5, t: 0},
        s: 4,
        e: [{l: 0, a: [0, []]}]
    },
    "10": {
        c: 3,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 4, t: 0},
        d: {c: 8, m: 8, t: 0},
        s: 3,
        e: [{l: 0, a: [0, []]}]
    },
    "11": {
        c: 3,
        i: {t: 0, s: 0, r: 0, y: 0},
        a: {s: 0, p: 6, t: 0},
        d: {c: 5, m: 5, t: 0},
        s: 6,
        e: [{l: 0, a: [0, []]}]
    },
    "12": {
        c: 4,
        i: {t: 0, s: 0, r: 1, y: 0},
        a: {s: 0, p: 7, t: 0},
        d: {c: 8, m: 8, t: 0},
        s: 6,
        e: [{l: 0, a: [0, []]}]
    },
    "13": { // first spell card
        c: 1, // cost
        i: { // general info
            t: 1, // type: command
            s: 0, // section: mercenaries
            r: 0, // race: none
            y: 0 // rarity: common
            },
        l: 1, // listener (0: global, 1: target, 2: random)
        r: 0, // reinforce: off
        e: [{k: "ap", u: 2}] // events when target is chosen {key: [array map to card property], upgrade: how to change that property}
    },
    "14": {
        c: 1,
        i: {t: 1, s: 0, r: 0, y: 0},
        l: 0,
        r: 0,
        e: [{k: "ap", u: 2}]
    },
    "15": {
        c: 2,
        i: {t: 1, s: 0, r: 0, y: 1},
        l: 1,
        r: 0,
        e: [{k: "ap", u: 4}, {k: "dc", u: 4}, {k: "dm", u: 4}]
    },
    "16": {
        c: 2,
        i: {t: 1, s: 0, r: 0, y: 1},
        l: 1,
        r: 1, // reinforce: on
        e: [{k: "ap", u: 1}, {k: "dc", u: 1}, {k: "dm", u: 1}]
    }
}