import React, { useState, FC, createRef } from "react";
import Helmet from "react-helmet";
import {  BarChart , Bar , XAxis, YAxis} from 'recharts'
import useComponentSize from '@rehooks/component-size'
import styled from "@emotion/styled";

const GPSReport: FC = () => {
  const [data] = useState([
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }  ])
  const containerRef= createRef<HTMLDivElement>()
  const { width, height } = useComponentSize(containerRef)

  return (
    <div style={{ height: '100vh'}} >
      <Helmet>
        <title>浏览器 GPS 定位测试报告</title>
      </Helmet>

      <ChartContainer ref={containerRef}>
      <BarChart data={data} width={width} height={height} margin={{ top: 20, right: 10, left: 0 }} >
          <XAxis dataKey='name' />
          <YAxis />
          <Bar
             dataKey='uv' barSize={30}
            fill = '#8884d8'
          />
      </BarChart>
      </ChartContainer>
    </div>
  );
};

export default GPSReport;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
`
