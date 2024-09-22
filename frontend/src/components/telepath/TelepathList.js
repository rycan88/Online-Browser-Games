import { ListItem } from "./ListItem";

// props
// wordList: [string]
// setMyWords: function
// shouldShowResults: bool
// sharedWords: [string]

export const TelepathList = (props) => {
    const wordList = props.wordList;
    const setMyWords = props.setMyWords;
    const shouldShowResults = props.shouldShowResults;
    const sortedWords = props.sortedWords;
    const teamMode= props.teamMode;
    const combinedShared = props.combinedShared;
    const isCombinedShared = props.isCombinedShared;

    const removeItem = (chosenWord) => {
        setMyWords(wordList.filter((word) => word !== chosenWord));
    }

    if (shouldShowResults) {
        if (isCombinedShared) {
            if (!combinedShared) {
                return <></>
            }
            return combinedShared.map((tup, index) => {
                return <ListItem key={index}
                    word={tup} 
                    removeItem={removeItem} 
                    shouldShowResults={shouldShowResults} 
                    teamMode={teamMode}
                />;
            });
        }
        if (!sortedWords) {
            return <></>
        }
        return sortedWords.map((tup, index) => {
            return <ListItem key={index} 
                word={tup} 
                removeItem={removeItem} 
                shouldShowResults={shouldShowResults} 
                teamMode={teamMode}
            />;
        });
    } else {
        const length = wordList.length;
        return wordList.slice().reverse().map((word, index) => {
            return <ListItem key={index}
                            listNum={length - index}
                            word={[word, -1]} 
                            removeItem={removeItem} 
                            shouldShowResults={shouldShowResults} 
                            teamMode={teamMode}
            />;
        })
    }

}