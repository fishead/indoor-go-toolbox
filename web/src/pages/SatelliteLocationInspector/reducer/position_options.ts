import { createReducer } from "deox";
import { combineReducers } from "redux";
import {
  changeEnableHighAccuracy,
  changeMaximumAge,
  changeTimeout
} from "../actions";

const defaultPositionOptions: PositionOptions = {};
const positionOptions = createReducer(defaultPositionOptions, handleAction => [
  handleAction(changeEnableHighAccuracy, (state, action) => {
    const { select } = action.payload;
    switch (select) {
      case "true":
        return {
          ...state,
          enableHighAccuracy: true
        };
      case "false":
        return {
          ...state,
          enableHighAccuracy: false
        };
      case "default":
      default:
        return {
          ...state,
          enableHighAccuracy: undefined
        };
    }
  }),
  handleAction(changeMaximumAge, (state, action) => {
    const { select, input } = action.payload;
    switch (select) {
      case "custom":
        return {
          ...state,
          maximumAge: Number(input)
        };
      case "positive-infinity":
        return {
          ...state,
          maximumAge: Number.POSITIVE_INFINITY
        };
      case "default":
      default:
        return {
          ...state,
          maximumAge: undefined
        };
    }
  }),
  handleAction(changeTimeout, (state, action) => {
    const { select, input } = action.payload;
    switch (select) {
      case "custom":
        return {
          ...state,
          timeout: Number(input)
        };
      case "positive-infinity":
        return {
          ...state,
          timeout: Number.POSITIVE_INFINITY
        };
      case "default":
      default:
        return {
          ...state,
          timeout: undefined
        };
    }
  })
]);

const defaultEnableHighAccuracyField = { select: "default" };
const enableHighAccuracyField = createReducer(
  defaultEnableHighAccuracyField,
  handleAction => [
    handleAction(changeEnableHighAccuracy, (_, action) => action.payload)
  ]
);

const defaultMaximumAgeField = {
  select: "default",
  input: ""
};
const maximumAgeField = createReducer(defaultMaximumAgeField, handleAction => [
  handleAction(changeMaximumAge, (_, action) => action.payload)
]);

const defaultTimeoutField = {
  select: "default",
  input: ""
};
const timeoutField = createReducer(defaultTimeoutField, handleAction => [
  handleAction(changeTimeout, (_, action) => action.payload)
]);

export const reducer = combineReducers({
  positionOptions,
  enableHighAccuracyField,
  maximumAgeField,
  timeoutField
});

export const defaultState = {
  positionOptions: defaultPositionOptions,
  enableHighAccuracyField: defaultEnableHighAccuracyField,
  maximumAgeField: defaultMaximumAgeField,
  timeoutField: defaultTimeoutField
};
