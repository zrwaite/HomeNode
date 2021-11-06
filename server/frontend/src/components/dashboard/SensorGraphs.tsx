import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneralLineChart from "./GeneralLineChart";

interface ModuleData {
  response: {
    result: [
      {
        current_data: {
          temperature: number;
          humidity: number;
          light_level: number;
          updatedAt: string;
        };
        daily_data: [
          {
            temperature: number;
            humidity: number;
            light_level: number;
            updatedAt: string;
          }
        ];
      }
    ];
  };
}

function SensorGraphs() {
  const [CurrentData, setCurrentData] = useState([
    {
      temperature: 0,
      humidity: 0,
      light_level: 0,
      updatedAt: "",
    },
  ]);

  const [DailyData, setDailyData] = useState([
    {
      temperature: 0,
      humidity: 0,
      light_level: 0,
      updatedAt: "",
    },
  ]);

  function getData() {
    axios
      .get<ModuleData>(
        "http://homenode.tech/api/sensors?id=61870da5d98c502cf04c5770"
      )
      .then((res) => {
        const { data } = res;
        let current_data = data.response.result[0].current_data;
        let updated_data = {
          temperature: current_data.temperature,
          humidity: current_data.humidity,
          light_level: current_data.light_level,
          updatedAt: current_data.updatedAt,
        };
        let daily_data = data.response.result[0].daily_data;
        console.log("GET SENSORMODULEDATA: ", current_data, daily_data);
        setCurrentData([...CurrentData, updated_data]);
        if (CurrentData.length > 10) {
          setCurrentData([...CurrentData.slice(1), updated_data]);
        }
        setDailyData(daily_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    var handle = setInterval(getData, 2500);
    return () => {
      clearInterval(handle);
    };
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
        gridGap: "20px",
      }}
    >
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "temperature",
            graphType: "live ",
            stroke: "#ff86b8",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff86b8"]}
      />
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "humidity",
            graphType: "live ",
            stroke: "#b586ff",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#b586ff"]}
      />
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "light_level",
            graphType: "live ",
            stroke: "#ff9d86",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff9d86"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "temperature",
            stroke: "#ff00ea",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff00ea"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "humidity",
            stroke: "#ff00ea",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff00ea"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "light_level",
            stroke: "#ff9600",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff9600"]}
      />
    </div>
  );
}

export default SensorGraphs;
