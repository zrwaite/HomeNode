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
import { useColorModeValue, Table } from "@chakra-ui/react";

function GeneralLineChart(props: any) {
  return (
    <Table
      w="full"
      bg={useColorModeValue("white", "gray.800")}
      display={{
        base: "block",
        md: "table",
      }}
      sx={{
        "@media print": {
          display: "table",
        },
      }}
    >
      <LineChart
        width={600}
        height={300}
        data={props.data}
        margin={{ top: 30, right: 20, bottom: 5, left: 0 }}
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
    </Table>
  );
}

export default GeneralLineChart;
