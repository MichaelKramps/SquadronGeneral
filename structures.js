// Game State Structure

var gameState = {
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
    r1 = 5 // race id will determine mothership's ability (activates at "start of turn")
    r2 = 3 // race id will determine mothership's ability (activates at "start of turn")
    b1 = [{id: 1, t: 3, a: [0, 0], d: [0, 0], s: [0, 0, 0]}, ...]// player 1's board (battlefield) state, each card is an object with id, type, attack, defense and ability
    b2 = [{id: 1, t: 3, a: [0, 0], d: [0, 0], s: [0, 0, 0]}, ...]// player 2's board (battlefield) state
}

// Deck Structure

var deck = [0, 1, 2, 23, 142, 142, 14] // completely defined by an array of card id's
var hand = [142, 2, 14, 0] // again defined by card id's
var graveyard = [1, 23, 142] // again defined by card id's

// Card Structure

var genericCard = {
    id: 0, // (id) defines exactly what card it is
    c: 0, // (cost) taken from player's energy store
    t: 0, // (type) 0: ship, 1: factory, 2: command, 3: attachment
    a: [0, 0], // (attack) [attack power, attack type]
    d: [0, 0], // (defense) [current health, max health]
    s: [0, 0, 0] // (special ability) [ability listening(what game state triggers the ability), ability type, ability power]
}