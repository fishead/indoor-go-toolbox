import { createReducer } from "deox";
import {
  getPositionSuccess,
  getPositionError,
  startGetCurrentPosition
} from "../actions";

export const defaultState = false;
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(startGetCurrentPosition, () => true),
  handleAction(getPositionSuccess, (state, action) => {
    if (action.meta.source === "getCurrentPosition") {
      return false;
    }

    return state;
  }),
  handleAction(getPositionError, () => false)
]);
