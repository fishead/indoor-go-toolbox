import React, { FC, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  YAxis,
  Legend,
  Bar,
  CartesianGrid,
  BarChart,
  XAxis
} from "recharts";
import { AccelerationHistoryState } from "./types";
import randomColor from "randomcolor";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const colors = randomColor({
  count: 6
});

interface DataItem {
  v: number;
  rx: number;
  ry: number;
  rz: number;
  ex: number;
  ey: number;
  ez: number;
}

export interface Props {
  data: AccelerationHistoryState;
}

export const AccelerationHistoryBarChart: FC<Props> = props => {
  const [barVisiable, setBarVisiable] = useState<{ [key: string]: boolean }>({
    rx: false,
    ry: false,
    rz: false,
    ex: true,
    ey: true,
    ez: false
  });
  const datas = useMemo(() => {
    const allRx = props.data.map(d => d.raw.x);
    const allRy = props.data.map(d => d.raw.y);
    const allRz = props.data.map(d => d.raw.z);
    const allEx = props.data.map(d => d.estimated.x);
    const allEy = props.data.map(d => d.estimated.y);
    const allEz = props.data.map(d => d.estimated.z);
    const min = props.data.length
      ? Math.min(
          Math.min(...allRx),
          Math.min(...allRy),
          Math.min(...allRz),
          Math.min(...allEx),
          Math.min(...allEy),
          Math.min(...allEz)
        )
      : 0;
    const max = props.data.length
      ? Math.max(
          Math.max(...allRx),
          Math.max(...allRy),
          Math.max(...allRz),
          Math.max(...allEx),
          Math.max(...allEy),
          Math.max(...allEz)
        )
      : 0;
    const interval = 0.2;
    const count = Math.ceil((max - min) / interval) + 2;
    const data: DataItem[] = new Array(count);
    for (let i = 0; i < count; i += 1) {
      data[i] = {
        v: interval * (i - count + 2),
        rx: 0,
        ry: 0,
        rz: 0,
        ex: 0,
        ey: 0,
        ez: 0
      };
    }
    props.data.forEach(d => {
      const rxi = Math.ceil((d.raw.x - min) / interval);
      const rxv = data[rxi];
      data[rxi] = {
        ...rxv,
        rx: rxv.rx + 1
      };

      const ryi = Math.ceil((d.raw.y - min) / interval);
      const ryv = data[ryi];
      data[ryi] = {
        ...ryv,
        ry: ryv.ry + 1
      };

      const rzi = Math.ceil((d.raw.z - min) / interval);
      const rzv = data[rzi];
      data[rzi] = {
        ...rzv,
        rz: rzv.rz + 1
      };

      const exi = Math.ceil((d.estimated.x - min) / interval);
      const exv = data[exi];
      data[exi] = {
        ...exv,
        ex: exv.ex + 1
      };

      const eyi = Math.ceil((d.estimated.x - min) / interval);
      const eyv = data[eyi];
      data[eyi] = {
        ...eyv,
        ey: eyv.ey + 1
      };

      const ezi = Math.ceil((d.estimated.x - min) / interval);
      const ezv = data[ezi];
      data[ezi] = {
        ...ezv,
        ez: ezv.ez + 1
      };
    });

    return data;
  }, [props.data]);

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
                  checked={barVisiable[label]}
                  onChange={evt =>
                    setBarVisiable({
                      ...barVisiable,
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
                  checked={barVisiable[label]}
                  onChange={evt =>
                    setBarVisiable({
                      ...barVisiable,
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
        <BarChart
          data={datas}
          margin={{ top: 20, right: 30, bottom: 15, left: 0 }}
          barCategoryGap={10}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={(d: DataItem) => d.v}
            label={{
              value: "加速度",
              offset: -10,
              position: "insideBottomRight"
            }}
          />
          <YAxis
            label={{
              value: "加速度分布",
              offset: 15,
              position: "insideLeft",
              angle: -90
            }}
          />
          <Legend />
          {barVisiable.rx && (
            <Bar name="rx" fill={colors[0]} dataKey={(d: DataItem) => d.rx} />
          )}
          {barVisiable.ry && (
            <Bar name="ry" fill={colors[1]} dataKey={(d: DataItem) => d.ry} />
          )}
          {barVisiable.rz && (
            <Bar name="rz" fill={colors[2]} dataKey={(d: DataItem) => d.rz} />
          )}
          {barVisiable.ex && (
            <Bar name="ex" fill={colors[3]} dataKey={(d: DataItem) => d.ex} />
          )}
          {barVisiable.ey && (
            <Bar name="ey" fill={colors[4]} dataKey={(d: DataItem) => d.ey} />
          )}
          {barVisiable.ez && (
            <Bar name="ez" fill={colors[5]} dataKey={(d: DataItem) => d.ez} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccelerationHistoryBarChart;
