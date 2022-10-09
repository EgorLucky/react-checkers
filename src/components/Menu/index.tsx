import { NavLink } from 'react-router-dom';

function Menu() {
    return (
        <div style={{display:'block'}}>
          <div>
            <NavLink to="/createGameWithBot">Играть с ботом</NavLink>
          </div>
          <div>
            <NavLink to="/createGame">Играть с человеком</NavLink>
          </div>
        </div>
    );
  }

  export default Menu;