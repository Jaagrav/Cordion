import React, { useState, useEffect } from "react";

import "./style/index.css";

import CodeIcon from "@material-ui/icons/Code";
import FormatListNumberedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListBulletedIcon from "@material-ui/icons/FormatListNumbered";

import {
  Editor as NoteEditor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { IconButton, Button, ButtonGroup, Snackbar } from "@material-ui/core";
import { Alert as MuiAlert } from "@material-ui/lab";
import {
  FormatBoldRounded,
  FormatUnderlinedRounded,
  FormatItalicRounded,
  StrikethroughS,
  Share,
} from "@material-ui/icons";

import { db, auth } from "../../../../firebase";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Editor({ match }) {
  //Setting up firebase
  const [title, setTitle] = useState("Loading..."),
    [uid, setUID] = useState(""),
    [showSnackbar, setShowSnackbar] = useState(false);

  const copyShareableLink = () => {
    const copyTxt = document.createElement("input");
    copyTxt.value = `${window.location.origin}/view/${uid}/${match.params.cordionID}`;
    document.body.parentNode.appendChild(copyTxt);
    copyTxt.select();
    document.execCommand("copy");
    document.body.parentNode.removeChild(copyTxt);
    setShowSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  // Init editor
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

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    setTitle("Loading...");
    setEditorState(() => EditorState.createEmpty());
    return auth.onAuthStateChanged((currentUser) => {
      if (currentUser?.uid) setUID(currentUser.uid);
      if (currentUser)
        db.child(currentUser.uid)
          .child(match.params.cordionID)
          .once("value")
          .then((snap) => {
            if (snap?.val()?.title) {
              setTitle(snap.val().title);
            }
            if (snap?.val()?.editorData)
              setEditorState(
                EditorState.createWithContent(
                  convertFromRaw(JSON.parse(snap.val().editorData))
                )
              );
          });
      else window.open("/", "_self");
    });
  }, [window.location.href]);

  useEffect(() => {
    // localStorage.setItem(
    //   "editorData",
    //   JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    // );
    if (title.trim() === "") setTitle("Untitled");

    document.title = `Cordion - ${title} (Editing)`;

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

    if (auth?.currentUser && title !== "Loading...")
      db.child(auth.currentUser.uid)
        .child(match.params.cordionID)
        .set({
          title: title,
          editorData: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
          lastEdited: lastEdited,
          user: {
            displayName: auth.currentUser.displayName,
            uid: auth.currentUser.uid,
            photoURL: auth.currentUser.photoURL,
            email: auth.currentUser.email,
          },
        });
  }, [title, editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const onCodeClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "CODE");
    setEditorState(newState);
  };

  const onBoldClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
    setEditorState(newState);
  };

  const onItalicClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "ITALIC");
    setEditorState(newState);
  };

  const onUnderlineClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
    setEditorState(newState);
  };

  const onStrikeClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleInlineStyle(editorState, "STRIKE");
    setEditorState(newState);
  };

  const onHeaderClick = (e, num) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(editorState, `header-${num}`);
    setEditorState(newState);
  };

  const onBlockQuoteClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(editorState, "blockquote");
    setEditorState(newState);
  };

  const onOLClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(
      editorState,
      "ordered-list-item"
    );
    setEditorState(newState);
  };

  const onULClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(
      editorState,
      "unordered-list-item"
    );
    setEditorState(newState);
  };

  const onCodeBlockClick = (e) => {
    e.preventDefault();
    const newState = RichUtils.toggleBlockType(editorState, "code-block");
    setEditorState(newState);
  };

  return (
    <>
      <div className="Editor">
        <div className="editor-title">
          <input
            type="text"
            className="input-title"
            placeholder="Title Here"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <IconButton title="Copy shareable link" onClick={copyShareableLink}>
            <Share />
          </IconButton>
        </div>
        <div className="editor-edit-btns">
          <ButtonGroup>
            <Button onMouseDown={(e) => onHeaderClick(e, "one")}>H1</Button>
            <Button onMouseDown={(e) => onHeaderClick(e, "two")}>H2</Button>
            <Button onMouseDown={(e) => onHeaderClick(e, "three")}>H3</Button>
          </ButtonGroup>
          <IconButton onMouseDown={onBoldClick}>
            <FormatBoldRounded />
          </IconButton>
          <IconButton onMouseDown={onItalicClick}>
            <FormatItalicRounded />
          </IconButton>
          <IconButton onMouseDown={onUnderlineClick}>
            <FormatUnderlinedRounded />
          </IconButton>
          <IconButton onMouseDown={onStrikeClick}>
            <StrikethroughS />
          </IconButton>
          <Button onMouseDown={onCodeClick}>Monospace</Button>
          <Button onMouseDown={onBlockQuoteClick}>Blockquote</Button>
          <Button onMouseDown={onULClick}>
            <FormatListBulletedIcon />
          </Button>
          <Button onMouseDown={onOLClick}>
            <FormatListNumberedIcon />
          </Button>
          <Button onMouseDown={onCodeBlockClick}>
            <CodeIcon />
          </Button>
        </div>
        <div className="editor">
          <NoteEditor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            customStyleMap={styleMap}
            placeholder="Type your notes in here..."
          />
        </div>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleClose} severity="success">
          Shareable Link has been copied successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

export default Editor;
