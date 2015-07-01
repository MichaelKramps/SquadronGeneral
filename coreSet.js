var genericCard = {
    id: 0, // (id) defines exactly what card it is
    c: 0, // (cost) taken from player's energy store
    t: [0, 0], // (type) [card type(0: ship, 1: factory, 2: command), race]
    a: [0, 0, 0], // (attack) [able to attack, attack power, attack type]
    d: [0, 0], // (defense) [current health, max health]
    s: [0, 0, 0] // (special ability) [ability listening(what game state triggers the ability), ability type, defend]
}

var coreSet1 = [
    // Mercenaries
    
    // Young Gun
    {
    id: 2,
    c: 3,
    t: [0, 0],
    a: [1, 2, 0], // Rush
    d: [3, 3],
    s: [0, 0, 0];
    },
    
    
]