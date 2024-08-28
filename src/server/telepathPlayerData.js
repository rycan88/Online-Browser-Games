
const telepathPlayerData = (username, partner) => {    
    return {
        username: username,
        chosenWords: [],
        hasPickedWords: false,
        isReady: false,
        partner: partner,
    }
}

module.exports = {
    telepathPlayerData,
};