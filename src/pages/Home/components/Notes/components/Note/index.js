import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import "./style/index.css";

import { Delete } from "@material-ui/icons";

import { db, auth } from "../../../../../../firebase";

import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss";

function Note({ path, searchFilter }) {
  const [uid, setUID] = useState(""),
    [selected, setSelected] = useState(false),
    [title, setTitle] = useState(""),
    [lastEdited, setLastEdited] = useState(""),
    [show, setShow] = useState(true),
    [deleted, setDeleted] = useState(false);
  const history = useHistory();

  const deleteNote = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#fff",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");

        db.child(uid).child(path.substring(1)).set(null);
        history.replace("/");
        setDeleted(true);
      }
    });
  };

  useEffect(() => {
    if (window.location.pathname === path) setSelected(true);
    else setSelected(false);

    history.listen((loc) => {
      if (loc.pathname === path) setSelected(true);
      else setSelected(false);
    });

    return auth.onAuthStateChanged((currentUser) => {
      db.child(currentUser.uid)
        .child(path.substring(1))
        .on("value", (snap) => {
          setUID(currentUser.uid);
          if (snap?.val()?.title) setTitle(snap.val().title);
          if (snap?.val()?.lastEdited) setLastEdited(snap.val().lastEdited);
        });
    });
  }, []);

  useEffect(() => {
    // console.log(
    //   searchFilter,
    //   title.toLowerCase().includes(searchFilter.toLowerCase())
    // );
    setShow(title.toLowerCase().includes(searchFilter.toLowerCase()));
  }, [searchFilter]);

  return (
    <div>
      {selected ? (
        <div
          className={selected ? "Note selected" : "Note"}
          style={{ display: show && !deleted ? "grid" : "none" }}
        >
          <div className="note-info">
            <div className="note-title">{title}</div>
            <div className="note-lastEdited">Last Edited: {lastEdited}</div>
          </div>
          <div className="icon" onClick={deleteNote}>
            <Delete />
          </div>
        </div>
      ) : (
        <Link to={path}>
          <div
            className={selected ? "Note selected" : "Note"}
            style={{ display: show && !deleted ? "grid" : "none" }}
          >
            <div className="note-info">
              <div className="note-title">{title}</div>
              <div className="note-lastEdited">Last Edited: {lastEdited}</div>
            </div>
            <div className="icon">
              <Delete />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Note;
