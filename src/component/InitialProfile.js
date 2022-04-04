import { useState } from "react";
import { authService, fbFunction } from "fbase";
import userImg from "img/user.png";
import "style/InitialProfile.css";

const InitialProfile = ({ userObj, refreshUser }) => {
  const { updateProfile } = fbFunction;
  const [value, setValue] = useState("");

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (value) {
      await updateProfile(authService.currentUser, {
        displayName: value,
      })
        .then(() => {
          console.log("profile update!");
        })
        .catch((error) => {
          console.log("there is error!");
        });

      refreshUser();
    }
  };

  return (
    <section className="initialProfileWrap">
      <div className="initialProfileContainer">
        <img src={userImg} alt="prfoileImage" />
        <div className="nicknameValue">Hi~ {value}</div>
        <form onSubmit={onSubmit} className="setNickName">
          <input
            className="inputNickname"
            type="text"
            value={value}
            onChange={onChange}
            autoFocus
            placeholder="input your name"
          />
          <input
            className="inputSubmit"
            type="submit"
            value="Enjoy Sangwiitter!"
          />
        </form>
      </div>
    </section>
  );
};

export default InitialProfile;
