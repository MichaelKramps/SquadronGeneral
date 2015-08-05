// Game State Structure

var gameState = {
    _id = 12345, // game id number
    pl = 2, // number of players who have joined the game
    p = 1, // which player has priority
    t = 1, // which player's turn it is
    ph = 0, // what game phase (0: start turn, 1: draw card, 2: main phase, 3: end of turn)
    i1 = 20, // Integrity of player 1's mother ship
    i2 = 20, // Integrity of player 2's mother ship
    s1 = 20, // Shield on player 1's mother ship
    s2 = 20, // Shield on player 2's mother ship
    e1 = 5, // player 1's energy
    e2 = 5, // player 2's energy
    d1 = [23, 15, 15, 34], // cards in p1's deck
    d2 = [22, 45, 1, 12], // cards in p2's deck
    h1 = [{id: 23, c: 3}, {id: 15, c: 5}, {id: 243, c: 8}], // cards in p1's hand
    h2 = [{id: 111, c: 1}, {id: 43, c: 12}], // cards in p2's hand
    g1 = [56, 44, 45], // cards in p1's graveyard
    g2 = [73, 34, 12, 11], // cards in p2's graveyard
    r1 = 5, // race id will determine mothership's ability (activates at "start of turn")
    r2 = 3, // race id will determine mothership's ability (activates at "start of turn")
    b1 = [{id: 1, t: 3, a: [0, 0], d: [0, 0], s: [0, 0, 0]}, ...],// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
    b2 = [{id: 1, t: 3, a: [0, 0], d: [0, 0], s: [0, 0, 0]}, ...]// player 2's board (battlefield) state
}

// Deck Structure

var deck = [0, 1, 2, 23, 142, 142, 14] // completely defined by an array of card id's
var hand = [142, 2, 14, 0] // again defined by card id's
var graveyard = [1, 23, 142] // again defined by card id's

// Card Structure

var genericCard = {
    "1": { // id number
        c: 1,
        i: { // general info
            t: 0, // type: (0 ship), (1 command), (2 factory)
            s: 0, // section: (0 mercenaries), (1 earthlings), (2 Martians), (3 shapeshifters), (4 robots), (5 smugglers), (6 parasites), (7 brutes), (8 republic)
            r: 0, // race: (0 none), (1 rebel), (2 human), (3 martian), (4 robot), (5 parasite)
            y: 1 // rarity: (0 common), (1 uncommon), (2 rare), (3 legendary)
        },
        a: { // attack info 
            s: 1, // attack state: (0 can attack), (1 can't attack), (2 disabled)
            p: 1, // attack power: 1
            t: 0 // attack types: [array of numbers] - (0 normal), (1 first strike)
        },
        d: { // defense info
            c: 1, // current health: 1
            m: 1, // max health: 1
            t: 0 // defense types: [array of numbers] - (0 normal), (1 defend), (2 cloaking)
        },
        s: [ // special info (array of special objects)
            {
            l: 5, // event listener: (0 no listener), (1 Start of Turn), (2 End of Turn), (3 card drawn), (4 card played), (5 ship destroyed), (6 ship attacks), (7 damage dealt)
            a: [0, []] // action: [actionID, [arguments]]
        }
        ]
    }
}