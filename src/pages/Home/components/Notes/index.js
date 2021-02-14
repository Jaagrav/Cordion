import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import "./style/index.css";

import { AddRounded, Search } from "@material-ui/icons";

import { db, auth } from "../../../../firebase";

import Note from "./components/Note";
import AuthDialog from "../../../../components/AuthDialog";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

function Notes() {
  const history = useHistory();
  const [uid, setUID] = useState(""),
    [notes, setNotes] = useState([]),
    [searchText, setSearchText] = useState(""),
    [showAddBtn, setShowAddBtn] = useState(true),
    [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser?.uid) {
        db.child(currentUser.uid)
          .once("value")
          .then((userData) => {
            db.child(currentUser.uid).on("value", (snap) => {
              let values = snap.val();
              let tempArr = [];

              if (values?.order) {
                tempArr = [...values.order];
                for (let note in values) {
                  if (
                    note !== "order" &&
                    (!values.order.includes(note) || !tempArr.includes(note))
                  )
                    tempArr.push(note);
                }
                setNotes(tempArr);
              }

              if (!values?.order) {
                for (let note in values) {
                  if (note !== "order") tempArr.push(note);
                }
                setNotes(tempArr);
              }
            });
          });
        setUID(currentUser.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (history.location.pathname.substring(1) && window.innerWidth < 576)
      setShowAddBtn(false);
    else setShowAddBtn(true);
  }, [window.location.href, window.innerWidth]);

  useEffect(() => {
    if (uid && notes.length) {
      db.child(uid).child("order").set(notes);
    }
  }, [notes]);

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

  const reorder = (e) => {
    if (e.source && e.destination) {
      let tempNotesArray = [...notes];
      const temp = tempNotesArray[e.source.index];
      tempNotesArray.splice(e.source.index, 1);
      tempNotesArray.splice(e.destination.index, 0, temp);
      setNotes(tempNotesArray);
    }
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
            <DragDropContext onDragEnd={reorder}>
              <Droppable droppableId="notes">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {notes.map((note, index) => (
                      <Note
                        path={`/${note}`}
                        key={note}
                        searchFilter={searchText}
                        index={index}
                        notes={notes}
                        setNotes={setNotes}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
