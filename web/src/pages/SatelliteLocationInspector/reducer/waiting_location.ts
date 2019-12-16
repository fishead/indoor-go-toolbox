import { createReducer } from "deox";
import {
  getRawPositionSuccess,
  getRawPositionError,
  startGetCurrentPosition
} from "../actions";

export const defaultState = false;
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(startGetCurrentPosition, () => true),
  handleAction(getRawPositionSuccess, (state, action) => {
    if (action.meta.source === "getCurrentPosition") {
      return false;
    }

    return state;
  }),
  handleAction(getRawPositionError, () => false)
]);
