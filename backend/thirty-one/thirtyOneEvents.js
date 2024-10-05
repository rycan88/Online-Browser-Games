const { calculateScores, setUpNewRound, calculateScore } = require("./thirtyOneHelper");

const thirtyOneEvents = (io, socket, rooms) => {    
    socket.on("get_all_thirty_one_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
            socket.emit('receive_turn', rooms[roomCode].gameData.turn);
            socket.emit('receive_players', rooms[roomCode].gameData.currentPlayers);
            socket.emit('receive_should_show_results', rooms[roomCode].gameData.shouldShowResults);


            if (rooms[roomCode].gameData.roundEnd) {
                socket.emit('receive_knock_player', rooms[roomCode].gameData.roundEnd % rooms[roomCode].gameData.currentPlayers.length);
            } else {
                socket.emit('receive_knock_player', null);               
            }
            rooms[roomCode].playersData[socket.userId] && socket.emit('receive_own_cards', rooms[roomCode].playersData[socket.userId].cards);
            socket.emit('receive_deck_count', rooms[roomCode].gameData.deck.getCount());
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });

    socket.on("thirty_one_get_discard_pile", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
        }
    });

    socket.on("thirty_one_get_own_cards", (roomCode) => {
        if (rooms[roomCode]) {
            rooms[roomCode].playersData[socket.userId] && socket.emit('receive_own_cards', rooms[roomCode].playersData[socket.userId].cards);
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
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 !== 0) { console.log(rooms[roomCode].gameData); return; }
        
        const deck = rooms[roomCode].gameData.deck;
        if (deck.getCount() === 0 ||  rooms[roomCode].playersData[socket.userId].cards.length > 3) { return; }
        rooms[roomCode].gameData.turn += 0.5;
        const newCard = deck.drawCard();
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        io.to(roomCode).emit('deck_pick_up', socket.id, rooms[roomCode].gameData.currentPlayers, rooms[roomCode].gameData.turn);
    })

    // Pick up from discard pile
    socket.on("thirty_one_pick_up_discard_card", (roomCode) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 !== 0) { return; }
        const discardPile = rooms[roomCode].gameData.discardPile;
        if (discardPile.length === 0 ||  rooms[roomCode].playersData[socket.userId].cards.length > 3) { return; }
        rooms[roomCode].gameData.turn += 0.5;
        const newCard = discardPile.pop();
  
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        //socket.emit('receive_picked_card', newCard);
        io.to(roomCode).emit('discard_pile_pick_up', newCard);
    })

    socket.on("thirty_one_discard_card", (roomCode, discardedCard) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 === 0) { return; }

        const discardPile = rooms[roomCode].gameData.discardPile;
        discardPile.push(discardedCard);
        const myCards = rooms[roomCode].playersData[socket.userId].cards;
        rooms[roomCode].playersData[socket.userId].cards = myCards.filter((card) => card.id !== discardedCard.id);

        rooms[roomCode].gameData.turn += 0.5;

 
        socket.to(roomCode).emit('card_discarded', discardedCard, socket.id);

        const myScore = calculateScore(rooms[roomCode].playersData[socket.userId].cards);

        if (rooms[roomCode].gameData.turn === rooms[roomCode].gameData.roundEnd || myScore === 31 || rooms[roomCode].gameData.deck.getCount() === 0) {
            const playerCount = rooms[roomCode].gameData.currentPlayers.length;
            calculateScores(rooms[roomCode].playersData, rooms[roomCode].gameData.currentPlayers);

            rooms[roomCode].gameData.shouldShowResults = true;
            io.to(roomCode).emit('receive_players_data', rooms[roomCode].playersData);
            io.to(roomCode).emit('receive_should_show_results', rooms[roomCode].gameData.shouldShowResults);

        }
    })

    socket.on("thirty_one_knock", (roomCode) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.turn % 1 !== 0) { return; }
        const turn = rooms[roomCode].gameData.turn;
        const playerCount = rooms[roomCode].gameData.currentPlayers.length;
        rooms[roomCode].gameData.roundEnd = turn + playerCount;
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

        if (!Object.values(playersData).find((data) => data.lives > 0 && data.isReady === false)) {
            setUpNewRound(rooms, roomCode);
        }

        io.to(roomCode).emit('start_new_round');
    });
}

module.exports = {
    thirtyOneEvents,
}
