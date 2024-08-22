export const ListItem = (props) => {
    return ( 
        <div className="listItem">
            <h2>{props.word}</h2>
            <button onClick={() => props.removeItem(props.word)}>X</button>
        </div>
    );
}