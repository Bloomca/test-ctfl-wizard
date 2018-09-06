import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import ReactRouter from "./router/router";
import { init } from "contentful-wizard";

init({
  spaceId: "gwr2bryocotv",
  key: "1b084e7585e640e51efed3f4173a6a06070ed0cc96a220fbb3b794edb721339b",
  preview: true
});

ReactDOM.render(
  <Router>
    <ReactRouter />
  </Router>,
  document.getElementById("root")
);
