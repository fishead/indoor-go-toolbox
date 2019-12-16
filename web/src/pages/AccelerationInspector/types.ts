export interface Acceleration {
  x: number;
  y: number;
  z: number;
}

export interface AccelerationState {
  timestamp: number;
  raw: Acceleration;
  estimated: Acceleration;
}

export type AccelerationHistoryState = AccelerationState[];
