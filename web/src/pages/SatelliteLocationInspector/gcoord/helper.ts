import {
  GeoJSON,
  Feature,
  FeatureCollection,
  GeometryCollection,
  Point,
  LineString,
  MultiPoint,
  Polygon,
  MultiLineString,
  MultiPolygon
} from "./geojson";

export function assert(condition: boolean, msg: string): void | never {
  if (condition) throw new Error(msg);
}

export function error(message: string): never {
  throw new Error(message);
}

/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * isNumber(123)
 * //=true
 * isNumber('foo')
 * //=false
 */
export function isNumber(input: any): input is number {
  return !isNaN(input) && input !== null && !isArray(input);
}

/**
 * isString
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 */
export function isString(input: any): input is string {
  return typeof input === "string";
}

/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * isObject({elevation: 10})
 * //=true
 * isObject('foo')
 * //=false
 */
export function isObject(input: any): input is object {
  return !!input && input.constructor === Object;
}

/**
 * isArray
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 */
export function isArray(input: any): input is any[] {
  return !!input && Object.prototype.toString.call(input) === "[object Array]";
}

/**
 * compose
 *
 * @param {function[]} functions
 * @returns {function}
 */
export function compose(...funcs: Function[]) {
  const start = funcs.length - 1;
  return function(...args: any[]) {
    let i = start;
    let result = funcs[start].apply(null, args);
    while (i--) result = funcs[i].call(null, result);
    return result;
  };
}

export function coordEach(
  geojson: GeoJSON,
  callback: Function,
  excludeWrapCoord = false
): boolean | void | never {
  // tslint:disable-next-line: one-variable-per-declaration
  let j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection;

  const type = geojson.type;
  const isFeatureCollection = type === "FeatureCollection";
  const isFeature = type === "Feature";
  const stop = isFeatureCollection
    ? (geojson as FeatureCollection).features.length
    : 1;

  // This logic may look a little weird. The reason why it is that way
  // is because it's trying to be fast. GeoJSON supports multiple kinds
  // of objects at its root: FeatureCollection, Features, Geometries.
  // This function has the responsibility of handling all of them, and that
  // means that some of the `for` loops you see below actually just don't apply
  // to certain inputs. For instance, if you give this just a
  // Point geometry, then both loops are short-circuited and all we do
  // is gradually rename the input until it's called 'geometry'.
  //
  // This also aims to allocate as few resources as possible: just a
  // few numbers and booleans, rather than any temporary arrays as would
  // be required with the normalization approach.
  for (let featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? (geojson as FeatureCollection).features[featureIndex].geometry
      : isFeature
      ? (geojson as Feature).geometry
      : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? (geometryMaybeCollection as GeometryCollection).geometries.length
      : 1;

    for (let geomIndex = 0; geomIndex < stopG; geomIndex++) {
      let multiFeatureIndex = 0;
      let geometryIndex = 0;
      geometry = isGeometryCollection
        ? (geometryMaybeCollection as GeometryCollection).geometries[geomIndex]
        : geometryMaybeCollection;

      const geomType = geometry.type;

      wrapShrink =
        excludeWrapCoord &&
        (geomType === "Polygon" || geomType === "MultiPolygon")
          ? 1
          : 0;
      switch (geomType) {
        case null:
          break;
        case "Point":
          coords = (geometry as Point).coordinates;
          if (
            callback(
              coords,
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          coords = (geometry as LineString | MultiPoint).coordinates;
          for (j = 0; j < coords.length; j++) {
            if (
              callback(
                coords[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false
            )
              return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          coords = (geometry as Polygon | MultiLineString).coordinates;
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (
                callback(
                  coords[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false
              )
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          coords = (geometry as MultiPolygon).coordinates;
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (
                  callback(
                    coords[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false
                )
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (
            j = 0;
            j < (geometry as GeometryCollection).geometries.length;
            j++
          ) {
            if (
              coordEach(
                (geometry as GeometryCollection).geometries[j],
                callback,
                excludeWrapCoord
              ) === false
            )
              return false;
          }
          break;
        default:
          error("Unknown Geometry Type");
      }
    }
  }
}
