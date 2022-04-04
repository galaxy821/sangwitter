import { authService, dbService, dbFunction, fbFunction } from "fbase";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Sangweet from "component/Sangweet";
import "style/Profile.css";

const Profile = ({ userObj, refreshUser }) => {
  const { updateProfile } = fbFunction;
  const { collection, query, where, getDocs, orderBy, onSnapshot } = dbFunction;
  const [mySangweets, setMySangweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();

  //console.log(userObj);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  //after rendering
  useEffect(() => {
    // getMySangweets();
    const q = query(
      collection(dbService, "sangweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setMySangweets(newArray);
    });
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (newDisplayName) {
      if (userObj.displayName !== newDisplayName) {
        await updateProfile(authService.currentUser, {
          displayName: newDisplayName,
        })
          .then(() => {
            console.log("profile update!");
          })
          .catch((error) => {
            console.log("there is error!");
          });
        refreshUser();
      }
    }
  };

  console.log(mySangweets);
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          placeholder="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      <div style={{ marginTop: 20 }}>
        {mySangweets.map((mySangweet) => {
          return (
            <Sangweet
              key={mySangweet.id}
              sangweetObj={mySangweet}
              isOwner={mySangweet.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
