import { Acceleration } from "./types";

interface GPSKalmanFilterParams {
  processNoise: number;
  measurementUncertainty: number;
}

export class AccelerationKalmanFilter {
  // Process Noise Variance
  private processNoise: number;
  private measurementUncertainty: number;

  private estimateUncertainty: number;

  private ea: Acceleration;

  constructor(params: GPSKalmanFilterParams) {
    this.processNoise = params.processNoise;
    this.measurementUncertainty = params.measurementUncertainty;

    this.ea = {
      x: 0,
      y: 0,
      z: 0
    };
    this.estimateUncertainty = params.measurementUncertainty ** 2;
  }

  process(ma: Acceleration) {
    const pa: Acceleration = this.ea;

    // Covariance Extrapolation Equation for constant dynamics
    const predictUncertainty = this.estimateUncertainty + this.processNoise;

    // Kalman Gain Equation
    const gain =
      predictUncertainty / (predictUncertainty + this.measurementUncertainty);

    // State Update Equation for constant velocity dynamics
    const ea = (this.ea = {
      x: (1 - gain) * pa.x + gain * ma.x,
      y: (1 - gain) * pa.y + gain * ma.y,
      z: (1 - gain) * pa.z + gain * ma.z
    });
    // Covariance Update Equation
    this.estimateUncertainty = (1 - gain) * predictUncertainty;

    return ea;
  }
}

export default AccelerationKalmanFilter;
