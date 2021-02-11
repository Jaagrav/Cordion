import React, { useState, useEffect } from "react";
import "./style/index.css";

import { useHistory } from "react-router-dom";

import {
  Editor as NoteEditor,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { IconButton } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import { db, auth } from "../../../../firebase";
import AuthDialog from "../../../../components/AuthDialog";

function NoteViewer({ match }) {
  const theirUID = match.params.uid,
    cordionID = match.params.cordionID,
    history = useHistory();
  const [thisUser, setThisUser] = useState(""),
    [displayName, setDisplayName] = useState(""),
    [email, setEmail] = useState(""),
    [title, setTitle] = useState(""),
    [lastEdited, setLastEdited] = useState(""),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty()),
    [showAuthDialog, setShowAuthDialog] = useState(false);

  const createCopy = () => {
    console.log("Creating copy...");
    if (thisUser?.uid)
      db.child(thisUser.uid)
        .push({
          title: title,
          editorData: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
          lastEdited: lastEdited,
          user: {
            displayName: thisUser.displayName,
            uid: thisUser.uid,
            photoURL: thisUser.photoURL,
            email: thisUser.email,
          },
        })
        .then((snap) => {
          history.push(`/${snap.key}`);
        });
    else setShowAuthDialog(true);
  };
  // Live Preview
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) setThisUser(currentUser);

      db.child(theirUID)
        .child(cordionID)
        .on("value", (snap) => {
          if (snap?.val()?.user?.displayName)
            setDisplayName(snap.val().user.displayName);
          if (snap?.val()?.user?.email) setEmail(snap.val().user.email);
          if (snap?.val()?.title) setTitle(snap.val().title);
          if (snap?.val()?.lastEdited) setLastEdited(snap.val().lastEdited);
          if (snap?.val()?.editorData)
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(snap.val().editorData))
              )
            );
        });
    });
  }, [window.location.href]);

  useEffect(() => {
    document.title = `Cordion - ${title} (Viewing)`;
  }, [title]);

  // Init Editor
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      fontFamily: "monospace",
      borderRadius: 4,
    },
    STRIKE: {
      textDecoration: "line-through",
    },
  };

  return (
    <>
      <div className="NoteViewer">
        <div className="file-title">
          <div className="display-title">{title}</div>
          <IconButton onClick={createCopy}>
            <Edit />
          </IconButton>
        </div>
        <div className="file-author-info">
          {displayName && (
            <span className="file-author">
              Last Edited by{" "}
              <a href={`mailto:${email}`} style={{ color: "black" }}>
                <b>{displayName}</b>
              </a>{" "}
              at {lastEdited}
            </span>
          )}
        </div>
        <div className="file-editor">
          <NoteEditor
            editorState={editorState}
            onChange={setEditorState}
            customStyleMap={styleMap}
            readOnly={true}
            placeholder="Type your notes in here..."
          />
        </div>
      </div>
      <AuthDialog open={showAuthDialog} setShowAuthDialog={setShowAuthDialog} />
    </>
  );
}

export default NoteViewer;
