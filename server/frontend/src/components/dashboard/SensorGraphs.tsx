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
        },
        daily_data: [
          {
              temperature: number;
              humidity: number,
              light_level: number,
              updatedAt: string,
          },
        ],
      }
    ];
  };
}

function SensorGraphs() {
  const [CurrentData, setCurrentData] = useState({
    temperature: 0,
    humidity: 0,
    light_level: 0,
    updatedAt: "",
  });

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
        let daily_data = data.response.result[0].daily_data;
        console.log("GET SENSORMODULEDATA: ", current_data, daily_data);
        setCurrentData(current_data);
        setDailyData(daily_data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    var handle = setInterval(getData, 5000);
    return () => {
      clearInterval(handle);
    };
  });

  return (
    <div>
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "temperature",
            stroke: "#FF0000",
            yAxisKey: "left",
          },
          {
            key: "humidity",
            stroke: "#00FF00",
            yAxisKey: "right",
          },
          {
            key: "light_level",
            stroke: "#0000FF",
            yAxisKey: "right",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#FF0000", "#00FF00"]}
      />
    </div>
  );
}

export default SensorGraphs;
