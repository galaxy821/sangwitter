import { useState, useEffect } from "react";
import { dbService, dbFunction, storageService, storageFunction} from "fbase";
import { v4 as uuidv4 } from 'uuid';
import Sangweet from "component/Sangweet";
import { ref } from "firebase/storage";

const Home = (userObj) =>{
    const [sangweet, setSangweet] = useState("");
    const [sangweets, setSangweets] = useState([]);
    const [attachment, setAttachment] = useState("");

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
        let attachmentUrl="";
        if(attachment !==""){
            const attachmentRef = ref(storageService, `${userObj.userObj.uid}/${uuidv4()}`);

            await storageFunction.uploadString(attachmentRef, attachment, 'data_url').then((snapshot) => {
                console.log('Uploaded a data_url string!');
            });
            attachmentUrl = await storageFunction.getDownloadURL(attachmentRef);    
            console.log("success upload image!");
        }
        await dbFunction.addDoc(dbFunction.collection(dbService,"sangweets"),{
            text : sangweet,
            createAt : Date.now(),
            creatorId : userObj.userObj.uid,
            attachmentUrl,
        });
        setSangweet("");
        setAttachment("");
        /* test code
        console.log(`app onsubmit : ${userObj.userObj.uid}`); 
        console.log(`${userObj.userObj.uid}/${uuidv4()}`);
        console.log(attachment);
        console.log(attachmentUrl);
        */
    };

    const onChange = (evnet)=>{
        evnet.preventDefault();
        const {
            target : {value},
        } = evnet;
        setSangweet(value);
    };

    const onFileChange = (event) =>{
        const {
            target : {files},
        } = event;
        // console.log(files);
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) =>{
            const {currentTarget : {result}} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () =>{setAttachment("");};

    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={sangweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Sangweet!" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="preview"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        <div>
            {sangweets.map((sangweet)=>{
                return <Sangweet key={sangweet.id} sangweetObj={sangweet} isOwner={sangweet.creatorId ===userObj.userObj.uid}/>;
            })}
        </div>
        </>
    );
}

export default Home;