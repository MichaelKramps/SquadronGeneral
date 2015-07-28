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
        t: [0, 0], // [ship, mercenary]
        a: [0, 1, 0], // [not able to attack, attack power 3, attack type normal]
        d: [1, 1], // [current health 3, max health 3]
        s: [8, 1, 0] // [listens for destruction, gives health, no defend]
    }
}