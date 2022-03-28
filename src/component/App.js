import { useEffect, useState } from 'react';
import AppRouter from 'component/Router';
import {authService, fbFunction} from 'fbase';

function App() {
  const [init, setInit]= useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  useEffect(()=>{
    fbFunction.onAuthStateChanged(authService, (user) => {
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);

  return (
    <>
      {init?<AppRouter isLoggedIn={isLoggedIn}/>:"initializing"}
      <footer>&copy; {new Date().getFullYear()} Sangwitter</footer>
    </>
    
  );
}

export default App;
