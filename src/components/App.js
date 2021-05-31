import React, { useState } from 'react';
import TopBar from './TopBar';
import Main from './Main';

import { TOKEN_KEY } from '../constants';
import '../styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem(TOKEN_KEY) ? true : false);

  const logout = () => {
    console.log("log out");
    //remove token
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
  };

  //user will call it in Login component
  const loggedIn = (token) => {
    if (token) {
      //store token in localStorage
      //key-value pair, TOKEN_KEY is the key
      localStorage.setItem(TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="App">
      <TopBar isLoggedIn={isLoggedIn} handleLogout={logout} />
      <Main isLoggedIn={isLoggedIn} handleLoggedIn={loggedIn}/>
    </div>
  );
}

export default App;
