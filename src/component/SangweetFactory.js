import { useState } from "react";
import { dbService, dbFunction, storageFunction, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import "style/SangweetFactory.css";

const SangweetFactory = ({ userObj }) => {
  const { ref, uploadString, getDownloadURL } = storageFunction;
  const { addDoc, collection } = dbFunction;
  const [sangweet, setSangweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sangweet === "") {
      return;
    }
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      await uploadString(attachmentRef, attachment, "data_url").then(
        (snapshot) => {
          console.log("Uploaded a data_url string!");
        }
      );
      attachmentUrl = await getDownloadURL(attachmentRef);
      console.log("success upload image!");
    }
    await addDoc(collection(dbService, "sangweets"), {
      text: sangweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    });
    setSangweet("");
    setAttachment("");
  };

  const onChange = (evnet) => {
    evnet.preventDefault();
    const {
      target: { value },
    } = evnet;
    setSangweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={sangweet}
          onChange={onChange}
          type="text"
          placeholder="what's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
      {/* <input type="submit" value="Sangweet"/> */}
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{ backgroundImage: attachment }}
            alt="img"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          {/* <button onClick={onClearAttachment}>Clear</button> */}
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
