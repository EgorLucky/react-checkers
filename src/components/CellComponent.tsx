import {FC} from 'react';
import {Cell} from "../serviceApi/models/models"
import CheckerComponent from './CheckerComponent';

interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
  checkerClick: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({cell, selected, click, checkerClick}) => {
  const borderStyle = selected ? "dotted": "";
  return (
    <div
      className='cell'
      onClick={() => click(cell)}
      style={{background: cell.color, borderBottom: borderStyle, borderTop: borderStyle}}
    >
      {//cell.checker == null && <div className={"available"}/>
      }
      {cell.checker && <CheckerComponent cell={cell} checkerClick={checkerClick}/>}
    </div>
  );
};

export default CellComponent;
