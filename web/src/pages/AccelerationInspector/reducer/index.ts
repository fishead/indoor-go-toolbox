import { combineReducers } from "redux";
import * as accelerationHistory from "./acceleration_history";
import * as acceleration from "./acceleration";

export const reducer = combineReducers({
  accelerationHistory: accelerationHistory.reducer,
  acceleration: acceleration.reducer
});

export const defaultState = {
  accelerationHistory: accelerationHistory.defaultState,
  acceleration: acceleration.defaultState
};
