import React, { useCallback, useMemo, useState, FC, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Helmet from "react-helmet";
import { Route, RouteComponentProps } from "react-router-dom";
import Loadable from "react-loadable";
import Loading from "../../components/Loading";
import Toolbar from "@material-ui/core/Toolbar";
import { reducer, defaultState } from "./reducer";
import {
  changeEnableHighAccuracy,
  changeMaximumAge,
  changeTimeout,
  clearResults,
  startGetCurrentPosition,
  getRawPositionSuccess,
  getRawPositionError,
  getKalmanFilterPositionSuccess
} from "./actions";
import PositionOnMap from "./PositionOnMap";
import PositionOptionsConfig from "./PositionOptionsConfig";
import style from "./index.module.css";
import { LowPassFilter } from "../../utilities";
import { GCJ02Filter } from "./GCJ02Filter";
import { GPSKalmanFilter } from "./GPSKalmanFilter";

const Report = Loadable({
  loader: () => import("./Report"),
  loading: Loading
});

export const SatelliteLocationInspector: FC<RouteComponentProps> = props => {
  const geolocation = useMemo(() => window.navigator.geolocation, []);

  const [state, dispatch] = useReducer(reducer, defaultState as any);

  const lowPassFilter = useMemo(() => {
    return new LowPassFilter<Position>({
      cutoff: 999999,
      frequencyPluck: pos => pos.coords.accuracy
    });
  }, []);

  const gcj02Filter = useMemo(() => {
    return new GCJ02Filter();
  }, []);

  const kalmanFilter = useMemo(() => {
    return new GPSKalmanFilter({
      processNoise: 20
    });
  }, []);

  const handleGeoLocationError = useCallback(err => {
    dispatch(getRawPositionError(err));
  }, []);

  const handlePositionChange = useCallback(
    (source: "getCurrentPosition" | "watchPosition", pos: Position) => {
      const p1 = lowPassFilter.process(pos);
      const p2 = p1 && gcj02Filter.process(p1);
      if (p2) {
        dispatch(getRawPositionSuccess({ source, position: p2 }));
      }

      const p3 = p2 && kalmanFilter.process(p2);
      if (p3) {
        if (p2) {
          dispatch(
            getKalmanFilterPositionSuccess({
              source,
              position: p3
            })
          );
        }
      }
    },
    [gcj02Filter, kalmanFilter, lowPassFilter]
  );

  const getCurrentPosition = useCallback(() => {
    if (state.waitingLocation) {
      return;
    }

    dispatch(startGetCurrentPosition());
    geolocation.getCurrentPosition(
      pos => handlePositionChange("getCurrentPosition", pos),
      handleGeoLocationError,
      state.positionOptions
    );
  }, [
    geolocation,
    handleGeoLocationError,
    handlePositionChange,
    state.positionOptions,
    state.waitingLocation
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [watchId, setWatchId] = useState();
  const startWatchLocation = useCallback(() => {
    if (watchId) {
      setSnackbarOpen(true);
      return;
    }

    setWatchId(
      geolocation.watchPosition(
        pos => handlePositionChange("watchPosition", pos),
        handleGeoLocationError,
        state.positionOptions
      )
    );
  }, [
    geolocation,
    handleGeoLocationError,
    handlePositionChange,
    state.positionOptions,
    watchId
  ]);

  const stopWatchLocation = useCallback(() => {
    setSnackbarOpen(isSnackbarOpen =>
      isSnackbarOpen ? false : isSnackbarOpen
    );

    if (watchId) {
      geolocation.clearWatch(watchId);
      setWatchId(undefined);
    }

    kalmanFilter.reset();
  }, [geolocation, kalmanFilter, watchId]);

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

  const mockPosition = useCallback(
    (pos: Position) => {
      dispatch(
        getRawPositionSuccess({ source: "watchPosition", position: pos })
      );

      const p3 = kalmanFilter.process(pos);
      if (p3) {
        dispatch(
          getKalmanFilterPositionSuccess({
            source: "watchPosition",
            position: p3
          })
        );
      }
    },
    [kalmanFilter]
  );

  if (!geolocation) {
    return <Paper>地理位置服务不可用</Paper>;
  }

  return (
    <>
      <form className={style.container}>
        <Helmet>
          <title>浏览器 GPS 定位测试</title>
        </Helmet>

        <PositionOptionsConfig
          onEnableHighAccuracyChange={v => {
            dispatch(changeEnableHighAccuracy(v));
          }}
          onMaximumAgeChange={v => {
            dispatch(changeMaximumAge(v));
          }}
          onTimeoutChange={v => {
            dispatch(changeTimeout(v));
          }}
        />

        <div className={style.data_container}>
          <div className={[style.data_item, style.data_item_raw].join(" ")}>
            Raw
          </div>
          <div
            className={[style.data_item, style.data_item_kalman_filter].join(
              " "
            )}
          >
            Kalman Filter
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
            rawPositions={state.rawPositions}
            kalmanFilterPositions={state.kalmanFilterPositions}
            cartogramId={selectedCartogramId}
            onSelectCartogramId={setSelectedCartogramId}
            mockPosition={mockPosition}
          />
        )}
      />
    </>
  );
};

export default SatelliteLocationInspector;
