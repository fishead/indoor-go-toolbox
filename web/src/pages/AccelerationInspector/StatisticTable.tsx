import React, { FC, useMemo } from "react";
import { AccelerationState, AccelerationHistoryState } from "./types";
import * as math from "./math";

interface Props {
  acceleration: AccelerationState;
  accelerationHistory: AccelerationHistoryState;
}
export const StatisticTable: FC<Props> = props => {
  const {
    sigmaRx,
    sigmaRy,
    sigmaRz,
    sigmaEx,
    sigmaEy,
    sigmaEz
  } = useMemo(() => {
    return {
      sigmaRx: math.sigma(props.accelerationHistory.map(d => d.raw.x)),
      sigmaRy: math.sigma(props.accelerationHistory.map(d => d.raw.y)),
      sigmaRz: math.sigma(props.accelerationHistory.map(d => d.raw.z)),
      sigmaEx: math.sigma(props.accelerationHistory.map(d => d.estimated.x)),
      sigmaEy: math.sigma(props.accelerationHistory.map(d => d.estimated.y)),
      sigmaEz: math.sigma(props.accelerationHistory.map(d => d.estimated.z))
    };
  }, [props.accelerationHistory]);

  return (
    <table>
      <tbody>
        <legend>raw acceleration</legend>

        <tr>
          <td>x</td>
          <td>{props.acceleration.raw.x}</td>
        </tr>
        <tr>
          <td>y</td>
          <td>{props.acceleration.raw.y}</td>
        </tr>
        <tr>
          <td>z</td>
          <td>{props.acceleration.raw.z}</td>
        </tr>
        <tr>
          <td>sigma x</td>
          <td>{sigmaRx}</td>
        </tr>
        <tr>
          <td>sigma y</td>
          <td>{sigmaRy}</td>
        </tr>
        <tr>
          <td>sigma z</td>
          <td>{sigmaRz}</td>
        </tr>
      </tbody>

      <tbody>
        <legend>raw acceleration</legend>

        <tr>
          <td>x</td>
          <td>{props.acceleration.raw.x}</td>
        </tr>
        <tr>
          <td>y</td>
          <td>{props.acceleration.raw.y}</td>
        </tr>
        <tr>
          <td>z</td>
          <td>{props.acceleration.raw.z}</td>
        </tr>
        <tr>
          <td>sigma x</td>
          <td>{sigmaEx}</td>
        </tr>
        <tr>
          <td>sigma y</td>
          <td>{sigmaEy}</td>
        </tr>
        <tr>
          <td>sigma z</td>
          <td>{sigmaEz}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default StatisticTable;
