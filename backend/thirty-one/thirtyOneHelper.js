const { Deck } = require("../cards/Deck");
const { thirtyOnePlayerData } = require("./thirtyOnePlayerData");


const calculateScore = (cards) => {
    const suitPoints = {"spades": 0, "hearts": 0, "clubs": 0, "diamonds": 0}
        
    let allSame = cards.length > 0 && cards[0].number; // false if no cards 
    for (const card of cards) {
        const suit = card.suit;
        const number = card.number;
        if (allSame !== number) { allSame = false; }
         
        if (number === 1) {
            suitPoints[suit] += 11;
        } else if (number >= 10) {
            suitPoints[suit] += 10;
        } else {
            suitPoints[suit] += number;
        }
    }

    const score = Math.max(...Object.values(suitPoints));
    return allSame ? 30.5 : score;
}

const thirtyOneSortCards = (cards) => {
    const suitPoints = {"spades": 0, "hearts": 0, "clubs": 0, "diamonds": 0}
        
    let allSame = cards.length > 0 && cards[0].number; // false if no cards 
    for (const card of cards) {
        const suit = card.suit;
        const number = card.number;
        if (allSame !== number) { allSame = false; }
         
        if (number === 1) {
            suitPoints[suit] += 11;
        } else if (number >= 10) {
            suitPoints[suit] += 10;
        } else {
            suitPoints[suit] += number;
        }
    }

    cards.sort((a, b) => {
        if (suitPoints[b.suit] !== suitPoints[a.suit]) {
          return suitPoints[b.suit] - suitPoints[a.suit];
        }

        if (a.number === 1) {
            return -100;
        } else if (b.number === 1) {
            return 100;
        }

        return b.number - a.number;
      });
}

const calculateScores = (playersData, currentPlayers) => {
    const players = [];
    for (const player of currentPlayers) {
        const playerUserId = player.nameData.userId;
        const playerData = playersData[playerUserId];
        const cards = playerData.cards;

        playerData.score = calculateScore(cards);
        thirtyOneSortCards(cards)
        players.push(playerData);
    }

    players.sort((a, b) => {
        if (a.score === b.score) {
            return a.lives - b.lives;
        }
        return a.score - b.score;
    });
    const playerCount = players.length;

    const knockOutScore = players[Math.floor(playerCount / 2) - 1].score;

    players.map((player, index) => {
        player.ranking = playerCount - index;
        if (player.score <= knockOutScore) {
            if (player.didKnock) {
                player.lives -= 2;
            } else {
                player.lives -= 1;
            }

            player.gotStrike = true;
        }
    })
}

const setUpNewRound = (rooms, roomCode) => {
    if (!rooms[roomCode]) { return; }

    const playersData = rooms[roomCode].playersData;
    const gameData = rooms[roomCode].gameData;

    for (const playerUserId of Object.keys(playersData)) {
        const playerData = playersData[playerUserId];
        playersData[playerUserId] = thirtyOnePlayerData(playerData.nameData, Math.max(0, playerData.lives), playerData.ranking)
    }

    const deck = new Deck();
    const discardPile = [];
    deck.shuffle();
    const playerDataArray = Object.values(rooms[roomCode].playersData)
    for (let i = 0; i < 3; i++) {
        for (const playerData of playerDataArray) {
            if (playerData.lives > 0) {
                playerData.cards.push(deck.drawCard());
            }
        }
    }
    discardPile.push(deck.drawCard());

    const oldPlayers = rooms[roomCode].gameData.currentPlayers;


    const currentPlayers = getCurrentPlayers(rooms[roomCode].playersData);
    const newTurn = getNextPlayerIndex(oldPlayers, currentPlayers, rooms[roomCode].gameData.startTurn);

    rooms[roomCode].gameData = {deck: deck, discardPile: discardPile, startTurn: newTurn, turn: newTurn, currentPlayers: currentPlayers, roundEnd: null, shouldShowResults: false, gameEnded: false}
}

const getCurrentPlayers = (playersData) => {
    return Object.values(playersData).filter(data => data.lives > 0).map((data) => {
        return {nameData: data.nameData, lives: data.lives};
    });
}

const getNextPlayerIndex = (oldPlayers, currentPlayers, index) => {
    const newIndex = (index + 1) % oldPlayers.length;
    while (newIndex !== index) {
        if (oldPlayers[newIndex].lives > 0) {
            return currentPlayers.findIndex(user => user.nameData.userId === oldPlayers[newIndex].nameData.userId);
        }

        newIndex = (newIndex + 1) % oldPlayers.length;
    }
    return -1;
}

module.exports = {
    calculateScore,
    calculateScores,
    setUpNewRound,
    getCurrentPlayers,
};