import { authService, fbFunction } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import AuthForm from "component/AuthForm";
import "style/Auth.css";

const Auth = ({ isVerified, isLoggedIn, refreshUser }) => {
  const { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } =
    fbFunction;
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider(authService);
    } else if (name === "github") {
      provider = new GithubAuthProvider(authService);
    }

    signInWithPopup(authService, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        if (name === "github") {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          // ...
        }
      })
      .catch((error) => {
        if (name === "github") {
          // Handle Errors here.
          const errorCode = error.code;
          console.log(errorCode);
          const errorMessage = error.message;
          console.log(errorMessage);
          // The email of the user's account used.
          const email = error.email;
          console.log(email);
          // The AuthCredential type that was used.
          const credential =
            fbFunction.GithubAuthProvider.credentialFromError(error);
          console.log(credential);
          // ...
        }
      });
    // console.log(data);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm
        isVerified={isVerified}
        isLoggedIn={isLoggedIn}
        refreshUser={refreshUser}
      />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
