import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameLocalStorageHelper } from "../../GameLocalStorageHelper";
import { GameGetInfoResult, GamePlayer, GameState } from "../../serviceApi/models/models";
import ServiceApi from "../../serviceApi/serviceApi";

function JoinGame() {
    const [gameInfo, setGameInfo] = useState<GameGetInfoResult|null>(null);
    const [registerButtonDisabled, setRegistrationButtonDisabled] = useState<boolean>(false);
    const [readyToPlayButtonDisabled, setReadyToPlayButtonDisabled] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const storage = new GameLocalStorageHelper(localStorage)

    if (id === undefined) {
      alert("wrong url");
      throw new Error();
    }

    useEffect(() => {
      const getGameInfo = async () => {
        if (gameInfo == null) {
          const newGameInfo = await ServiceApi.GetInfo(id);
          setGameInfo(newGameInfo);
        }
      }

      getGameInfo().catch(console.log);
    })

    const registerClick = async () => {
      setRegistrationButtonDisabled(true);
      const {success, message, code} = await ServiceApi.RegisterSecondPlayer(id);
      setRegistrationButtonDisabled(false);
      setGameInfo(null);
      if (success) {
        if (code == null)
          throw new Error("code is null but success is true after game registration");
        storage.savePlayerCodeAndRole(code, GamePlayer.SecondPlayer, id)
      } else {
        throw new Error(message);
      }
    }

    const readyToPlay = async () => {
      setReadyToPlayButtonDisabled(true);
      const code = storage.getPlayerCode(id);

      if (code == null)
        throw new Error("readyToPlay: player code is null")

      const {success, message} = await ServiceApi.ReadyToPlay(code);
      setRegistrationButtonDisabled(false);
      setGameInfo(null);
      if (success) {
        navigate(`/game/${id}`);
      } else {
        throw new Error(message);
      }
    }

    return (
      <div>
        { !gameInfo && <>Getting info about game...</> }
        { 
          gameInfo?.state === GameState.Created && 
          <>
            <button onClick={registerClick}
                    disabled={registerButtonDisabled}>
              Register in game
            </button>
          </> 
        }
        { 
          gameInfo?.state === GameState.AllPlayersRegistred &&
          <>
            <button onClick={readyToPlay}
                    disabled={readyToPlayButtonDisabled}>
              I'm ready to play
            </button>
          </>
        }
        {
          gameInfo && 
          gameInfo.state !== GameState.Created &&
          gameInfo.state !== GameState.AllPlayersRegistred &&
          <>Joining complete</> 
        }
      </div>
    );
  }

  export default JoinGame;