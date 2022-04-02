import { useEffect, useState } from "react";
import AppRouter from "component/Router";
import { authService, fbFunction } from "fbase";
import "style/styles.css";
import "style/App.css";

function App() {
  const { onAuthStateChanged } = fbFunction;
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

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
      } else {
        console.log("Not LogIn!");
        setUserObj(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
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
