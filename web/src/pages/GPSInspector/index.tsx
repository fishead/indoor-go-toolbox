import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  FC,
  useReducer
} from "react";
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
import { Statistic as ReportStatistic } from "./Report";
import { propOr } from "ramda";
import sortBy from "ramda/es/sortBy";

const Report = Loadable({
  loader: () => import("./Report"),
  loading: Loading
});

interface EnableHighAccuracyChangeAction {
  type: "enable-high-accuracy-change";
  payload: {
    select: "default" | "true" | "false";
  };
}
interface MaximumAgeChangeAction {
  type: "maximum-age-change";
  payload: {
    select: "default" | "positive-infinity" | "custom";
    input: string;
  };
}
interface TimeoutChangeAction {
  type: "timeout-change";
  payload: {
    select: "default" | "positive-infinity" | "custom";
    input: string;
  };
}
type PositionOptionsChangeAction =
  | EnableHighAccuracyChangeAction
  | MaximumAgeChangeAction
  | TimeoutChangeAction;

const enableHighAccuracyOptions: {
  name: string;
  value: EnableHighAccuracyChangeAction["payload"]["select"];
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
  value: MaximumAgeChangeAction["payload"]["select"];
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

interface Statistic extends ReportStatistic {
  raw: {
    [key: number]: ReportStatistic["data"][0];
  };
}

export const GPSInspector: FC<RouteComponentProps> = props => {
  const geolocation = useMemo(() => window.navigator.geolocation, []);

  const [results, setResults] = useState("");
  const defaultStatistic: Statistic = {
    successCount: 0,
    errorCount: 0,
    data: [],
    raw: {}
  };
  const [statistic, setStatistic] = useState<Statistic>(defaultStatistic);

  const clearResults = useCallback(() => {
    setResults("");
    setStatistic(defaultStatistic);
  }, [defaultStatistic]);

  const updateStatistic = useCallback(
    (posOrError: Position | PositionError) => {
      setStatistic(prevStatistic => {
        if ((posOrError as PositionError).message) {
          return {
            ...prevStatistic,
            errorCount: prevStatistic.errorCount + 1
          };
        }

        const {
          coords: { accuracy }
        } = posOrError as Position;
        const formattedAccuracy = Math.round(accuracy);

        const prevAccuracyStatistic: Statistic["raw"] extends {
          [key: number]: infer D;
        }
          ? D
          : never = propOr(
          { accuracy: formattedAccuracy, count: 0 },
          formattedAccuracy.toString(),
          prevStatistic.raw
        );
        const nextAccuracyStatistic: Statistic["raw"] extends {
          [key: number]: infer D;
        }
          ? D
          : never = {
          accuracy: formattedAccuracy,
          count: prevAccuracyStatistic.count + 1
        };
        const nextRaw: Statistic["raw"] = {
          ...prevStatistic.raw,
          [formattedAccuracy]: nextAccuracyStatistic
        };
        return {
          ...prevStatistic,
          successCount: prevStatistic.successCount + 1,
          data: sortBy(d => d.accuracy, Object.values(nextRaw)),
          raw: nextRaw
        };
      });
    },
    []
  );

  const successCallback: PositionCallback = useCallback(
    pos => {
      setResults(content => `${stringifyPosition(pos)}\n\n${content}`);
      updateStatistic(pos);
    },
    [updateStatistic]
  );
  const errorCallback: PositionErrorCallback = useCallback(
    err => {
      setResults(content => content + err.message + "\n\n");
      updateStatistic(err);
    },
    [updateStatistic]
  );

  interface State {
    positionOptions: PositionOptions;
    enableHighAccuracy: EnableHighAccuracyChangeAction["payload"];
    maximumAge: MaximumAgeChangeAction["payload"];
    timeout: TimeoutChangeAction["payload"];
  }
  const [state, dispatch] = useReducer(
    (state: State, action: PositionOptionsChangeAction): State => {
      const { type, payload } = action;
      switch (type) {
        case "enable-high-accuracy-change":
          const enableHighAccuracyPayload = payload as EnableHighAccuracyChangeAction["payload"];
          const {
            select: enableHighAccuracySelect
          } = enableHighAccuracyPayload;
          if (enableHighAccuracySelect === "true") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                enableHighAccuracy: true
              },
              enableHighAccuracy: enableHighAccuracyPayload
            };
          } else if (enableHighAccuracySelect === "false") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                enableHighAccuracy: false
              },
              enableHighAccuracy: enableHighAccuracyPayload
            };
          }
          return {
            ...state,
            positionOptions: {
              ...state.positionOptions,
              enableHighAccuracy: undefined
            },
            enableHighAccuracy: enableHighAccuracyPayload
          };
        case "maximum-age-change":
          const maximumAgePayload = payload as MaximumAgeChangeAction["payload"];
          const {
            select: maximumAgeSelect,
            input: maximumAgeInput
          } = maximumAgePayload;
          if (maximumAgeSelect === "custom") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                maximumAge: Number(maximumAgeInput)
              },
              maximumAge: maximumAgePayload
            };
          } else if (maximumAgeSelect === "positive-infinity") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                maximumAge: Number.POSITIVE_INFINITY
              },
              maximumAge: maximumAgePayload
            };
          }
          return {
            ...state,
            positionOptions: {
              ...state.positionOptions,
              maximumAge: undefined
            },
            maximumAge: maximumAgePayload
          };
        case "timeout-change":
          const timeoutPayload = payload as TimeoutChangeAction["payload"];
          const { select: timeoutSelect, input: timeoutInput } = timeoutPayload;
          if (timeoutSelect === "custom") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                timeout: Number(timeoutInput)
              },
              timeout: timeoutPayload
            };
          } else if (timeoutSelect === "positive-infinity") {
            return {
              ...state,
              positionOptions: {
                ...state.positionOptions,
                timeout: Number.POSITIVE_INFINITY
              },
              timeout: timeoutPayload
            };
          }
          return {
            ...state,
            positionOptions: {
              ...state.positionOptions,
              timeout: undefined
            },
            timeout: timeoutPayload
          };
        default:
          return state;
      }
    },
    {
      positionOptions: {
        enableHighAccuracy: undefined,
        maximumAge: undefined,
        timeout: undefined
      },
      enableHighAccuracy: {
        select: "default"
      },
      maximumAge: {
        select: "default",
        input: ""
      },
      timeout: {
        select: "default",
        input: ""
      }
    },
    args => args
  );

  const [waitingLocation, setWaitingLocation] = useState(false);
  const getCurrentPosition = useCallback(() => {
    if (waitingLocation) {
      return;
    }
    setWaitingLocation(true);
    geolocation.getCurrentPosition(
      pos => {
        successCallback(pos);
        setWaitingLocation(false);
      },
      err => {
        errorCallback(err);
        setWaitingLocation(false);
      },
      state.positionOptions
    );
  }, [
    errorCallback,
    geolocation,
    state.positionOptions,
    successCallback,
    waitingLocation
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
        successCallback,
        errorCallback,
        state.positionOptions
      )
    );
  }, [
    errorCallback,
    geolocation,
    state.positionOptions,
    successCallback,
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
  }, [geolocation, watchId]);

  const showCharts = useCallback(() => {
    props.history.push({
      pathname: props.match.path + "/report"
    });
  }, [props.history, props.match.path]);

  if (!geolocation) {
    return <Paper>地理位置服务不可用</Paper>;
  }

  return (
    <Fragment>
      <form
        style={{
          padding: "2px 4px"
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
              value={state.enableHighAccuracy.select}
              onChange={evt =>
                dispatch({
                  type: "enable-high-accuracy-change",
                  payload: {
                    select: evt.target
                      .value as EnableHighAccuracyChangeAction["payload"]["select"]
                  }
                })
              }
              input={
                <Input
                  id="enable-high-accuracy"
                  value={state.enableHighAccuracy.select}
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
                value={state.maximumAge.select}
                onChange={evt =>
                  dispatch({
                    type: "maximum-age-change",
                    payload: {
                      select: evt.target
                        .value as MaximumAgeChangeAction["payload"]["select"],
                      input: state.maximumAge.input
                    }
                  })
                }
                input={
                  <Input id="maximum-age" value={state.maximumAge.select} />
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
                value={state.maximumAge.input}
                onChange={evt =>
                  dispatch({
                    type: "maximum-age-change",
                    payload: {
                      select: "custom",
                      input: evt.target.value
                    }
                  })
                }
                disabled={state.maximumAge.select !== "custom"}
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
                value={state.timeout.select}
                onChange={evt =>
                  dispatch({
                    type: "timeout-change",
                    payload: {
                      select: evt.target
                        .value as TimeoutChangeAction["payload"]["select"],
                      input: state.timeout.input
                    }
                  })
                }
                input={<Input id="timeout" value={state.timeout.select} />}
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
                value={state.timeout.input}
                onChange={evt =>
                  dispatch({
                    type: "timeout-change",
                    payload: {
                      select: "custom",
                      input: evt.target.value
                    }
                  })
                }
                disabled={state.timeout.select !== "custom"}
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
            disabled={waitingLocation}
          >
            {waitingLocation && <CircularProgress size={24} />}Get Current
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
          {results && (
            <Toolbar style={{ justifyContent: "center", textAlign: "center" }}>
              <Button onClick={() => clearResults()}>Clear</Button>
              <Button onClick={() => showCharts()}>Charts</Button>
            </Toolbar>
          )}

          <div
            style={{
              height: "100%",
              maxHeight: "calc(100vh - 108px)",
              overflow: "auto"
            }}
          >
            <pre>{results}</pre>
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
        path={props.match.path + "/report"}
        render={routeProps => <Report {...routeProps} statistic={statistic} />}
      />
    </Fragment>
  );
};

export default GPSInspector;

function stringifyPosition(pos: Position) {
  return `timestamp: ${pos.timestamp}
time: ${new Date(pos.timestamp).toLocaleString()}
accuracy: ${pos.coords.accuracy}
latitude: ${pos.coords.latitude}
longitude: ${pos.coords.longitude}
altitude: ${pos.coords.altitude}
altitudeAccuracy: ${pos.coords.altitudeAccuracy}
heading: ${pos.coords.heading}
speed: ${pos.coords.speed}`;
}
