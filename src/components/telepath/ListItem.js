import { IoMdClose } from "react-icons/io";

// props:
// word: string
// shouldShowResults: bool
// sharedWords: [string]

export const ListItem = (props) => {
    const deleteButton = !props.shouldShowResults ? <IoMdClose className="listItemDelete hover:redGradientButton" onClick={() => props.removeItem(props.word)}/> : <></>;
    let bg_color = "";
    if (props.shouldShowResults) {
        bg_color = props.sharedWords.includes(props.word) ? "bg-green-500/50" : "bg-red-500/50" ;
    } else {
        bg_color = "bg-slate-900/30";
    }
    return ( 
        <div className={`listItem ${bg_color}`}>
            <h2>{props.word}</h2>
            {deleteButton}
        </div>
    );
}