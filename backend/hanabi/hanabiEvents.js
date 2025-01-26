
const hanabiEvents = (io, socket, rooms) => {    
    socket.on("get_all_hanabi_data", (roomCode) => {
        if (rooms[roomCode]) {
            socket.emit("receive_play_pile", rooms[roomCode].gameData.playPile);
            socket.emit("receive_discard_pile", rooms[roomCode].gameData.discardPile);
            socket.emit("receive_history", rooms[roomCode].gameData.history);
            socket.emit("receive_deck_count", rooms[roomCode].gameData.deck.getCount());  
            socket.emit("receive_token_count", rooms[roomCode].gameData.tokenCount); 
            socket.emit("receive_turn", rooms[roomCode].gameData.turn); 
            socket.emit("receive_lives", rooms[roomCode].gameData.lives);
            socket.emit("receive_players_data", rooms[roomCode].playersData);
        } else {
            socket.emit('room_error', `Lobby ${roomCode} does not exist`);
        }
    });
    socket.on("hanabi_change_card_order", (roomCode, oldIndex, newIndex, movingCardId) => {
        if (!rooms[roomCode]) { return; }

        const myData = rooms[roomCode].playersData[socket.userId];
        const myCards = myData.cards;

        const card = myCards[oldIndex];
        if (`Card${card.id}` != movingCardId) {
            return;
        }
        myCards.splice(oldIndex, 1);
        myCards.splice(newIndex, 0, card);

        io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);

    });

    socket.on("hanabi_discard_card", (roomCode, cardId) => {
        if (!rooms[roomCode]) { return; }

        const myData = rooms[roomCode].playersData[socket.userId];
        const card = myData.cards.find((card) => `Card${card.id}` === cardId);

        if (!card || rooms[roomCode].gameData.turn !== myData.index) { return; }

        myData.cards = myData.cards.filter((card) => `Card${card.id}` !== cardId)

        const discardPile = rooms[roomCode].gameData.discardPile;
        discardPile.push(card)

        const deck = rooms[roomCode].gameData.deck;
        if (deck.getCount() > 0) {
            const newCard = deck.drawCard();
            myData.cards.push(newCard);
        }

        const tokenCount = rooms[roomCode].gameData.tokenCount;
        rooms[roomCode].gameData.tokenCount = Math.min(tokenCount + 1, 8);

        rooms[roomCode].gameData.turn = (rooms[roomCode].gameData.turn + 1) % rooms[roomCode].gameData.playerDataArray.length;

        const action = {type: "discard", player: socket.userId, card: card};
        rooms[roomCode].gameData.history.push(action);

        io.to(roomCode).emit("receive_deck_count", deck.getCount());  
        io.to(roomCode).emit("receive_token_count", rooms[roomCode].gameData.tokenCount);       
        io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);
        io.to(roomCode).emit("receive_discard_pile", discardPile)
        io.to(roomCode).emit("receive_history", rooms[roomCode].gameData.history);  
        io.to(roomCode).emit("receive_turn", rooms[roomCode].gameData.turn);  
    })

    socket.on("hanabi_play_card", (roomCode, cardId) => {
        if (!rooms[roomCode]) { return; }

        const myData = rooms[roomCode].playersData[socket.userId];
        const card = myData.cards.find((card) => `Card${card.id}` === cardId);

        if (!card || rooms[roomCode].gameData.turn !== myData.index) { return; }

        myData.cards = myData.cards.filter((card) => `Card${card.id}` !== cardId)

        const playPile = rooms[roomCode].gameData.playPile;
        
        let isSuccessful = playPile[card.suit] + 1 === card.number;

        if (playPile[card.suit] + 1 === card.number) { // If can be played in the play pile
            if (card.number === 5) {
                rooms[roomCode].gameData.tokenCount = Math.min(rooms[roomCode].gameData.tokenCount + 1, 8);
            }
            playPile[card.suit] += 1;
        } else {
            const discardPile = rooms[roomCode].gameData.discardPile;
            discardPile.push(card)

            rooms[roomCode].gameData.lives -= 1;
            io.to(roomCode).emit("receive_lives", rooms[roomCode].gameData.lives);
            io.to(roomCode).emit("receive_discard_pile", discardPile)
        }

        const deck = rooms[roomCode].gameData.deck;
        if (deck.getCount() > 0) {
            const newCard = deck.drawCard();
            myData.cards.push(newCard);
        }

        rooms[roomCode].gameData.turn = (rooms[roomCode].gameData.turn + 1) % rooms[roomCode].gameData.playerDataArray.length;
        
        const action = {type: "play", player: socket.userId, card: card, isSuccessful: isSuccessful};
        rooms[roomCode].gameData.history.push(action);

        io.to(roomCode).emit("receive_deck_count", deck.getCount());  
        io.to(roomCode).emit("receive_play_pile", playPile);
        io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);
        io.to(roomCode).emit("receive_history", rooms[roomCode].gameData.history);
        io.to(roomCode).emit("receive_token_count", rooms[roomCode].gameData.tokenCount);  
        io.to(roomCode).emit("receive_turn", rooms[roomCode].gameData.turn); 

    })

    socket.on("hanabi_give_clue", (roomCode, cluePlayer, chosenClue) => {
        if (!rooms[roomCode] || rooms[roomCode].gameData.tokenCount <= 0 || rooms[roomCode].gameData.turn !== rooms[roomCode].playersData[socket.userId].index) { return; }

        rooms[roomCode].gameData.tokenCount -= 1
        rooms[roomCode].gameData.turn = (rooms[roomCode].gameData.turn + 1) % rooms[roomCode].gameData.playerDataArray.length;

        const cluePlayerData = rooms[roomCode].playersData[cluePlayer];

        cluePlayerData.cards.forEach((card) => {
            if (card.number === chosenClue) {
                card.numberVisible = true;
            } else if (card.suit === chosenClue) {
                card.suitVisible = true;
            }
        });

        const action = {type: "clue", sender: socket.userId, receiver: cluePlayer, chosenClue: chosenClue};
        rooms[roomCode].gameData.history.push(action);

        io.to(roomCode).emit("receive_token_count", rooms[roomCode].gameData.tokenCount);
        socket.to(roomCode).emit("receive_clue", socket.nickname, cluePlayer, chosenClue);
        io.to(roomCode).emit("receive_players_data", rooms[roomCode].playersData);
        io.to(roomCode).emit("receive_history", rooms[roomCode].gameData.history);
        io.to(roomCode).emit("receive_turn", rooms[roomCode].gameData.turn); 
    });
}

module.exports = {
    hanabiEvents,
}
