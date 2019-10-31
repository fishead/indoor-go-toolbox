import { createReducer } from "deox";
import { clearResults, getPositionSuccess, getPositionError } from "../actions";

export const defaultState = "";
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(clearResults, () => ""),
  handleAction(getPositionSuccess, (state, action) => {
    return `${stringifyPosition(action.payload)}\n\n${state}`;
  }),
  handleAction(getPositionError, (state, action) => {
    return state + action.payload.message + "\n\n";
  })
]);

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
