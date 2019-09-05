import { createActionCreator } from "deox";
import {
  ChangeEnableHighAccuracyActionPayload,
  ChangeMaximumAgeActionPayload,
  ChangeTimeoutActionPayload
} from "./types";

export const changeEnableHighAccuracy = createActionCreator(
  "enable-high-accuracy-change",
  resolve => (payload: ChangeEnableHighAccuracyActionPayload) =>
    resolve(payload)
);

export const changeMaximumAge = createActionCreator(
  "maximum-age-change",
  resolve => (payload: ChangeMaximumAgeActionPayload) => resolve(payload)
);

export const changeTimeout = createActionCreator(
  "timeout-change",
  resolve => (payload: ChangeTimeoutActionPayload) => resolve(payload)
);

export const clearResults = createActionCreator("clear-results");

export const startGetCurrentPosition = createActionCreator(
  "start-get-current-position"
);

export const getPositionSuccess = createActionCreator(
  "get-position-success",
  resolve => (payload: {
    position: Position;
    source: "getCurrentPosition" | "watchPosition";
  }) => resolve(payload.position, { source: payload.source })
);

export const getPositionError = createActionCreator(
  "get-position-error",
  resolve => (err: PositionError) => resolve(err)
);
