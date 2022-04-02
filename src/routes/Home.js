import { useState, useEffect } from "react";
import { dbService, dbFunction } from "fbase";
import Sangweet from "component/Sangweet";
import SangweetFactory from "component/SangweetFactory";

const Home = ({ userObj }) => {
  const { query, collection, onSnapshot, orderBy } = dbFunction;
  const [sangweets, setSangweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "sangweets"),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setSangweets(newArray);
    });
  }, []);

  return (
    <div className="container">
      <SangweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {sangweets.map((sangweet) => {
          return (
            <Sangweet
              key={sangweet.id}
              sangweetObj={sangweet}
              isOwner={sangweet.creatorId === userObj.uid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
