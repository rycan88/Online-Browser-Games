
const thirtyOneEvents = (io, socket, rooms) => {    
    socket.on("get_all_thirty_one_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit('receive_game_data', rooms[roomCode].gameData);
            socket.emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
            socket.emit('receive_turn', rooms[roomCode].gameData.turn);
            socket.emit('receive_players', rooms[roomCode].gameData.currentPlayers);
            rooms[roomCode].playersData[socket.userId] && socket.emit('receive_own_cards', rooms[roomCode].playersData[socket.userId].cards);
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });

    // Pick up from deck
    socket.on("thirty_one_pick_up_deck_card", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        
        const deck = rooms[roomCode].gameData.deck;
        if (deck.length === 0) { return; }

        const newCard = deck.drawCard();
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        socket.emit('receive_picked_card', newCard);
    })

    // Pick up from discard pile
    socket.on("thirty_one_pick_up_discard_card", (roomCode) => {
        if (!rooms[roomCode]) { return; }
        const discardPile = rooms[roomCode].gameData.discardPile;
        if (discardPile.length === 0) { return; }
        const newCard = discardPile.pop();
        console.log("discard", newCard)
        rooms[roomCode].playersData[socket.userId].cards.push(newCard);
        socket.emit('receive_picked_card', newCard);
        io.to(roomCode).emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
    })

    socket.on("thirty_one_discard_card", (roomCode, discardedCard) => {
        if (!rooms[roomCode]) { return; }

        const discardPile = rooms[roomCode].gameData.discardPile;
        discardPile.push(discardedCard);
        const myCards = rooms[roomCode].playersData[socket.userId].cards;
        rooms[roomCode].playersData[socket.userId].cards = myCards.filter((card) => card.id !== discardedCard.id);

        rooms[roomCode].gameData.turn += 1;
        io.to(roomCode).emit('receive_discard_pile', rooms[roomCode].gameData.discardPile);
        io.to(roomCode).emit('receive_turn', rooms[roomCode].gameData.turn);
    })
}

module.exports = {
    thirtyOneEvents,
}
