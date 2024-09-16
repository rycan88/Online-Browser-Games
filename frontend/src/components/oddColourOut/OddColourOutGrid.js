import { OddColourOutTile } from "./OddColourOutTile";
import '../../css/OddColourOut.css';

// props
// gridSize: int
// oddOne: bool
// colors: [string]

export const OddColourOutGrid = (props) => {
    const tiles = [];

    for (let x = 0; x < props.gridSize ** 2; x++) {
        const color = x === props.oddOne ? props.colors[1] : props.colors[0];
        tiles.push(<OddColourOutTile gridSize={props.gridSize} color={color} isOdd={x === props.oddOne}/>);
    }

    return (
        <div className="grids">
            {tiles.map((tile) => {
                return tile;
            })}
        </div>
    )
}