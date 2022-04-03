// import {useState} from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";
// import { useEffect, useState } from "react";

const AppRouter = ({
  isLoggedIn,
  userObj,
  refreshUser,
  isVerified,
  isPhotoURL,
}) => {
  console.log(
    "isLoggedIn, userObj,  isVerified :",
    isLoggedIn,
    userObj,
    isVerified
  );
  return (
    <Router>
      {isLoggedIn && isVerified && <Navigation userObj={userObj} />}
      <Switch>
        <>
          {isLoggedIn && isVerified ? (
            <div
              style={{
                maxWidth: 890,
                width: "100%",
                margin: "0 auto",
                marginTop: 80,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Route exact path="/">
                <Home userObj={userObj} />
              </Route>
              <Route exact path="/profile">
                <Profile userObj={userObj} refreshUser={refreshUser} />
              </Route>
            </div>
          ) : (
            <>
              {/* {isLoggedIn && isVerified ? (
                <Route exact path="/">
                  <>
                    <div>{isLoggedIn && isVerified}</div>
                  </>
                </Route>
              ) : (
                
              )} */}
              <Route exact path="/">
                <Auth
                  isVerified={isVerified}
                  isLoggedIn={isLoggedIn}
                  refreshUser={refreshUser}
                />
              </Route>
            </>
          )}
          {/* <Redirect from='*' to="/" /> */}
        </>
      </Switch>
    </Router>
  );
};

export default AppRouter;
