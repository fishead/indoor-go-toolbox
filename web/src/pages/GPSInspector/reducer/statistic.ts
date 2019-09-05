import { createReducer } from "deox";
import { clearResults, getPositionSuccess, getPositionError } from "../actions";
import { Statistic } from "../types";
import { insert, prop, sortBy } from "ramda";
import { combineReducers } from "redux";

export const defaultState: Statistic = {
  successCount: 0,
  errorCount: 0,
  data: []
};

const successCount = createReducer(defaultState.successCount, handleAction => [
  handleAction(clearResults, () => defaultState.successCount),
  handleAction(getPositionSuccess, state => state + 1)
]);

const errorCount = createReducer(defaultState.errorCount, handleAction => [
  handleAction(clearResults, () => defaultState.errorCount),
  handleAction(getPositionError, state => state + 1)
]);

const data = createReducer(defaultState.data, handleAction => [
  handleAction(clearResults, () => defaultState.data),
  handleAction(getPositionSuccess, (state, action) => {
    const {
      coords: { accuracy }
    } = action.payload;
    const formattedAccuracy = Math.round(accuracy);

    const resultIndex = state.findIndex(s => s.accuracy === formattedAccuracy);
    const result =
      resultIndex >= 0
        ? state[resultIndex]
        : {
            accuracy: formattedAccuracy,
            count: 0
          };

    result.count += 1;

    return sortBy(
      prop("accuracy"),
      insert(resultIndex >= 0 ? resultIndex : state.length, result, state)
    );
  })
]);

export const reducer = combineReducers({
  successCount,
  errorCount,
  data
});

// export const reducer = createReducer(defaultState, handleAction => [
//   handleAction(clearResults, () => defaultState),
//   handleAction(getPositionError, state => {
//     return {
//       ...state,
//       errorCount: state.errorCount + 1
//     };
//   }),
//   handleAction(getPositionSuccess, (state, action) => {
//     const {
//       coords: { accuracy }
//     } = action.payload;
//     const formattedAccuracy = Math.round(accuracy);

//     const prevAccuracyStatistic: Statistic["raw"] extends {
//       [key: number]: infer D;
//     }
//       ? D
//       : never = propOr(
//       { accuracy: formattedAccuracy, count: 0 },
//       formattedAccuracy.toString(),
//       state.raw
//     );
//     const nextAccuracyStatistic: Statistic["raw"] extends {
//       [key: number]: infer D;
//     }
//       ? D
//       : never = {
//       accuracy: formattedAccuracy,
//       count: prevAccuracyStatistic.count + 1
//     };
//     const nextRaw: Statistic["raw"] = {
//       ...state.raw,
//       [formattedAccuracy]: nextAccuracyStatistic
//     };
//     return {
//       ...state,
//       successCount: state.successCount + 1,
//       data: sortBy(d => d.accuracy, Object.values(nextRaw)),
//       raw: nextRaw
//     };
//   })
// ]);
