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
        "http://homenode.tech/api/sensors?id=616b7f4a3a200197bf2207ee"
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
        console.log("GET CUR: ", current_data);
        console.log("GET DAL: ", daily_data);
        console.log("GET SENSORMODULEDATA: ", current_data, daily_data);
        console.log("NICE", [...CurrentData, updated_data]);
        setCurrentData([...CurrentData, updated_data]);
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
            stroke: "#FF0000",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#FF0000"]}
      />
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "humidity",
            stroke: "#FF0000",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#FF0000"]}
      />
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "light_level",
            stroke: "#FF0000",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#FF0000"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "temperature",
            stroke: "#FF0000",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#FF0000"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "humidity",
            stroke: "#0000FF",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#0000FF"]}
      />
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "light_level",
            stroke: "#0000FF",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#0000FF"]}
      />
    </div>
  );
}

export default SensorGraphs;
