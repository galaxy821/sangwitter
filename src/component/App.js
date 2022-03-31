import { useEffect, useState } from 'react';
import AppRouter from 'component/Router';
import {authService, fbFunction} from 'fbase';
import "./styles.css";

function App() {
  const [init, setInit]= useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  //const [smallUserObj, setSmallUserObj] = useState(null);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    fbFunction.onAuthStateChanged(authService, (user) => {
      if(user){
        //setIsLoggedIn(true);
        setUserObj({
          uid : user.uid,
          displayName : user.displayName,
          updateProfile : (arg)=>user.updateProfile(arg),
        });
      }else{
        //setIsLoggedIn(false);
        setUserObj(false);
      }
      setInit(true);
    });
  },[]);

  const refreshUser = () => {
    // setUserObj(authService.currentUser);
    const user = authService.currentUser;
    console.log(user);
    setUserObj({
      uid : user.uid,
      displayName : user.displayName,
      updateProfile : (arg)=>user.updateProfile(arg),
    });
    console.log(userObj);
  };

  return (
    <>
      {init?<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser}/>:"initializing"}
      <footer style={{display:"flex", justifyContent : "center" }}><span>&copy; {new Date().getFullYear()} Sangwitter</span></footer>
    </>
    
  );
}

export default App;
