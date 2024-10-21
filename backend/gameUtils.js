const { telepathPlayerData } = require("./telepath/telepathPlayerData");
const { thirtyOnePlayerData } = require("./thirty-one/thirtyOnePlayerData");
const telepathHelper = require("./telepath/telepathHelper");
const { Deck } = require("./cards/Deck");
const { getCurrentPlayers } = require("./thirty-one/thirtyOneHelper");
const { rpsMeleePlayerData } = require("./rps-melee/rpsMeleePlayerData");

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
    } else if (gameName === "rock_paper_scissors_melee") {
        const players = rooms[roomCode].players;

        if (players.length !== 2) { 
            console.log("Shouldn't be able to start");
            return; 
        }

        const playersData = {}

        playersData[players[0].userId] = rpsMeleePlayerData(players[0], players[1]); 
        playersData[players[1].userId] = rpsMeleePlayerData(players[1], players[0]);                   

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

            const currentPlayers = getCurrentPlayers(rooms[roomCode].playersData); 
            rooms[roomCode].gameData = {deck: deck, discardPile: discardPile, startTurn: 0, turn: 0, currentPlayers: currentPlayers, roundEnd: null, shouldShowResults: false, gameEnded: false};
        } else if (gameName === "rock_paper_scissors_melee") {
            const maxPoints = rooms[roomCode].gameData.maxPoints ?? 4;
            const roundDuration = rooms[roomCode].gameData.roundDuration ?? 600;

            rooms[roomCode].gameData = {roundInProgress: false, gameInProgress: false, maxPoints: maxPoints, restInterval: 200, roundDuration: roundDuration};            
        }
    }
}

module.exports = {
    setUpPlayerData,
    setUpGameData,
}