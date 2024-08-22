import { OddColourOutTile } from "../components/OddColourOutTile";
import '../css/OddColourOut.css';

export const OddColourOutGrid = (props) => {
    const tiles = [];
    const gridSize = props.gridSize;
    const oddOne = props.oddOne;
    const colors = props.colors;

    for (let x = 0; x < gridSize ** 2; x++) {
        const color = x === oddOne ? colors[1] : colors[0];
        tiles.push(<OddColourOutTile gridSize={gridSize} color={color} isOdd={x === oddOne}/>);
    }

    return (
        <div className="grids">
            {tiles.map((tile) => {
                return tile;
            })}
        </div>
    )
}