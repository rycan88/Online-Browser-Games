const { telepathPlayerData } = require("./telepath/telepathPlayerData");
const { thirtyOnePlayerData } = require("./thirty-one/thirtyOnePlayerData");
const telepathHelper = require("./telepath/telepathHelper");
const { Deck } = require("./cards/Deck");

const setUpPlayerData = (rooms, roomCode) => {
    const gameName = rooms[roomCode].gameName;
    if (gameName === "telepath") {
        const teamData = rooms[roomCode].teamData;
        const teamMode = rooms[roomCode].teamMode;
        const players = rooms[roomCode].players;

        if ((teamData.length * 2 !== players.length && teamMode) || (players.length < 2 && !teamMode)) { 
            console.log("Shouldn't be able to start");
            return; 
        }

        const playersData = {}
        if (teamMode) {
            teamData.forEach((team) => {
                playersData[team[0].userId] = telepathPlayerData(team[0], team[1], 0);
                playersData[team[1].userId] = telepathPlayerData(team[1], team[0], 0);
            });
        } else {
            players.forEach((player) => {
                playersData[player.userId] = telepathPlayerData(player, player, 0);                   
            })
        }
        rooms[roomCode].playersData = playersData;  

    } else if (gameName === "thirty_one") {
        const players = rooms[roomCode].players;

        if (players.length < 2) { 
            console.log("Shouldn't be able to start");
            return; 
        }

        const playersData = {}

        players.forEach((player) => {
            playersData[player.userId] = thirtyOnePlayerData(player);                   
        })
        
        rooms[roomCode].playersData = playersData;         
    }
}

const setUpGameData = (rooms, roomCode) => {
    if (rooms[roomCode]) {
        const gameName = rooms[roomCode].gameName;
        const gameData = rooms[roomCode].gameData
        if (gameName === "telepath") {
            telepathHelper.setNewPrompt(gameData);
        } else if (gameName === "thirty_one") {
            const deck = new Deck();
            const discardPile = [];
            deck.shuffle();
            const playerDataArray = Object.values(rooms[roomCode].playersData)
            for (let i = 0; i < 3; i++) {
                for (const playerData of playerDataArray) {
                    playerData.cards.push(deck.drawCard());
                }
            }
            discardPile.push(deck.drawCard());
            gameData.deck = deck;
            gameData.discardPile = discardPile;
        }
    }
}

module.exports = {
    setUpPlayerData,
    setUpGameData,
}