import { positionToJSON, positionToPointFeature } from "../../../utilities";
import {
  AbsoluteOrientationSensor,
  LinearAccelerationSensor
} from "motion-sensors-polyfill/src/motion-sensors";
import turfDestination from "@turf/destination";
import { getCoord as turfGetCoord } from "@turf/invariant";
import { Acceleration } from "../../AccelerationInspector/types";
import AccelerationKalmanFilter from "../../AccelerationInspector/AccelerationKalmanFilter";
import turfDistance from "@turf/distance";

interface GPSKalmanFilterParams {
  processNoise: number;
}

export class GPSKalmanFilter {
  // Process Noise Variance
  private processNoise: number;

  private estimateUncertainty: number;
  private estimatePos: Position;
  private heading = 0;

  /**
   * 经度方向的加速度
   */
  private aLng: number = 0;

  /**
   * 纬度方向的加速度
   */
  private aLat: number = 0;

  /**
   * 速度
   */
  private vLng: number = 0;

  private vLat: number = 0;

  constructor(params: GPSKalmanFilterParams) {
    this.processNoise = params.processNoise;

    // 因为还没有初始位置
    this.estimateUncertainty = -1;

    // 设置一个假的位置
    this.estimatePos = {
      timestamp: Date.now(),
      coords: {
        accuracy: 99999,
        altitude: 0,
        altitudeAccuracy: 99999,
        heading: 0,
        latitude: 0,
        longitude: 0,
        speed: 0
      }
    };

    const options = {
      frequency: 60,
      // 参考座标系的区别
      // https://developers.google.com/web/updates/2017/09/sensors-for-the-web?hl=zh-cn#synchronization-with-screen-coordinates
      referenceFrame: "device" // or 'screen'
    };
    const absoluteOrientationSensor = new AbsoluteOrientationSensor(options);
    absoluteOrientationSensor.start();

    absoluteOrientationSensor.addEventListener("reading", () => {
      const quaternion = absoluteOrientationSensor.quaternion;
      if (!quaternion) {
        return;
      }
      const [x, y, z, w] = quaternion;
      // 转换四元数到欧拉角
      // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Source_Code_2
      const t3 = 2.0 * (w * z + x * y);
      const t4 = 1.0 - 2.0 * (y * y + z * z);
      const radian = Math.atan2(t3, t4); // [-π, π]
      const degree = (radian * 180) / Math.PI; // [-180, 180]
      this.heading = degree;
    });

    const accelerationKalmanFilter = new AccelerationKalmanFilter({
      processNoise: 0.2,
      measurementUncertainty: 8 ** 2
    });

    const linearAccelerationSensor = new LinearAccelerationSensor({
      frequency: 60
    });
    linearAccelerationSensor.start();
    linearAccelerationSensor.addEventListener("reading", () => {
      const rawAcceleration: Acceleration = {
        x: linearAccelerationSensor.x || 0,
        y: linearAccelerationSensor.y || 0,
        z: linearAccelerationSensor.z || 0
      };
      const estimatedAcceleration = accelerationKalmanFilter.process(
        rawAcceleration
      );

      this.aLng = estimatedAcceleration.x;
      this.aLat = estimatedAcceleration.y;
    });
  }

  reset() {
    this.estimateUncertainty = -1;
    this.vLng = 0;
    this.vLat = 0;
    this.aLng = 0;
    this.aLat = 0;
  }

  process(pos: Position) {
    const copy = positionToJSON(pos);

    // 如果 estimateUncertainty < 0，说明尚未初始化
    if (this.estimateUncertainty < 0) {
      this.estimatePos = copy;
      this.estimateUncertainty = pos.coords.accuracy ** 2;
      return this.estimatePos;
    }

    const {
      timestamp,
      coords,
      coords: { accuracy, longitude, latitude }
    } = copy;

    const heading = this.heading;

    const timeElapsedSeconds = (timestamp - this.estimatePos.timestamp) / 1000;

    // State Extrapolation Equation
    const predictedPos = {
      ...copy,
      coords: {
        ...copy.coords,
        longitude: turfGetCoord(
          turfDestination(
            [
              this.estimatePos.coords.longitude,
              this.estimatePos.coords.latitude
            ],
            this.vLng * timeElapsedSeconds +
              (this.aLng * timeElapsedSeconds ** 2) / 2,
            heading,
            {
              units: "meters"
            }
          )
        )[0],
        latitude: turfGetCoord(
          turfDestination(
            [
              this.estimatePos.coords.longitude,
              this.estimatePos.coords.latitude
            ],
            this.vLat * timeElapsedSeconds +
              (this.aLat * timeElapsedSeconds ** 2) / 2,
            heading,
            {
              units: "meters"
            }
          )
        )[1]
      }
    };
    const predictedVLng = this.vLng + this.aLng * timeElapsedSeconds;
    const predictedVLat = this.vLat + this.aLat * timeElapsedSeconds;
    const predictedV = Math.hypot(predictedVLng, predictedVLat);

    // Covariance Extrapolation Equation for constant dynamics
    const predictUncertainty =
      this.estimateUncertainty + predictedV ** 2 + this.processNoise;

    const measurementUncertainty = accuracy ** 2;
    // Kalman Gain Equation
    const gain =
      predictUncertainty / (predictUncertainty + measurementUncertainty);

    // State Update Equation for constant velocity dynamics
    const estimatePos = {
      timestamp,
      coords: {
        ...coords,
        longitude:
          (1 - gain) * predictedPos.coords.longitude + gain * longitude,
        latitude: (1 - gain) * predictedPos.coords.latitude + gain * latitude,
        speed: predictedV
      }
    };
    const distance = turfDistance(
      positionToPointFeature(estimatePos),
      positionToPointFeature(this.estimatePos)
    );
    const v = distance / timeElapsedSeconds;
    this.vLng = v * Math.sin((heading % 90) + 90);
    this.vLat = v * Math.cos((heading % 90) + 90);
    this.estimatePos = estimatePos;
    // Covariance Update Equation
    this.estimateUncertainty = (1 - gain) * predictUncertainty;

    return estimatePos;
  }
}

export default GPSKalmanFilter;
