import React, { FC } from "react";
import { ResponsiveContainer, PieChart, Pie, Legend, Cell } from "recharts";

export interface Data {
  name: "success" | "error";
  count: number;
}
export interface Props {
  data: Data[];
}

export const SuccessRatioChart: FC<Props> = props => {
  return (
    <ResponsiveContainer height={400} width="100%">
      <PieChart>
        <Legend />
        <Pie data={props.data} dataKey="count" nameKey="name" label>
          <Cell fill="#0f0" />
          <Cell fill="#f00" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SuccessRatioChart;
