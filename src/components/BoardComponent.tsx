import React, {FC, useMemo, useState} from 'react';
import { Board, BoardHorizontalCoordinates, Cell, GamePlayer, MoveVector } from "../serviceApi/models/models";
import CellComponent from "./CellComponent";

interface BoardProps {
  board: Board;
  awaitableMove: GamePlayer | null;
  role: GamePlayer;
  makeMove: (vector: MoveVector) => Promise<any>
}

const BoardComponent: FC<BoardProps> = ({board, awaitableMove, role, makeMove}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const click = async (cell: Cell) => {
    if (awaitableMove !== role)
      return;
    if (selectedCell !== cell && selectedCell?.checker?.possibleMoves) {
      const {horizontal, vertical} = cell.coordinate;
      const to = selectedCell.checker.possibleMoves
        .map(pm => pm.moveVector.to)
        .filter(to => to.horizontal === horizontal && to.vertical === vertical);
      if (to.length) {
        await makeMove({from: selectedCell.coordinate, to: cell.coordinate})
        setSelectedCell(null)
      }
    }
  }

  const checkerClick = (cell: Cell) => {
    if (awaitableMove !== role)
      return;
    if (cell?.checker?.possibleMoves?.length) {
      setSelectedCell(cell);
    }
  }
  
  const rows = useMemo(() => groupCellsByRows(board), [board]);

  let i = 0;
  return (
    <div>
      {awaitableMove && <h3>Waiting for move from {awaitableMove === role ? "YOU" : "opponent"}</h3>}
      <div className="board">
        { rows.map((row, index) =>
          <React.Fragment key={index}>
            {row.map(cell =>
              <CellComponent
                click={click}
                checkerClick={checkerClick}
                cell={cell}
                key={i++}
                selected={cell.coordinate === selectedCell?.coordinate}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

const groupCellsByRows = (board: Board) => {
  const rows = Array<Array<Cell>>();
  let row = Array<Cell>();

  board.cells.forEach(c => {
    row.push(c);
    if(c.coordinate.horizontal === BoardHorizontalCoordinates.H){
      rows.push(row);
      row = Array<Cell>();
    }
  });
  rows.reverse();
  return rows;
}

export default BoardComponent;
