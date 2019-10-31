import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { HashRouter as Router } from "react-router-dom";
import * as Sentry from "@sentry/browser";
import App from "./App";
import { name, version } from "../package.json";

Sentry.init({
  dsn: "https://497cb833875a4878bde917feca867683@sentry.jcbel.com/42",
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
  release: `${name.replace("@", "")}@${version}`
});

ReactDOM.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
