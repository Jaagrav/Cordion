import React, { useState, useEffect } from "react";

import "./style/index.css";

import { Backdrop, IconButton } from "@material-ui/core";
import { ClearRounded } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import AuthIllustration from "../../assets/branding/auth_illustration.png";

import { firebase, auth } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
function AuthDialog({ open, setShowAuthDialog }) {
  const classes = useStyles();
  const [displayName, setDisplayName] = useState(""),
    [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((snap) => {
        setDisplayName(snap.displayName);
        setShowAuthDialog(false);
      })
      .catch((err) => {
        //In case log in cancels
      });
  };

  const logout = () => {
    auth.signOut();
    setShowAuthDialog(false);
    window.open("/", "_self");
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setDisplayName(user.displayName);
        setShowAuthDialog(false);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <Backdrop
      className={classes.backdrop}
      open={open}
      onClick={(e) => setShowAuthDialog(false)}
    >
      <div className="AuthDialog" onClick={(e) => e.stopPropagation()}>
        <div className="illustration">
          <img
            src={AuthIllustration}
            alt="Auth Illustration"
            className="auth_illustration"
          />
        </div>
        <div className="auth-info">
          <div className="exit-btn">
            <IconButton onClick={(e) => setShowAuthDialog(false)}>
              <ClearRounded className="icon" />
            </IconButton>
          </div>
          <div className="info">
            {isLoggedIn ? (
              <>
                <div className="title">Logout</div>
                <div className="details">
                  <b>{displayName}</b> once you log out, you won't be able to
                  use Cordion to create and edit your notes.
                </div>
                <div className="login-btn" onClick={logout}>
                  Log Out
                </div>
              </>
            ) : (
              <>
                <div className="title">Login</div>
                <div className="details">
                  Login to Cordion to gain access to your notes from other
                  devices.
                </div>
                <div className="login-btn" onClick={login}>
                  Log In With Google
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

export default AuthDialog;
