import "./checker.css";
import { Cell, Checker } from "../../serviceApi/models/models"

function CheckerComponent(props: { cell: Cell, checkerClick: (cell: Cell) => void }){
    const { cell, checkerClick } = props;
    const click = () => checkerClick(cell)
    return <div className="checker" 
                style={{background: cell.checker.color}}
                onClick={click}>
            </div>
}

export default CheckerComponent;