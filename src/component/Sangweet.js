import { dbService, dbFunction } from "fbase";
import { useState } from "react";

const Sangweet = ({sangweetObj, isOwner}) =>{
    const [editing, setEditing] = useState(false);
    const [newSangweet, setNewSangweet] = useState(sangweetObj.text);

    const onDeleteClick = async() => {
        const ok = window.confirm("삭제하시겠습니까?");
        console.log(ok);
        if(ok){
            console.log(sangweetObj.id);
            const data = await dbFunction.deleteDoc(dbFunction.doc(dbService,`sangweets/${sangweetObj.id}`));
            console.log(data); 
        }
    }

    const onChange = (event)=>{
        const {
            target : {value},
        } = event;
        setNewSangweet(value);
    }

    const onSubmit = async (event)=>{
        event.preventDefault();
        // await dbFunction.deleteDoc(dbFunction.doc(dbService,`sangweets/${sangweetObj.id}`));
        await dbFunction.updateDoc(dbFunction.doc(dbService,`sangweets/${sangweetObj.id}`),{text : newSangweet});
        setEditing(false);
    }

    const toggleEditing = () =>{
        setEditing((prev)=>!prev);
    }

    return(
        <div>
            {editing?(
                <>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} value={newSangweet} required />
                        <input type="submit" value="Update Sangweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ):(
                <>
            <h4>{sangweetObj.text}!!</h4>
            {isOwner &&(
                <>
                <button onClick={onDeleteClick}>Delete Sangweet</button>
                <button onClick={toggleEditing}>Edit Sangweet</button>
                </>
            )}
            </>
            )}
        </div>
    );
}

export default Sangweet;