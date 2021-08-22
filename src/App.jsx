import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { Segment } from "semantic-ui-react";

import Part1 from "./components/Part1";
import Part2 from "./components/Part2";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="sider">
          <div className="part1">
            <Link to="/">Part 1</Link>
          </div>
          <div className="part2">
            <Link to="/part2">Part 2</Link>
          </div>
        </div>
        <Switch>
          <Route exact path="/">
            <Part1 />
          </Route>
          <Route path="/part2">
            <Part2 />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
