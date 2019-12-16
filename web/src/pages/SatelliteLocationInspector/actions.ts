import { createActionCreator } from "deox";

export const changeEnableHighAccuracy = createActionCreator(
  "enable-high-accuracy-change",
  resolve => (payload?: boolean) => resolve(payload)
);

export const changeMaximumAge = createActionCreator(
  "maximum-age-change",
  resolve => (payload?: number) => resolve(payload)
);

export const changeTimeout = createActionCreator(
  "timeout-change",
  resolve => (payload?: number) => resolve(payload)
);

export const clearResults = createActionCreator("clear-results");

export const startGetCurrentPosition = createActionCreator(
  "start-get-current-position"
);

export const getRawPositionSuccess = createActionCreator(
  "get-raw-position-success",
  resolve => (payload: {
    position: Position;
    source: "getCurrentPosition" | "watchPosition";
  }) => resolve(payload.position, { source: payload.source })
);

export const getRawPositionError = createActionCreator(
  "get-raw-position-error",
  resolve => (err: PositionError) => resolve(err)
);

export const getKalmanFilterPositionSuccess = createActionCreator(
  "get-kalman-filter-position-success",
  resolve => (payload: {
    position: Position;
    source: "getCurrentPosition" | "watchPosition";
  }) => resolve(payload.position, { source: payload.source })
);

export const getKalmanFilterPositionError = createActionCreator(
  "get-kalman-filter-position-error",
  resolve => (err: PositionError) => resolve(err)
);
