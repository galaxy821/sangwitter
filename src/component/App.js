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
  const [isNamed, setNamed] = useState(false);
  // const [isPhotoURL, setIsPhotoURL] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        console.log("user :", user);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          updateProfile: (arg) => user.updateProfile(arg),
        });

        if (userObj.displayName === null) {
          setNamed(true);
        } else {
          setNamed(false);
        }

        if (authService.currentUser.emailVerified) {
          SetVerified(true);
        } else {
          SetVerified(false);
        }
        /*
        if (user.photoURL) {
          setIsPhotoURL(true);
        }*/
      } else {
        setUserObj(false);
        SetVerified(false);
        setNamed(false);
      }
      setInit(true);
      console.log(
        "App > init : ",
        init,
        " verified : ",
        isVerified,
        " userObj : ",
        userObj,
        " isNamed : ",
        isNamed
      );
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    if (user.emailVerified) {
      SetVerified(true);
    } else {
      SetVerified(false);
    }

    if (user.displayName) {
      setNamed(true);
    } else {
      setNamed(false);
    }
    /*
    if (user.photoURL) {
      setIsPhotoURL(true);
    }*/
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
          isNamed={isNamed}
          // isPhotoURL={isPhotoURL}
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
