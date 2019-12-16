import { createReducer } from "deox";
import { AccelerationState } from "../types";
import { updateAcceleration } from "../actions";

export const defaultState: AccelerationState = {
  timestamp: Date.now(),
  raw: {
    x: 0,
    y: 0,
    z: 0
  },
  estimated: {
    x: 0,
    y: 0,
    z: 0
  }
};
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(updateAcceleration, (_, action) => action.payload)
]);
