const { setUpPlayerData, setUpGameData } = require("../gameUtils");
const { calculateScores, setUpNewRound, calculateScore, getCurrentPlayers } = require("./thirtyOneHelper");

const thirtyOneEvents = (io, socket, rooms) => {    
    socket.on("get_all_thirty_one_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
            socket.emit('receive_turn', rooms[roomCode].gameData.turn);
            socket.emit('receive_players', rooms[roomCode].gameData.currentPlayers);
            socket.emit('receive_should_show_results', rooms[roomCode].gameData.shouldShowResults);
            rooms[roomCode].gameData.shouldShowResults && socket.emit('receive_players_data', rooms[roomCode].playersData);

            if (rooms[roomCode].gameData.roundEnd) {
                socket.emit('receive_knock_player', rooms[roomCode].gameData.roundEnd % rooms[roomCode].gameData.currentPlayers.length);
            } else {
                socket.emit('receive_knock_player', null);               
            }
            socket.emit('receive_deck_count', rooms[roomCode].gameData.deck.getCount());
            socket.emit('receive_start_turn', rooms[roomCode].gameData.startTurn);
            rooms[roomCode].playersData[socket.userId] && !rooms[roomCode].gameData.shouldShowResults && socket.emit('receive_own_cards', rooms[roomCode].playersData[socket.userId].cards);

        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });

    socket.on("thirty_one_get_discard_pile", (roomCode, cardId) => {
        if (rooms[roomCode]) {
            socket.emit('receive_discard_pile', rooms[roomCode].gameData.discardPile, cardId);
        }
    });

    socket.on("thirty_one_get_own_cards", (roomCode, cardId) => {
        if (rooms[roomCode]) {
            if (rooms[roomCode].playersData[socket.userId] && !rooms[roomCode].gameData.shouldShowResults) {
                socket.emit('receive_own_cards', rooms[roomCode].playersData[socket.userId].cards, cardId);
            }   
        }
    });

    socket.on("thirty_one_get_deck_count", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_deck_count', rooms[roomCode].gameData.deck.getCount());
        }
    });

    socket.on("thirty_one_get_turn", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_turn', rooms[roomCode].gameData.turn);
        }
    });

    // Pick up from deck
    socket.on("thirty_one_pick_up_deck_card", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        const deck = rooms[roomCode].gameData.deck;
        const currentPlayers = rooms[roomCode].gameData.currentPlayers;
        const playerTurn = rooms[roomCode].gameData.turn % currentPlayers.length;
        if (deck.getCount() === 0 ||  rooms[roomCode].playersData[socket.userId].cards.length > 3 || playerTurn % 1 !== 0 || 
            currentPlayers[playerTurn].nameData.userId !== socket.userId) { return; }
        rooms[roomCode].gameData.turn += 0.5;
        const newCard = deck.drawCard();
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        io.to(roomCode).emit('deck_pick_up', socket.id, currentPlayers, rooms[roomCode].gameData.turn);
    })

    // Pick up from discard pile
    socket.on("thirty_one_pick_up_discard_card", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        const discardPile = rooms[roomCode].gameData.discardPile;

        const currentPlayers = rooms[roomCode].gameData.currentPlayers;
        const playerTurn = rooms[roomCode].gameData.turn % currentPlayers.length;
        if (discardPile.length === 0 || playerTurn % 1 !== 0 || currentPlayers[playerTurn].nameData.userId !== socket.userId) { return; }

        rooms[roomCode].gameData.turn += 0.5;
        const newCard = discardPile.pop();
  
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        //socket.emit('receive_picked_card', newCard);
        io.to(roomCode).emit('discard_pile_pick_up', newCard);
    })

    socket.on("thirty_one_discard_card", (roomCode, discardedCard) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 === 0) { return; }

        const currentPlayers = rooms[roomCode].gameData.currentPlayers;
        const playerTurn = rooms[roomCode].gameData.turn % currentPlayers.length;
        if (currentPlayers[playerTurn - 0.5].nameData.userId !== socket.userId) {return; }

        const discardPile = rooms[roomCode].gameData.discardPile;
        discardPile.push(discardedCard);
        const myCards = rooms[roomCode].playersData[socket.userId].cards;
        rooms[roomCode].playersData[socket.userId].cards = myCards.filter((card) => card.id !== discardedCard.id);

        rooms[roomCode].gameData.turn += 0.5;

 
        socket.to(roomCode).emit('card_discarded', discardedCard, socket.id);

        const myScore = calculateScore(rooms[roomCode].playersData[socket.userId].cards);

        if (rooms[roomCode].gameData.turn === rooms[roomCode].gameData.roundEnd || myScore === 31 || rooms[roomCode].gameData.deck.getCount() === 0) { // Round ended
            const playerCount = rooms[roomCode].gameData.currentPlayers.length;
            calculateScores(rooms[roomCode].playersData, rooms[roomCode].gameData.currentPlayers);
            const alivePlayers = getCurrentPlayers(rooms[roomCode].playersData);
            if (alivePlayers.length <= 1) { // Only one player left so game has ended
                rooms[roomCode].gameData.gameEnded = true;
            }
            rooms[roomCode].gameData.shouldShowResults = true;
            io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
            io.to(roomCode).emit('receive_should_show_results', rooms[roomCode].gameData.shouldShowResults);

        }
    })

    socket.on("thirty_one_knock", (roomCode) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 !== 0) { return; }

        const currentPlayers = rooms[roomCode].gameData.currentPlayers;
        const playerTurn = rooms[roomCode].gameData.turn % currentPlayers.length;
        if (currentPlayers[playerTurn].nameData.userId !== socket.userId) {return; }

        const playerCount = rooms[roomCode].gameData.currentPlayers.length;
        rooms[roomCode].gameData.roundEnd = rooms[roomCode].gameData.turn + playerCount;
        rooms[roomCode].gameData.turn += 1;
        rooms[roomCode].playersData[socket.userId].didKnock = true;
        io.to(roomCode).emit('receive_turn', rooms[roomCode].gameData.turn);
        io.to(roomCode).emit('receive_knock_player', rooms[roomCode].gameData.roundEnd % playerCount);
        socket.to(roomCode).emit('player_knocked', socket.nickname);

    });

    socket.on("thirty_one_ready", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        const playersData = rooms[roomCode].playersData;
        playersData[socket.userId].isReady = true;
        io.to(roomCode).emit('receive_players_data', playersData);

        if (rooms[roomCode].gameData.gameEnded) {
            if (!Object.values(playersData).find((data) => data.isReady === false)) {
                setUpPlayerData(rooms, roomCode);
                setUpGameData(rooms, roomCode);
                io.to(roomCode).emit('start_new_round');
            }
        } else {
            if (!Object.values(playersData).find((data) => data.lives > 0 && data.isReady === false)) {
                setUpNewRound(rooms, roomCode);
                io.to(roomCode).emit('start_new_round');
            }
        }
    });
}

module.exports = {
    thirtyOneEvents,
}
