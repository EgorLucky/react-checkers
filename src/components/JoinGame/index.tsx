import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameGetInfoResult, GameState } from "../../serviceApi/models/models";
import ServiceApi from "../../serviceApi/serviceApi";

function JoinGame() {
    const [gameInfo, setGameInfo] = useState<GameGetInfoResult|null>(null);
    //const [registerButtonDisabled, setReg]
    const { id } = useParams();
      if(id === undefined){
        alert("wrong url");
        return;
      }

    useEffect(() => {
      const getGameInfo = async () => {
        if(gameInfo == null){
          const newGameInfo = await ServiceApi.GetInfo(id);
          setGameInfo(newGameInfo);
        }
      }

      getGameInfo().catch(console.log);
    })

    const registerClick = async () => {
      
    }

    return (
        <div>
          { gameInfo == null && <>Getting info about game...</> }
          { gameInfo?.state === GameState.Created && <><button onClick={registerClick}>Register in game</button></> }
        </div>
    );
  }

  export default JoinGame;