import React, { useEffect, useRef } from "react";

import { Route, Switch } from "react-router-dom";

import Notes from "./components/Notes";
import Editor from "./components/Editor";
import EditorPlaceholder from "./components/EditorPlaceholder";
import NoteViewer from "./components/NoteViewer";

function Home({ match }) {
  const homepageRef = useRef();
  useEffect(() => {
    if (match.params.cordionID && window.innerWidth < 576)
      homepageRef.current.style.gridTemplateColumns = "0 1fr";
    else homepageRef.current.style.gridTemplateColumns = "1fr 0";

    if (window.innerWidth > 576)
      homepageRef.current.style.gridTemplateColumns =
        "350px calc(100% - 350px)";

    window.addEventListener("resize", () => {
      if (window.innerWidth > 576)
        homepageRef.current.style.gridTemplateColumns =
          "350px calc(100% - 350px)";
      else if (match.params.cordionID && window.innerWidth < 576)
        homepageRef.current.style.gridTemplateColumns = "0 1fr";
      else homepageRef.current.style.gridTemplateColumns = "1fr 0";
    });
  }, [window.location.href]);

  return (
    <div ref={homepageRef} className="home-page">
      <Notes />
      <Switch>
        <Route exact path="/" component={EditorPlaceholder} />
        <Route exact path="/view/:uid/:cordionID" component={NoteViewer} />
        <Route exact path="/:cordionID" component={Editor} />
      </Switch>
    </div>
  );
}

export default Home;
