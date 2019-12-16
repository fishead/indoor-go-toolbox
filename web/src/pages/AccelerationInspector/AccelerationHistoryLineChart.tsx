import React, { FC, useState } from "react";
import {
  ResponsiveContainer,
  YAxis,
  LineChart,
  Legend,
  Line,
  CartesianGrid
} from "recharts";
import { AccelerationHistoryState, AccelerationState } from "./types";
import randomColor from "randomcolor";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const colors = randomColor({
  count: 6
});
export interface Props {
  data: AccelerationHistoryState;
}

export const AccelerationHistoryLineChart: FC<Props> = props => {
  const [lineVisiable, setLineVisiable] = useState<{ [key: string]: boolean }>({
    rx: true,
    ry: true,
    rz: false,
    ex: true,
    ey: true,
    ez: false
  });

  return (
    <div>
      <div
        style={{
          height: "50px",
          paddingBottom: "10px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <FormGroup row>
          {["rx", "ry", "rz"].map(label => (
            <FormControlLabel
              key={label}
              label={label}
              control={
                <Switch
                  checked={lineVisiable[label]}
                  onChange={evt =>
                    setLineVisiable({
                      ...lineVisiable,
                      [label]: evt.target.checked
                    })
                  }
                />
              }
            />
          ))}
        </FormGroup>
        <FormGroup row>
          {["ex", "ey", "ez"].map(label => (
            <FormControlLabel
              key={label}
              label={label}
              control={
                <Switch
                  checked={lineVisiable[label]}
                  onChange={evt =>
                    setLineVisiable({
                      ...lineVisiable,
                      [label]: evt.target.checked
                    })
                  }
                />
              }
            />
          ))}
        </FormGroup>
      </div>

      <ResponsiveContainer height={200} width="100%">
        <LineChart
          data={props.data}
          margin={{ top: 20, right: 30, bottom: 15, left: 0 }}
          barCategoryGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            label={{
              value: "加速度",
              offset: 15,
              position: "insideLeft",
              angle: -90
            }}
          />
          <Legend />
          {lineVisiable.rx && (
            <Line
              name="rx"
              type="monotone"
              stroke={colors[0]}
              dataKey={(d: AccelerationState) => d.raw.x}
            />
          )}
          {lineVisiable.ry && (
            <Line
              name="ry"
              type="monotone"
              stroke={colors[1]}
              dataKey={(d: AccelerationState) => d.raw.y}
            />
          )}
          {lineVisiable.rz && (
            <Line
              name="rz"
              type="monotone"
              stroke={colors[2]}
              dataKey={(d: AccelerationState) => d.raw.z}
            />
          )}
          {lineVisiable.ex && (
            <Line
              name="ex"
              type="monotone"
              stroke={colors[3]}
              dataKey={(d: AccelerationState) => d.estimated.x}
            />
          )}
          {lineVisiable.ey && (
            <Line
              name="ey"
              type="monotone"
              stroke={colors[4]}
              dataKey={(d: AccelerationState) => d.estimated.y}
            />
          )}
          {lineVisiable.ez && (
            <Line
              name="ez"
              type="monotone"
              stroke={colors[5]}
              dataKey={(d: AccelerationState) => d.estimated.z}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccelerationHistoryLineChart;
