import { useEffect, useState } from "react";
import AppRouter from "component/Router";
import { authService, fbFunction } from "fbase";
import "style/styles.css";
import "style/App.css";

function App() {
  const { onAuthStateChanged } = fbFunction;
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isVerified, SetVerified] = useState(false);

  useEffect(() => {
    // console.log("App > useEffect");
    onAuthStateChanged(authService, (user) => {
      if (user) {
        // console.log("App > useEffect LogIn!");
        setUserObj({
          /*compat userobj version */
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (arg) => user.updateProfile(arg),
        });
        /*
        console.log(
          "App > useEffect > emailVerified ",
          authService.currentUser.emailVerified
        );
*/
        if (authService.currentUser.emailVerified) {
          // console.log("App > useEffect > emailVerified IF(true)");
          SetVerified(true);
        }
      } else {
        // console.log("Not LogIn!");
        setUserObj(false);
      }
      setInit(true);
    });
  }, []);
  /*
  if (authService.currentUser)
    console.log(
      "App IF(authService.currentUser) > ",
      authService.currentUser.emailVerified
    );
*/
  const refreshUser = () => {
    const user = authService.currentUser;
    // console.log("refreshUser > refresh user!");
    if (user.emailVerified) {
      SetVerified(true);
      // console.log("refreshUser > email verified!!");
    }
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
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
        />
      ) : (
        "initializing"
      )}
      <footer style={{ display: "flex", justifyContent: "center" }}>
        <span>&copy; {new Date().getFullYear()} Sangwitter</span>
      </footer>
    </>
  );
}

export default App;
