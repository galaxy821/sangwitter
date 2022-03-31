import { authService, fbFunction, firebaseInstance } from 'fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import AuthForm from 'component/AuthForm';

const Auth = () =>{

    const onSocialClick = async (event) =>{
        const {
            target : {name},
        } = event;
        let provider;
        if(name === "google"){
            provider = new fbFunction.GoogleAuthProvider(authService);
        }else if(name ==="github"){
            provider = new fbFunction.GithubAuthProvider(authService);
        }

        const data = await fbFunction.signInWithPopup(authService, provider).then((result) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = fbFunction.GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
        
            // The signed-in user info.
            const user = result.user;
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            console.log(errorCode);
            const errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = fbFunction.GithubAuthProvider.credentialFromError(error);
            // ...
          });
        // console.log(data);
    };

    return (
        <div className='authContainer'>
            <FontAwesomeIcon icon={faTwitter} color={"#04AFF"} size="3x" style={{marginBottom : 30}}/>
            <AuthForm/>
            <div className='authBtns'>
                <button onClick={onSocialClick} name="google" className='authBtn'>Continue with Google <FontAwesomeIcon icon={faGoogle}/></button>
                <button onClick={onSocialClick} name="github" className='authBtn'>Continue with Github <FontAwesomeIcon icon={faGoogle}/></button>
            </div>
        </div>
    )
}

export default Auth;