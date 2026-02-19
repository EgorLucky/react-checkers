import "./checker.css";
import { Cell, CheckerRole } from "../../serviceApi/models/models";

function CheckerComponent(props: {
  cell: Cell;
  checkerClick: (cell: Cell) => void;
}) {
  const { cell, checkerClick } = props;
  const click = () => checkerClick(cell);
  const isKing = cell.checker?.role === CheckerRole.King;
  return (
    <div
      className="checker"
      style={{
        background: cell.checker.color,
        borderWidth: isKing ? "5px" : "1px",
      }}
      onClick={click}
    ></div>
  );
}

export default CheckerComponent;
