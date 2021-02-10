import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import "./style/index.css";

import { AddRounded, Search } from "@material-ui/icons";

import { db, auth } from "../../../../firebase";

import Note from "./components/Note";
import AuthDialog from "../../../../components/AuthDialog";

function Notes() {
  const history = useHistory();
  const [uid, setUID] = useState(""),
    [notes, setNotes] = useState([]),
    [searchText, setSearchText] = useState(""),
    [showAddBtn, setShowAddBtn] = useState(true),
    [showAuthDialog, setShowAuthDialog] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUID(currentUser.uid);
      db.child(currentUser.uid).on("child_added", (snap) => {
        setNotes((prevNotes) => [...prevNotes, snap.key]);
      });
    });
  }, []);

  useEffect(() => {
    if (history.location.pathname.substring(1) && window.innerWidth < 576)
      setShowAddBtn(false);
    else setShowAddBtn(true);
  }, [window.location.href, window.innerWidth]);

  const date = new Date();
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let lastEdited = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${
    date.getMinutes() < 10 ? "0" : ""
  }${date.getMinutes()}, ${date.getDate()} ${
    month[date.getMonth()]
  } ${date.getFullYear()}`;

  const createNewNote = () => {
    if (uid)
      db.child(uid)
        .push()
        .then((snap) => {
          db.child(uid).child(snap.key).set({
            title: "Untitled",
            editorData: "",
            lastEdited: lastEdited,
          });
        });
    else setShowAuthDialog(true);
  };

  return (
    <>
      <div className="Notes">
        <div className="body">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
          <div className="notes-list">
            {notes.map((note) => (
              <Note path={`/${note}`} key={note} searchFilter={searchText} />
            ))}
            {notes.length === 0 && (
              <div className="no-notes">
                Looks like you don't have any notes, simply press on the add
                button to create a new file!
              </div>
            )}
          </div>
        </div>
        <div
          className="add-btn"
          onClick={createNewNote}
          style={{ display: showAddBtn ? "inline-flex" : "none" }}
        >
          <AddRounded className="icon" />
        </div>
      </div>
      <AuthDialog open={showAuthDialog} setShowAuthDialog={setShowAuthDialog} />
    </>
  );
}

export default Notes;
