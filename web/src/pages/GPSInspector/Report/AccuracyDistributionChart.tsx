import React, { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

export interface Data {
  accuracy: number;
  count: number;
}
export interface Props {
  data: Data[];
}

export const AccuracyDistributionChart: FC<Props> = props => {
  return (
    <ResponsiveContainer height={400} width="100%">
      <BarChart
        data={props.data}
        margin={{ top: 20, right: 30, bottom: 15, left: 0 }}
      >
        <XAxis
          name="Accuracy"
          dataKey="accuracy"
          type="number"
          interval="preserveStartEnd"
          label={{
            value: "定位精度",
            offset: -10,
            position: "insideBottom"
          }}
        />
        <YAxis
          label={{
            value: "定位次数",
            offset: 15,
            position: "insideLeft",
            angle: -90
          }}
        />
        <Bar dataKey="count" barSize={30} fill="#8884d8" label />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AccuracyDistributionChart;
