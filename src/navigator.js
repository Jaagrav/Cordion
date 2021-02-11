import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";

function Navigator() {
  return (
    <Router>
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Home} />
        <Route exact path="/view/:uid/:cordionID" component={Home} />
        <Route exact path="/:cordionID" component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default Navigator;
