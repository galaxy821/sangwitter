import { useState } from "react";
import { dbService, dbFunction, storageFunction, storageService } from "fbase";
import {v4 as uuidv4} from "uuid";
import { ref } from "firebase/storage";

const SangweetFactory = ({userObj}) =>{

    const [sangweet, setSangweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event)=>{
        event.preventDefault();
        let attachmentUrl="";
        if(attachment !==""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

            await storageFunction.uploadString(attachmentRef, attachment, 'data_url').then((snapshot) => {
                console.log('Uploaded a data_url string!');
            });
            attachmentUrl = await storageFunction.getDownloadURL(attachmentRef);    
            console.log("success upload image!");
        }
        await dbFunction.addDoc(dbFunction.collection(dbService,"sangweets"),{
            text : sangweet,
            createAt : Date.now(),
            creatorId : userObj.uid,
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
        <form onSubmit={onSubmit}>
            <input value={sangweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120}/>
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Sangweet"/>
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="img"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
};

export default SangweetFactory;

/*
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
        */