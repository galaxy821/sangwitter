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
    onAuthStateChanged(authService, (user) => {
      if (user) {
        console.log("LogIn!");
        setUserObj({
          /*compat userobj version */
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (arg) => user.updateProfile(arg),
        });

        if (authService.currentUser.emailVerified) {
          SetVerified(true);
        }
      } else {
        console.log("Not LogIn!");
        setUserObj(false);
      }
      setInit(true);
    });
  }, []);

  if (authService.currentUser)
    console.log(authService.currentUser.emailVerified);

  const refreshUser = () => {
    const user = authService.currentUser;
    console.log("refresh user!");
    if (user.emailVerified) {
      SetVerified(true);
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
