import React, { useState, useEffect } from "react";

import "./style/index.css";

import ul from "../../../../assets/icons/unordered-list.png";
import ol from "../../../../assets/icons/numbered-list.png";
import code from "../../../../assets/icons/code-block.png";
import {
  Editor as NoteEditor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

import { IconButton, Button, ButtonGroup } from "@material-ui/core";
import {
  FormatBoldRounded,
  FormatUnderlinedRounded,
  FormatItalicRounded,
  StrikethroughS,
} from "@material-ui/icons";

import { db, auth } from "../../../../firebase";

function Editor({ match }) {
  //Setting up firebase
  const [title, setTitle] = useState("Loading...");

  // Setting up editor
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
    });
  }, [window.location.href]);

  useEffect(() => {
    // localStorage.setItem(
    //   "editorData",
    //   JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    // );
    if (title.trim() === "") setTitle("Untitled");

    document.title = `Cordion - ${title}`;

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
          <img src={ul} alt="UL" />
        </Button>
        <Button onMouseDown={onOLClick}>
          <img src={ol} alt="OL" />
        </Button>
        <Button onMouseDown={onCodeBlockClick}>
          <img src={code} alt="Code Block" />
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
  );
}

export default Editor;
