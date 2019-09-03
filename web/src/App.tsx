import React from "react";
import styled from "@emotion/styled";
import { Route } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "./components/Loading";

const GPSInspector = Loadable({
  loader: () => import("./pages/GPSInspector"),
  loading: Loading
});

export const App = () => (
  <Container>
    <Route path="/gps-inspector" component={GPSInspector} />
    <Route path="/gps/inspector" component={GPSInspector} />
  </Container>
);

export default App;

const Container = styled.div``;
