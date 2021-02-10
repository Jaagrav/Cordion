import React, { useEffect } from "react";

import "./style/index.css";

import CordionLogo from "../../../../assets/branding/cordion-logo.png";

function EditorPlaceholder() {
  useEffect(() => {
    document.title = "Cordion";
  }, [window.location.href]);

  return (
    <div className="editor-placeholder">
      <img src={CordionLogo} alt="cordion logo" className="cordion-logo" />
      <div className="description">
        Write and Edit your notes and access them from any device. <br />
        <br /> Press the + button to create a new file or tap on one of your
        files on the left side.
      </div>
    </div>
  );
}

export default EditorPlaceholder;
