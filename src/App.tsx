import "./App.css";

import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Menu from './components/Menu';
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import Game from "./components/Game";
import ServiceApi from "./serviceApi/serviceApi";

const createGameWithBotApi = {
  createGameEndpoint: ServiceApi.GameCreateWithBot
};

const createGameWithHumanApi = {
  createGameEndpoint: ServiceApi.GameCreateWithHuman
};

const playGameWithBotApi = {
  startGameEndpoint: ServiceApi.GameStartWithBot,
  moveEndpoint: ServiceApi.MoveWithBot
};

const playGameWithHumanApi = {
  startGameEndpoint: ServiceApi.GameStartWithHuman,
  moveEndpoint: ServiceApi.MoveWithHuman
};

const App = () => {
  return (
          <div className="app">
            <Router>
              <Routes>
                  <Route path="/" element={<Menu/>} />
                  <Route path="/createGameWithBot" element={<CreateGame api={createGameWithBotApi} skipJoinGameLink={true}/>} />
                  <Route path="/createGame" element={<CreateGame api={createGameWithHumanApi} skipJoinGameLink={false}/>} />
                  <Route path="/joinGame/:id" element={<JoinGame/>} />
                  <Route path="/game/:id" element={<Game skipJoinGameLink={false} api={playGameWithHumanApi}/>}/>
                  <Route path="/game/:id/skipJoinGameLink" element={<Game skipJoinGameLink={true} api={playGameWithBotApi}/>}/>
              </Routes>
            </Router>
          </div>
        );
};

export default App;
