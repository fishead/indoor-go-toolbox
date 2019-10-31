import { combineReducers } from "redux";
import * as locations from "./locations";
import * as form from "./position_options";
import * as results from "./results";
import * as statistic from "./statistic";
import * as waitingLocation from "./waiting_location";

export const reducer = combineReducers({
  locations: locations.reducer,
  form: form.reducer,
  results: results.reducer,
  statistic: statistic.reducer,
  waitingLocation: waitingLocation.reducer
});

export const defaultState = {
  locations: locations.defaultState,
  form: form.defaultState,
  results: results.defaultState,
  statistic: statistic.defaultState,
  waitingLocation: waitingLocation.defaultState
};
