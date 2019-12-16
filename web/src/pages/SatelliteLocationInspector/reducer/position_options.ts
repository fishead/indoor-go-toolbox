import { createReducer } from "deox";
import {
  changeEnableHighAccuracy,
  changeMaximumAge,
  changeTimeout
} from "../actions";

export const defaultState: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 3000,
  timeout: 10000
};

export const reducer = createReducer(defaultState, handleAction => [
  handleAction(changeEnableHighAccuracy, (state, action) => {
    return {
      ...state,
      enableHighAccuracy: action.payload
    };
  }),
  handleAction(changeMaximumAge, (state, action) => {
    return {
      ...state,
      maximumAge: action.payload
    };
  }),
  handleAction(changeTimeout, (state, action) => {
    return {
      ...state,
      timeout: action.payload
    };
  })
]);
