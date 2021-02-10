import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";

function Navigator() {
  return (
    <Router>
      <Switch>
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Home} />
        <Route exact path="/:cordionID" component={Home} />
      </Switch>
    </Router>
  );
}

export default Navigator;
