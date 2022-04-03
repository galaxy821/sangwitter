import { useEffect, useState } from "react";
import { authService, fbFunction } from "fbase";
import AppRouter from "component/Router";
import Initial from "component/Initial";
import "style/styles.css";
import "style/App.css";

function App() {
  const { onAuthStateChanged } = fbFunction;
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null); /*compat userobj version */
  const [isVerified, SetVerified] = useState(false);
  const [isPhotoURL, setIsPhotoURL] = useState(false);

  useEffect(() => {
    // const getInit = localStorage.getItem("init");
    // const getVerified = localStorage.getItem("verified");
    // const getUserobj = localStorage.getItem("userobj");
    // setInit(getInit);
    // console.log("get : ", getInit);
    // SetVerified(getVerified);
    // console.log("get : ", getVerified);
    // setUserObj(getUserobj);
    // console.log("get : ", getUserobj);
    // console.log(
    //   "init : ",
    //   init,
    //   " verified : ",
    //   isVerified,
    //   " userObj : ",
    //   userObj
    // );
    onAuthStateChanged(authService, (user) => {
      if (user) {
        console.log("user :", user);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          updateProfile: (arg) => user.updateProfile(arg),
        });
        // localStorage.setItem("userobj", userObj);
        // console.log(userObj);
        // console.log("localsetitem : ", localStorage.getItem("userobj"));
        if (authService.currentUser.emailVerified) {
          SetVerified(true);
          // console.log("verified : ", isVerified);
          // localStorage.setItem("verified", isVerified);
          // console.log("localsetitem : ", localStorage.getItem("verified"));
        }
        if (user.photoURL) {
          setIsPhotoURL(true);
          // localStorage.isPhotoURL = JSON.stringify(isPhotoURL);
          // localStorage.setItem('is/')/
        }
      } else {
        setUserObj(false);
        // localStorage.setItem("userobj", userObj);
        // console.log("localsetItem : ", localStorage.getItem("userobj"));
      }
      setInit(true);
      // console.log("init : ", init);
      // localStorage.setItem("init", init);
      // console.log("json.stringify : ", localStorage.getItem("init"));
      console.log(
        "init : ",
        init,
        " verified : ",
        isVerified,
        " userObj : ",
        userObj
      );
    });
  }, []);
  /*
  useEffect(() => {
    setInit(localStorage.init);
    SetVerified(localStorage.isVerified);
    setUserObj(localStorage.userObj);
    console.log(
      "init : ",
      init,
      " verified : ",
      isVerified,
      " userObj : ",
      userObj
    );
  });
*/
  const refreshUser = () => {
    const user = authService.currentUser;
    if (user.emailVerified) {
      SetVerified(true);
      // localStorage.isVerified = JSON.stringify(isVerified);
    }
    if (user.photoURL) {
      setIsPhotoURL(true);
      // localStorage.isPhotoURL = JSON.stringify(isPhotoURL);
    }
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updateProfile: (arg) => user.updateProfile(arg),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
          isVerified={isVerified}
          isPhotoURL={isPhotoURL}
        />
      ) : (
        <Initial />
      )}
      <footer style={{ display: "flex", justifyContent: "center" }}>
        <span>&copy; {new Date().getFullYear()} Sangwitter</span>
      </footer>
    </>
  );
}

export default App;
