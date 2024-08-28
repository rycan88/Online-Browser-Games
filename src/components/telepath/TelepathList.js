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
    const sharedWords = props.sharedWords;

    const removeItem = (chosenWord) => {
        setMyWords(wordList.filter((word) => word !== chosenWord));
    }

    return wordList.map((word) => {
        return <ListItem word={word} 
                        removeItem={removeItem} 
                        shouldShowResults={shouldShowResults} 
                        sharedWords={sharedWords}/>;
    })
}