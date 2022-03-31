import { authService, dbService, dbFunction, fbFunction } from "fbase";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
// import { async } from "@firebase/util";
import Sangweet from "component/Sangweet";

const Profile = ({userObj, refreshUser}) =>{
    const {updateProfile} = fbFunction;
    const [mySangweets, setMySangweets] = useState([]);
    //const [mySangweet, setMySangweet] = useState("");
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();

    console.log(userObj);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    // console.log(userObj.uid);
    
    const getMySangweets = async() =>{
        
        const dataCollection = await dbFunction.collection(dbService, "sangweets");
        const q = await dbFunction.query(dataCollection, dbFunction.where("creatorId", "==", userObj.uid), dbFunction.orderBy("createAt", "asc"));
        console.log(q);
        const sangweets = await dbFunction.getDocs(q);
        console.log(sangweets.docs.map((doc)=>doc.data()));
        console.log(userObj.uid);
        sangweets.forEach((document)=>{
            const sangweetObject = {...document.data(), id:document.id};
            setMySangweets((prev)=>[sangweetObject,...prev]);
        });
        
        
    };

    //after rendering
    useEffect(()=>{
        getMySangweets();
    },[]);

    const onChange=(event)=>{
        const{
            target : {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit= async (event)=>{
        event.preventDefault();
        console.log("nickname 설정!");
        console.log("nickname",newDisplayName);
        console.log("original profile name : ",userObj.displayName);
        if(userObj.displayName !== newDisplayName){
            
            await updateProfile(authService.currentUser, {displayName : newDisplayName}).then(() => {
                console.log("profile update!");
            }).catch((error) => {
                console.log("there is error!");
              });
            refreshUser();
        }
    };

    console.log(mySangweets);
    return (
    <>
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName}/>
            <input type="submit" placeholder="Update Profile"/>
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        <div>
            {mySangweets.map((mySangweet)=>{
                console.log(mySangweet);
                return <Sangweet key={mySangweet.id} sangweetObj={mySangweet} isOwner={mySangweet.creatorId === userObj.uid}/>;
            })}
        </div>
    </>);
}

export default Profile;