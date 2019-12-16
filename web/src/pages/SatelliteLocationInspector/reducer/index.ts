import { combineReducers } from "redux";
import * as kalmanFilterPositions from "./kalman_filter_positions";
import * as positionOptions from "./position_options";
import * as rawPositions from "./raw_positions";
import * as results from "./results";
import * as statistic from "./statistic";
import * as waitingLocation from "./waiting_location";

export const reducer = combineReducers({
  kalmanFilterPositions: kalmanFilterPositions.reducer,
  positionOptions: positionOptions.reducer,
  rawPositions: rawPositions.reducer,
  results: results.reducer,
  statistic: statistic.reducer,
  waitingLocation: waitingLocation.reducer
});

export const defaultState = {
  kalmanFilterPositions: kalmanFilterPositions.defaultState,
  positionOptions: positionOptions.defaultState,
  rawPositions: rawPositions.defaultState,
  results: results.defaultState,
  statistic: statistic.defaultState,
  waitingLocation: waitingLocation.defaultState
};
