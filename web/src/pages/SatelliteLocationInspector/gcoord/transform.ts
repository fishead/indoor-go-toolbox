import { error, isNumber, isArray, coordEach } from "./helper";

import { Position, GeoJSON } from "./geojson";

import * as CRS from "./crs/index";

interface AllCRS {
  [key: string]: CRS.CRS;
}

/**
 * transform
 *
 * @param {geojson|position|string} input
 * @returns {geojson|position} output
 */
export default function transform(
  input: any,
  crsFrom: string,
  crsTo: string
): GeoJSON | Position | string {
  /**
   * TODO:
   * if (condition) error(msg); -> assert(condition, msg);
   * the limitation of TS. https://github.com/Microsoft/TypeScript/issues/8655
   */

  if (!input) error("coordinate is required");
  if (!crsFrom) error("original coordinate system is required");
  if (!crsTo) error("target coordinate system is required");

  const from = (CRS as AllCRS)[crsFrom];
  if (!from) error("original coordinate system is invalid");

  if (crsFrom === crsTo) return input;

  const to: Function = from.to[crsTo];
  if (!to) error("target coordinate system is invalid");

  const type = typeof input;
  if (type !== "string" && type !== "object")
    error("coordinate must be an geojson or an array of position");

  if (type === "string") {
    try {
      input = JSON.parse(input as string);
    } catch (e) {
      error("input is not a legal JSON string");
    }
  }

  let isPosition = false;
  if (isArray(input)) {
    if (input.length < 2) error("position must be at 2 numbers long");
    if (!isNumber(input[0]) || !isNumber(input[1]))
      error("position must contain numbers");
    isPosition = true;
  }

  let output = null;
  const convert = to;

  if (isPosition) {
    output = convert(input as Position);
  } else {
    coordEach(input as GeoJSON, (coord: number[]) => {
      [coord[0], coord[1]] = convert(coord);
    });

    output = input;
  }

  return output;
}
