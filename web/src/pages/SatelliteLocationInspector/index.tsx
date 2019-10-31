import React, { useCallback, useMemo, useState, FC, useReducer } from "react";
import Button from "@material-ui/core/button";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Helmet from "react-helmet";
import { Route, RouteComponentProps } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "../../components/Loading";
import Toolbar from "@material-ui/core/Toolbar";
import { reducer, defaultState } from "./reducer";
import {
  ChangeEnableHighAccuracyActionPayload,
  ChangeMaximumAgeActionPayload,
  ChangeTimeoutActionPayload
} from "./types";
import {
  changeEnableHighAccuracy,
  changeMaximumAge,
  changeTimeout,
  clearResults,
  startGetCurrentPosition,
  getPositionSuccess,
  getPositionError
} from "./actions";
import PositionOnMap from "./PositionOnMap";

const Report = Loadable({
  loader: () => import("./Report"),
  loading: Loading
});

const enableHighAccuracyOptions: {
  name: string;
  value: ChangeEnableHighAccuracyActionPayload["select"];
}[] = [
  {
    name: "默认值",
    value: "default"
  },
  {
    name: "true",
    value: "true"
  },
  {
    name: "false",
    value: "false"
  }
];

const maximumAgeOptions: {
  name: string;
  value: ChangeMaximumAgeActionPayload["select"];
}[] = [
  {
    name: "默认值",
    value: "default"
  },
  {
    name: "POSITIVE INFINITY",
    value: "positive-infinity"
  },
  {
    name: "Custom",
    value: "custom"
  }
];

export const SatelliteLocationInspector: FC<RouteComponentProps> = props => {
  const geolocation = useMemo(() => window.navigator.geolocation, []);

  const [state, dispatch] = useReducer(reducer, defaultState as any);

  const getCurrentPosition = useCallback(() => {
    if (state.waitingLocation) {
      return;
    }
    dispatch(startGetCurrentPosition());
    geolocation.getCurrentPosition(
      pos =>
        dispatch(
          getPositionSuccess({ source: "getCurrentPosition", position: pos })
        ),
      err => dispatch(getPositionError(err)),
      state.form.positionOptions
    );
  }, [geolocation, state.form.positionOptions, state.waitingLocation]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [watchId, setWatchId] = useState();
  const startWatchLocation = useCallback(() => {
    if (watchId) {
      setSnackbarOpen(true);
      return;
    }

    setWatchId(
      geolocation.watchPosition(
        pos =>
          dispatch(
            getPositionSuccess({ source: "watchPosition", position: pos })
          ),
        err => dispatch(getPositionError(err)),
        state.form.positionOptions
      )
    );
  }, [geolocation, state.form.positionOptions, watchId]);

  const stopWatchLocation = useCallback(() => {
    setSnackbarOpen(isSnackbarOpen =>
      isSnackbarOpen ? false : isSnackbarOpen
    );
    if (watchId) {
      geolocation.clearWatch(watchId);
      setWatchId(undefined);
    }
  }, [geolocation, watchId]);

  const showCharts = useCallback(() => {
    props.history.push({
      pathname: props.match.path + "/charts"
    });
  }, [props.history, props.match.path]);

  const showOnMap = useCallback(() => {
    props.history.push({
      pathname: props.match.path + "/map"
    });
  }, [props.history, props.match.path]);

  const [selectedCartogramId, setSelectedCartogramId] = useState<string>("");

  if (!geolocation) {
    return <Paper>地理位置服务不可用</Paper>;
  }

  return (
    <>
      <form
        style={{
          padding: "2px 4px",
          backgroundColor: "white"
        }}
      >
        <Helmet>
          <title>浏览器 GPS 定位测试</title>
        </Helmet>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <FormControl style={{ flex: 1 }}>
            <InputLabel htmlFor="enable-high-accuracy">
              Enable High Accuracy
            </InputLabel>
            <Select
              value={state.form.enableHighAccuracyField.select}
              onChange={evt =>
                dispatch(
                  changeEnableHighAccuracy({
                    select: evt.target
                      .value as ChangeEnableHighAccuracyActionPayload["select"]
                  })
                )
              }
              input={
                <Input
                  id="enable-high-accuracy"
                  value={state.form.enableHighAccuracyField.select}
                />
              }
            >
              {enableHighAccuracyOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <FormControl style={{ width: "30%" }}>
              <InputLabel htmlFor="maximum-age">Maximum Age</InputLabel>
              <Select
                value={state.form.maximumAgeField.select}
                onChange={evt =>
                  dispatch(
                    changeMaximumAge({
                      select: evt.target
                        .value as ChangeMaximumAgeActionPayload["select"],
                      input: state.form.maximumAgeField.input
                    })
                  )
                }
                input={
                  <Input
                    id="maximum-age"
                    value={state.form.maximumAgeField.select}
                  />
                }
              >
                {maximumAgeOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ width: "64%" }}>
              <TextField
                type="number"
                label="Custom"
                value={state.form.maximumAgeField.input}
                onChange={evt =>
                  dispatch(
                    changeMaximumAge({
                      select: "custom",
                      input: evt.target.value
                    })
                  )
                }
                disabled={state.form.maximumAgeField.select !== "custom"}
              />
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <FormControl style={{ width: "30%" }}>
              <InputLabel htmlFor="timeout">Timeout</InputLabel>
              <Select
                value={state.form.timeoutField.select}
                onChange={evt =>
                  dispatch(
                    changeTimeout({
                      select: evt.target
                        .value as ChangeTimeoutActionPayload["select"],
                      input: state.form.timeoutField.input
                    })
                  )
                }
                input={
                  <Input id="timeout" value={state.form.timeoutField.select} />
                }
              >
                {maximumAgeOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl style={{ width: "64%" }}>
              <TextField
                type="number"
                label="Custom"
                value={state.form.timeoutField.input}
                onChange={evt =>
                  dispatch(
                    changeTimeout({
                      select: "custom",
                      input: evt.target.value
                    })
                  )
                }
                disabled={state.form.timeoutField.select !== "custom"}
              />
            </FormControl>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px"
          }}
        >
          <Button
            onClick={() => getCurrentPosition()}
            disabled={state.waitingLocation}
          >
            {state.waitingLocation && <CircularProgress size={24} />}Get Current
            Location
          </Button>
          <Button onClick={() => startWatchLocation()}>
            {watchId && <CircularProgress size={24} />}Start Watch Location
          </Button>
          <Button onClick={() => stopWatchLocation()}>
            Stop Watch Location
          </Button>
        </div>

        <div style={{ position: "relative" }}>
          {state.results && (
            <Toolbar style={{ justifyContent: "center", textAlign: "center" }}>
              <Button onClick={() => dispatch(clearResults())}>Clear</Button>
              <Button onClick={() => showCharts()}>Charts</Button>
              <Button onClick={() => showOnMap()}>Map</Button>
            </Toolbar>
          )}

          <div
            style={{
              height: "100%",
              maxHeight: "calc(100vh - 108px)",
              overflow: "auto"
            }}
          >
            <pre>{state.results}</pre>
          </div>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="stop watch first"
      />

      <Route
        path={props.match.path + "/charts"}
        render={routeProps => (
          <Report {...routeProps} statistic={state.statistic} />
        )}
      />

      <Route
        path={props.match.path + "/map"}
        render={routeProps => (
          <PositionOnMap
            open={!!routeProps.match}
            {...routeProps}
            locations={state.locations}
            cartogramId={selectedCartogramId}
            onSelectCartogramId={setSelectedCartogramId}
          />
        )}
      />
    </>
  );
};

export default SatelliteLocationInspector;
