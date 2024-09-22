import { IoMdClose } from "react-icons/io";

// props:
// word: (string, num)
// shouldShowResults: bool
// sharedWords: [string]

export const ListItem = (props) => {
    const shouldShowResults = props.shouldShowResults;
    const teamMode = props.teamMode;
    const word = props.word[0];
    const count = props.word[1];
    const listNum = props.listNum;

    const deleteButton = <IoMdClose className="listItemDelete hover:redGradientButton" onClick={() => props.removeItem(word)}/>;
    let bg_color = "";
    if (shouldShowResults) {
        bg_color = count >= 1 ? "bg-green-500/50" : "bg-red-500/50" ;
    } else {
        bg_color = "bg-slate-900/30";
    }
    return ( 
        <div className={`listItem ${bg_color}`}>
            {!shouldShowResults && listNum && <h3 className="pr-2">{listNum}.</h3>}
            <h2>{word}</h2>
            {!shouldShowResults 
                ? deleteButton 
                : (!teamMode && <h3 className="wordPoints">{count}</h3> )}
        </div>
    );
}