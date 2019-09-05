import { createReducer } from "deox";
import { getPositionSuccess, clearResults } from "../actions";

export const defaultState: Position[] = [];
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(clearResults, () => defaultState),
  handleAction(getPositionSuccess, (state, action) => {
    return [...state, action.payload];
  })
]);
