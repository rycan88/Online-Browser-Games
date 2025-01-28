const { telepathPlayerData } = require("./telepath/telepathPlayerData");
const { thirtyOnePlayerData } = require("./thirty-one/thirtyOnePlayerData");
const telepathHelper = require("./telepath/telepathHelper");
const { StandardDeck } = require("./cards/StandardDeck");
const { getCurrentPlayers } = require("./thirty-one/thirtyOneHelper");
const { rpsMeleePlayerData } = require("./rps-melee/rpsMeleePlayerData");
const { HanabiDeck } = require("./cards/HanabiDeck");
const { hanabiPlayerData } = require("./hanabi/hanabiPlayerData");

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
    } else if (gameName === "hana") {
        const players = rooms[roomCode].players;

        if (players.length < 2 || players.length > 5) { 
            console.log("Shouldn't be able to start");
            return; 
        }

        const playersData = {}

        players.forEach((player) => {
            playersData[player.userId] = hanabiPlayerData(player);                   
        })                   

        rooms[roomCode].playersData = playersData;   
    }
}

const setUpGameData = (io, rooms, roomCode) => {
    if (rooms[roomCode]) {
        const gameName = rooms[roomCode].gameName;
        const gameData = rooms[roomCode].gameData;
        if (gameName === "telepath") {
            telepathHelper.setNewPrompt(gameData);
            telepathHelper.startRound(io, rooms, roomCode);
        } else if (gameName === "thirty_one") {
            const deck = new StandardDeck();
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
            const maxPoints = rooms[roomCode].gameData.maxPoints;
            const roundDuration = rooms[roomCode].gameData.roundDuration;
            const withGun = rooms[roomCode].gameData.withGun;

            rooms[roomCode].gameData = {roundInProgress: false, gameInProgress: false, maxPoints: maxPoints, restInterval: 200, roundDuration: roundDuration, withGun: withGun, turn: 0};            
        } else if (gameName === "hana") {
            const deck = new HanabiDeck();
            const discardPile = [];
            deck.shuffle()

            const playerDataArray = Object.values(rooms[roomCode].playersData);
            const playerCount = playerDataArray.length;
            const cardsPerPlayer = playerCount <= 3 ? 5 : 4;
            let index = 0
            for (const playerData of playerDataArray) {
                playerData.index = index;
                index++
                for (let i = 0; i < cardsPerPlayer; i++) {
                    playerData.cards.push(deck.drawCard());
                }
            }
            const playPile = {"red": 0, "yellow": 0, "green": 0, "blue": 0, "purple": 0}
            const startingTurn = Math.floor(Math.random() * playerDataArray.length);
            const history = [{"type": "start", "player": playerDataArray[startingTurn].nameData.userId}];
 
            rooms[roomCode].gameData = {deck: deck, discardPile: discardPile, playPile: playPile, tokenCount: 8, turn: startingTurn, lives: 3, playerDataArray: playerDataArray, history: history};
        }
    }
}

module.exports = {
    setUpPlayerData,
    setUpGameData,
}