import React, { FC, useMemo, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router-dom";
import style from "./index.module.css";
import { AccelerationKalmanFilter } from "./AccelerationKalmanFilter";
import { Acceleration } from "./types";
import { reducer, defaultState } from "./reducer";
import { updateAcceleration } from "./actions";
import AccelerationHistoryLineChart from "./AccelerationHistoryLineChart";
import { LinearAccelerationSensor } from "motion-sensors-polyfill/src/motion-sensors";
import AccelerationHistoryBarChart from "./AccelerationHistoryBarChart";
import StatisticTable from "./StatisticTable";

export const AccelerationInspector: FC<RouteComponentProps> = () => {
  const [state, dispatch] = useReducer(reducer, defaultState as any);

  const kalmanFilter = useMemo(() => {
    return new AccelerationKalmanFilter({
      processNoise: 0.2,
      measurementUncertainty: 8 ** 2
    });
  }, []);

  const linearAccelerationSensor = useMemo(() => {
    return new LinearAccelerationSensor({
      frequency: 60
    });
  }, []);

  useEffect(() => {
    const type = "reading";
    const handler = () => {
      const rawAcceleration: Acceleration = {
        x: linearAccelerationSensor.x || 0,
        y: linearAccelerationSensor.y || 0,
        z: linearAccelerationSensor.z || 0
      };
      const estimatedAcceleration = kalmanFilter.process({
        x: linearAccelerationSensor.x || 0,
        y: linearAccelerationSensor.y || 0,
        z: linearAccelerationSensor.z || 0
      });
      dispatch(
        updateAcceleration({
          timestamp: Date.now(),
          raw: rawAcceleration,
          estimated: estimatedAcceleration
        })
      );
    };
    linearAccelerationSensor.addEventListener(type, handler);
    linearAccelerationSensor.start();

    return () => {
      linearAccelerationSensor.removeEventListener(type, handler);
      linearAccelerationSensor.stop();
    };
  }, [kalmanFilter, linearAccelerationSensor]);

  return (
    <>
      <Helmet>
        <title>加速度传感器测试</title>
      </Helmet>

      <div className={style.container}>
        <div className={style.value_container}>
          <StatisticTable
            acceleration={state.acceleration}
            accelerationHistory={state.accelerationHistory}
          />
        </div>

        <div className={style.chart1_container}>
          <AccelerationHistoryBarChart data={state.accelerationHistory} />
        </div>

        <div className={style.chart2_container}>
          <AccelerationHistoryLineChart data={state.accelerationHistory} />
        </div>
      </div>
    </>
  );
};

export default AccelerationInspector;
