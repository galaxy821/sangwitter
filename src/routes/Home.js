import { useState } from "react";
import { dbService, dbFunction } from "fbase";

const Home = () =>{
    const [sangweet, setSangweet] = useState("");

    const onSubmit = async (event)=>{
        event.preventDefault();
        await dbFunction.addDoc(dbFunction.collection(dbService,"sangweets"),{
            text : sangweet,
            createAt : Date.now(),
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
        <form onSubmit={onSubmit}>
            <input value={sangweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" onSubmit={onSubmit} value="Sangweet!" />
        </form>
    );
}

export default Home;