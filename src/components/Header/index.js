import React, { useState, useEffect } from "react";

import "./style/index.css";

import logo from "../../assets/branding/logo192.png";
import { IconButton, Avatar } from "@material-ui/core";

import AuthDialog from "../AuthDialog";

import { auth } from "../../firebase";

function Header() {
  const [showAuthDialog, setShowAuthDialog] = useState(true),
    [photoURL, setPhotoURL] = useState(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyrzeK7cLswnL6YC1rIwMisKdHUs3KWyqKcA&usqp=CAU"
    ),
    [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    // db.once("value").then((snap) => {
    //   console.log(snap.val());
    // });
    auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName);
        setPhotoURL(user.photoURL);
      } else {
        console.log("User not logged in...");
        setDisplayName("User");
        setPhotoURL(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyrzeK7cLswnL6YC1rIwMisKdHUs3KWyqKcA&usqp=CAU"
        );
      }
    });
  }, []);

  return (
    <>
      <div className="header">
        <img src={logo} alt="logo" className="branding-logo" />
        <span className="branding-name">CORDION</span>
        <IconButton onClick={() => setShowAuthDialog(true)}>
          <Avatar alt={displayName} src={photoURL} />
        </IconButton>
      </div>
      <AuthDialog open={showAuthDialog} setShowAuthDialog={setShowAuthDialog} />
    </>
  );
}

export default Header;
