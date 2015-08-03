var genericCard = {
    id: 0, // (id) defines exactly what card it is
    c: 0, // (cost) taken from player's energy store
    t: [0, 0], // (type) [card type(0: ship, 1: factory, 2: command), race]
    a: [0, 0, 0], // (attack) [able to attack, attack power, attack type]
    d: [0, 0], // (defense) [current health, max health]
    s: [0, 0, 0] // (special ability) [ability listening(what game state triggers the ability), ability type, defend]
}

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
            c: 1, // current health: 1
            m: 1, // max health: 1
            t: 0 // defense type: normal
        },
        s: [ // special info (array of special objects)
            {
            l: 5, // event listener: ship destroyed
            a: [3, [args]] // action: [actionID, [arguments]]
        }
        ]
    }
}