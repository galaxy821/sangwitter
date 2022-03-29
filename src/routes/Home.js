import { useState, useEffect } from "react";
import { dbService, dbFunction, fbFunction } from "fbase";
import Sangweet from "component/Sangweet";

const Home = (userObj) =>{
    const [sangweet, setSangweet] = useState("");
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

    useEffect(()=>{
        //getSangweets();
        // dbFunction.collection(dbService,"sangweets").onSnapshot
        dbFunction.onSnapshot(dbFunction.collection(dbService,"sangweets"), (snapshot)=>{
            const newArray = snapshot.docs.map((document)=>({
                id: document.id, ...document.data(),
            }));
            setSangweets(newArray);
        })
    },[]);

    const onSubmit = async (event)=>{
        event.preventDefault();
        await dbFunction.addDoc(dbFunction.collection(dbService,"sangweets"),{
            text : sangweet,
            createAt : Date.now(),
            creatorId : userObj.userObj.uid,
        });
        setSangweet("");
    };

    const onChange = (evnet)=>{
        evnet.preventDefault();
        const {
            target : {value},
        } = evnet;
        setSangweet(value);
    }

    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={sangweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" value="Sangweet!" />
        </form>
        <div>
            <h1>test</h1>
            {sangweets.map((sangweet)=>{
                return <Sangweet key={sangweet.id} sangweetObj={sangweet} isOwner={sangweet.creatorId ===userObj.userObj.uid}/>;
            })}
        </div>
        </>
    );
}

export default Home;