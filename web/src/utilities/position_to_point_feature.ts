import { point as turfPoint } from "@turf/helpers";
import { positionToJSON } from "./position_to_json";

export const positionToPointFeature = (pos: Position) => {
  return turfPoint(
    [pos.coords.longitude, pos.coords.latitude],
    positionToJSON(pos)
  );
};
