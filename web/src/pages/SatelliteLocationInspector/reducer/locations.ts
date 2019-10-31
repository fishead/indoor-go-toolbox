import { createReducer } from "deox";
import { getPositionSuccess, clearResults } from "../actions";
import { Feature, Point } from "geojson";
import { transform, WGS84, GCJ02 } from "../gcoord";

export const defaultState: Feature<Point>[] = [];
export const reducer = createReducer(defaultState, handleAction => [
  handleAction(clearResults, () => defaultState),
  handleAction(getPositionSuccess, (state, action) => {
    const {
      timestamp,
      coords: { longitude, latitude, accuracy }
    } = action.payload;
    const [lng, lat] = transform([longitude, latitude], WGS84, GCJ02) as [
      number,
      number
    ];

    return [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
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
