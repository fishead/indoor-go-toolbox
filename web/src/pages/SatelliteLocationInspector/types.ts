import { Statistic as ReportStatistic } from "./Report";

export interface ChangeEnableHighAccuracyActionPayload {
  select: "default" | "true" | "false";
}

export interface ChangeMaximumAgeActionPayload {
  select: "default" | "positive-infinity" | "custom";
  input: string;
}

export interface ChangeTimeoutActionPayload {
  select: "default" | "positive-infinity" | "custom";
  input: string;
}

export type Statistic = ReportStatistic;
