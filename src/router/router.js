import React from "react";
import { Route } from "react-router-dom";
import App from "../components/App";
import City from "../components/City";
import Header from "../header";

class ReactRouter extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Route exact path="/" component={App} />
        <Route  path="/cities/:slug" component={City} />
      </React.Fragment>
    );
  }
}

export default ReactRouter;
