import { combineReducers } from "redux";
import * as form from "./position_options";
import * as results from "./results";
import * as statistic from "./statistic";
import * as waitingLocation from "./waiting_location";
import * as locations from "./locations";

export const reducer = combineReducers({
  form: form.reducer,
  results: results.reducer,
  statistic: statistic.reducer,
  waitingLocation: waitingLocation.reducer,
  locations: locations.reducer
});

export const defaultState = {
  form: form.defaultState,
  results: results.defaultState,
  statistic: statistic.defaultState,
  waitingLocation: waitingLocation.defaultState,
  locations: locations.defaultState
};
