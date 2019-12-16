import { createActionCreator } from "deox";
import { AccelerationState } from "./types";

export const updateAcceleration = createActionCreator(
  "update-acceleration",
  resolve => (payload: AccelerationState) => resolve(payload)
);
