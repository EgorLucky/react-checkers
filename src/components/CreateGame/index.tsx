import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameCreateDTO, GameCreateResult, BoardSide, MoveVector, MoveResult, GamePlayer} from "../../serviceApi/models/models";

function CreateGame(props: { 
                            api:  {
                                    createGameEndpoint:  (dto: GameCreateDTO) => Promise<GameCreateResult>
                                  },
                            skipJoinGameLink: boolean
                          }) {
    const [checkerCellColor, setCheckerCellColor] = useState("#FFFF99");
    const [nonPlayableCellColor, setNonPlayableCellColor] = useState("#000000");
    const [myCheckerColor, setMyCheckerColor] = useState("#000000");
    const [opponentCheckerColor, setOpponentCheckerColor] = useState("#FFFFFF");
    const [myBoardSide, setMyBoardSide] = useState(BoardSide.FirstSide);
    const [createButtonDisabled, setCreateButtonDisabled] = useState(false);

    const {api, skipJoinGameLink} = props;
    const navigate = useNavigate();

    const radioClicked = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value as BoardSide;
      setMyBoardSide(inputValue);
    }

    const checkerCellColorChanged = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setCheckerCellColor(inputValue);
    }

    const nonPlayableCellColorChanged = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setNonPlayableCellColor(inputValue);
    }

    const myCheckerColorChanged = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setMyCheckerColor(inputValue);
    }

    const opponentCheckerColorChanged = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      setOpponentCheckerColor(inputValue);
    }

    const createGameClicked = async () => {

      setCreateButtonDisabled(true);

      const dto: GameCreateDTO = {
        myCheckerColor: myCheckerColor,
        opponentCheckerColor: opponentCheckerColor,
        checkerCellColor: checkerCellColor,
        nonPlayableCellColor: nonPlayableCellColor,
        myBoardSide: myBoardSide
      }

      const {id, firstPlayerCode } = await api.createGameEndpoint(dto);

      localStorage.setItem("gameId" + id, firstPlayerCode);
      localStorage.setItem("role" + id, GamePlayer.FirstPlayer);

      navigate(`/game/${id}/${skipJoinGameLink ? "skipJoinGameLink" : ""}`);
    }

    return (
          <div>
            <h1>CreateGame</h1>
            <br/>
            <div>
              CheckerCellColor:
              <br/>
              <input type="color" value={checkerCellColor} onChange={checkerCellColorChanged}/>
            </div>
            <div>
              NonPlayableCellColor:
              <br/>
              <input type="color" value={nonPlayableCellColor} onChange={nonPlayableCellColorChanged}/>
            </div>
            <div>
              MyCheckerColor:
              <br/>
              <input type="color" value={myCheckerColor} onChange={myCheckerColorChanged}/>
            </div>
            <div> 
              OpponentCheckerColor:
              <br/>
              <input type="color" value={opponentCheckerColor} onChange={opponentCheckerColorChanged}/> 
            </div>
            <div> 
              MyBoardSide:
              <br/>
              <input name="MyBoardSide" 
                      type="radio" 
                      value={BoardSide.FirstSide}
                      checked={myBoardSide == BoardSide.FirstSide}
                      onChange={radioClicked}/> 
                      FirstSide
              <br/>
              <input name="MyBoardSide" 
                      type="radio" 
                      value={BoardSide.SecondSide} 
                      checked={myBoardSide == BoardSide.SecondSide}
                      onChange={radioClicked}/> 
                      SecondSide
            </div> 
            <button disabled={createButtonDisabled} 
                    onClick={createGameClicked}>
                      CreateGame
            </button>
          </div>
    );
  }

  export default CreateGame;