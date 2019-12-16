import { createReducer } from "deox";
import { updateAcceleration } from "../actions";
import { AccelerationHistoryState } from "../types";

export const defaultState: AccelerationHistoryState = [];

export const reducer = createReducer(defaultState, handleAction => [
  handleAction(updateAcceleration, (state, action) => {
    return [...state, action.payload].slice(state.length - 100);
  })
]);
