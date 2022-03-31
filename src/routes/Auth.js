import { authService, fbFunction, firebaseInstance } from 'fbase';
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

        const data = await fbFunction.signInWithPopup(authService, provider);
        // console.log(data);
    };

    return (
        <div>
            <AuthForm/>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;