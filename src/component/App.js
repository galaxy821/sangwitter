import { useEffect, useState } from 'react';
import AppRouter from 'component/Router';
import {authService, fbFunction} from 'fbase';

function App() {
  const [init, setInit]= useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    fbFunction.onAuthStateChanged(authService, (user) => {
      if(user){
        //setIsLoggedIn(true);
        setUserObj({
          uid : user.id,
          displayName : user.displayName,
          updateProfile : (arg)=>user.updateProfile(arg),
        });
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]);

  const refreshUser = () => {
    // setUserObj(authService.currentUser);
    const user = authService.currentUser;
    setUserObj({
      uid : user.id,
      displayName : user.displayName,
      updateProfile : (arg)=>user.updateProfile(arg),
    });
    console.log(userObj);
  };

  return (
    <>
      {init?<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser}/>:"initializing"}
      <footer>&copy; {new Date().getFullYear()} Sangwitter</footer>
    </>
    
  );
}

export default App;
