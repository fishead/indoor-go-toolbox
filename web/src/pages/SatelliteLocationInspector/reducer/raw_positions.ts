import { createReducer } from "deox";
import { getRawPositionSuccess, clearResults } from "../actions";
import { Feature, Point } from "geojson";

export const defaultState: Feature<Point>[] = [];

export const reducer = createReducer(defaultState, handleAction => [
  handleAction(clearResults, () => defaultState),
  handleAction(getRawPositionSuccess, (state, action) => {
    const {
      timestamp,
      coords: { longitude, latitude, accuracy }
    } = action.payload;

    return [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        properties: {
          timestamp,
          accuracy
        }
      },
      ...state
    ];
  })
]);
