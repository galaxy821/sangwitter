import { authService, fbFunction } from "fbase";
import { useState } from "react";
import "style/AuthForm.css";

const AuthForm = ({ isVerified, isLoggedIn, refreshUser }) => {
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
  } = fbFunction;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  //   const [isVerified, SetVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //   const []

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    // refreshUser();
    console.log("AuthForm > onSumbit!");
    event.preventDefault();
    try {
      if (newAccount) {
        // create newAccount
        await createUserWithEmailAndPassword(authService, email, password)
          .then((userCredential) => {
            // Signed in
            // const user = userCredential.user;
            let user = authService.currentUser;

            sendEmailVerification(user)
              .then(function () {
                console.log("email send!!");
              })
              .catch("there is an error while sendEmailVerificaion");

            setTimeout(() => {
              console.log("signin processing...");
            }, 500);
            /*
            if (user.emailVerified) {
              SetVerified(true);
            }
            else{
                
            }*/
          })
          .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            switch (error.code) {
              case "auth/email-already-in-use":
                const message = "Already exist Email!!";
                setErrorMessage(message);
                break;
              default:
                break;
            }
            console.log(error.code);
            // setError(error.message);
          });
        console.log(authService.currentUser.emailVerified);
      } else {
        // log in
        console.log("AuthForm > onSumbit! > login clicked!", email, password);
        await signInWithEmailAndPassword(authService, email, password)
          .then((userCredential) => {
            // Signed in
            //const user = userCredential.user;
            // ...
            refreshUser();
            console.log("login...ing...", isVerified);
            if (isVerified) {
              console.log("login success!!");
            } else {
              const message = "Email verification has not been completed. ";
              setErrorMessage();
            }
          })
          .catch((error) => {
            console.log(error.code);
            console.log(error.message);
          });
      }
    } catch (error) {
      //   setErrorMessage(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
          className="authInput authSubmit"
        />
        {errorMessage && <span className="authError">{errorMessage}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
