/// <reference types="w3c-generic-sensor" />

declare module "motion-sensors-polyfill" {
  export {
    Sensor,
    Accelerometer,
    LinearAccelerationSensor,
    GravitySensor,
    Gyroscope,
    RelativeOrientationSensor,
    AbsoluteOrientationSensor
  };
}

declare module "motion-sensors-polyfill/src/motion-sensors" {
  export {
    Sensor,
    Accelerometer,
    LinearAccelerationSensor,
    GravitySensor,
    Gyroscope,
    RelativeOrientationSensor,
    AbsoluteOrientationSensor
  };
}

declare module "motion-sensors-polyfill/src/geolocation-sensor" {
  interface GeolocationSensorOptions extends SensorOptions, PositionOptions {}

  interface ReadOptions extends GeolocationSensorOptions {
    signal?: AbortSignal;
  }

  interface GeolocationSensorReading
    extends Omit<Position, "coords">,
      Coordinates {}

  export class GeolocationSensor extends Sensor {
    static async read(
      options?: ReadOptions = {}
    ): Promise<GeolocationSensorReading>;

    readonly timestamp: number | null;
    readonly latitude: number | null;
    readonly longitude: number | null;
    readonly altitude: number | null;
    readonly accuracy: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly speed: number | null;

    constructor(options?: GeolocationSensorOptions = {});
  }
}
