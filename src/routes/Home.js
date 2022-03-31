import { useState, useEffect } from "react";
import { dbService, dbFunction, storageService, storageFunction} from "fbase";
// import { v4 as uuidv4 } from 'uuid';
import Sangweet from "component/Sangweet";
import SangweetFactory from "component/SangweetFactory";
// import { ref } from "firebase/storage";

const Home = ({userObj}) =>{
    
    const [sangweets, setSangweets] = useState([]);

    /*
    const getSangweets = async ()=>{
        const dbSangweets = await dbFunction.getDocs(dbFunction.collection(dbService, "sangweets"));
        dbSangweets.forEach((document)=>{
            const sangweetObject = {...document.data(), id:document.id};
            setSangweets((prev)=>[sangweetObject,...prev]);
        });
        // console.log(sangweets);
    };*/
    const getSangweets = async () =>{
        const q = await dbFunction.query(dbFunction.collection(dbService, "sangweets"), dbFunction.orderBy("createAt", "asc"));
        return q;
    }
    useEffect(()=>{
        //getSangweets();
        // dbFunction.collection(dbService,"sangweets").onSnapshot  
        // dbFunction.onSnapshot(dbFunction.collection(dbService,"sangweets"), (snapshot)=>{
        const q = dbFunction.query(dbFunction.collection(dbService, "sangweets"), dbFunction.orderBy("createAt", "desc"));
        dbFunction.onSnapshot(q, (snapshot)=>{
            const newArray = snapshot.docs.map((document)=>({
                id: document.id, ...document.data(),
            }));
            setSangweets(newArray);
        })
    },[]);

    return (
        <div className="container">
        <SangweetFactory userObj={userObj}/>
        <div style={{marginTop :30}}>
            {sangweets.map((sangweet)=>{
                return <Sangweet key={sangweet.id} sangweetObj={sangweet} isOwner={sangweet.creatorId === userObj.uid}/>;
            })}
        </div>
        </div>
    );
}

export default Home;