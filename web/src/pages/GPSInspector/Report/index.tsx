import React, { FC, useCallback } from "react";
import { SuccessRatioChart } from "./SuccessRatioChart";
import {
  AccuracyDistributionChart,
  Props as OriginProps
} from "./AccuracyDistributionChart";
import { RouteComponentProps } from "react-router-dom";
import Button from "@material-ui/core/button";

export interface Statistic {
  successCount: number;
  errorCount: number;
  data: OriginProps["data"];
}

export interface Props extends RouteComponentProps {
  statistic: Statistic;
}

export const GPSReport: FC<Props> = props => {
  const goBack = useCallback(() => {
    props.history.goBack();
  }, [props.history]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "#fff",
        overflowY: "auto"
      }}
    >
      <div
        style={{ position: "fixed", height: "36px", width: "100%", zIndex: 10 }}
      >
        <Button onClick={() => goBack()}>Go back</Button>
      </div>

      <div>
        <SuccessRatioChart
          data={[
            { name: "success", count: props.statistic.successCount },
            { name: "error", count: props.statistic.errorCount }
          ]}
        />

        <AccuracyDistributionChart data={props.statistic.data} />
      </div>
    </div>
  );
};

export default GPSReport;
