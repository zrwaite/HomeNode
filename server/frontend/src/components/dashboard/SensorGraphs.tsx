import React from "react";
import GeneralLineChart from "./GeneralLineChart";

function SensorGraphs() {
  // insert code to get data here
  let example_data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 80 },
    { name: "Page B", uv: 600, pv: 2300, amt: 100 },
    { name: "Page C", uv: 300, pv: 2000, amt: 50 },
    { name: "Page D", uv: 500, pv: 2000, amt: 100 },
    { name: "Page E", uv: 200, pv: 1800, amt: 40 },
    { name: "Page F", uv: 300, pv: 1500, amt: 60 },
    { name: "Page G", uv: 200, pv: 1200, amt: 30 },
    { name: "Page H", uv: 100, pv: 600, amt: 20 },
    { name: "Page I", uv: 500, pv: 1700, amt: 70 },
    { name: "Page J", uv: 400, pv: 1400, amt: 80 },
  ];

  return (
    <div>
      <GeneralLineChart
        data={example_data}
        lines={[{
          key: "uv",
          stroke: "#FF0000",
          yAxisKey: "left",
        }, {
          key: "pv",
          stroke: "#00FF00",
          yAxisKey: "right",
        }, {
          key: "amt",
          stroke: "#0000FF",
        }]}
        xAxisKey="name"
      />
    </div>
  );
}

export default SensorGraphs;
