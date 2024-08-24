import { IoMdClose } from "react-icons/io";

export const ListItem = (props) => {
    return ( 
        <div className="listItem">
            <h2>{props.word}</h2>
            <IoMdClose className="listItemDelete" onClick={() => props.removeItem(props.word)}/>
        </div>
    );
}