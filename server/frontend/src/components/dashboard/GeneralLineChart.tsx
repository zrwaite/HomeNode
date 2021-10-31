import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function GeneralLineChart(props: any) {
  return (
    <div>
      <LineChart
        width={600}
        height={300}
        data={props.data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        {props.lines.map((line: any) => (
          <Line
            type="monotone"
            key={line.key}
            dataKey={line.key}
            stroke={line.stroke}
            yAxisId={line.yAxisKey || "left"}
          />
        ))}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey={props.xAxisKey} />
        <YAxis
          yAxisId="left"
          orientation="left"
          tick={{ fill: props.yAxisColours[0] }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: props.yAxisColours[1] }}
        />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  );
}

export default GeneralLineChart;
