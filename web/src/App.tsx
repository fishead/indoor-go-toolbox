import React, { useState, useCallback } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "./components/Loading";
import { AppContext } from "./AppContext";

const SatelliteLocationInspector = Loadable({
  loader: () => import("./pages/SatelliteLocationInspector"),
  loading: Loading
});

const jcmapTokenStorageKey = "jcmap_token";

export const App = () => {
  const [jcmapToken, setJcmapToken] = useState<string | null | undefined>(
    window.localStorage.getItem(jcmapTokenStorageKey)
  );

  const saveJcmapToken = useCallback((token: string) => {
    setJcmapToken(token);
    window.localStorage.setItem(jcmapTokenStorageKey, token);
  }, []);

  return (
    <AppContext.Provider value={{ jcmapToken, setJcmapToken: saveJcmapToken }}>
      <Switch>
        <Route
          path="/satellite-location-inspector"
          component={SatelliteLocationInspector}
        />
        <Route path="*">
          <Menu />
        </Route>
      </Switch>
    </AppContext.Provider>
  );
};

export default App;

function Menu() {
  return (
    <ul>
      <li>
        <Link to="/satellite-location-inspector">卫星定位测试</Link>
      </li>
    </ul>
  );
}
