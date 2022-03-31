import { dbService, dbFunction, storageService, storageFunction } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Sangweet = ({sangweetObj, isOwner}) =>{
    const [editing, setEditing] = useState(false);
    const [newSangweet, setNewSangweet] = useState(sangweetObj.text);

    const onDeleteClick = async() => {
        const ok = window.confirm("삭제하시겠습니까?");
        console.log(ok);
        if(ok){
            // console.log(sangweetObj.id);
            await dbFunction.deleteDoc(dbFunction.doc(dbService,`sangweets/${sangweetObj.id}`));
            // console.log(data); 
            if(sangweetObj.attachmentUrl !==""){
                await storageFunction.deleteObject(storageFunction.ref(storageService,sangweetObj.attachmentUrl)).then(() => {
                    console.log("image delete successfully!")
                  }).catch((error) => {
                    console.log("Threr is an error during delete image");
                    console.log(error);
                  });
            }
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
        <div className="nweet">
            {editing?(
                <>
                    <form onSubmit={onSubmit} className="conatiner nweetEdit">
                        <input onChange={onChange} value={newSangweet} required placeholder="Edit your sangweet" autoFocus className="formInput"/>
                        <input type="submit" value="Update Sangweet" className="formBtn"/>
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </>
            ):(
                <>
            <h4>{sangweetObj.text}</h4>
            {sangweetObj.attachmentUrl && (<img src={sangweetObj.attachmentUrl} width="50px" height="50px" alt="SangweetImg"/>)}
            {isOwner &&(
                <div className="nweet__actions">
                    <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash}/></span>
                    <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt}/></span>
                </div>
            )}
            </>
            )}
        </div>
    );
}

export default Sangweet;