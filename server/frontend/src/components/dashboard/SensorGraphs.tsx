import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneralLineChart from "./GeneralLineChart";
import getcookie from "../../getcookie";
import Cookies from "universal-cookie";

interface ModuleData {
  response: {
    result: {
      current_data: {
        temperature: number;
        humidity: number;
        light_level: number;
        moisture: number;
        updatedAt: string;
      };
      daily_data: [
        {
          temperature: number;
          humidity: number;
          light_level: number;
          moisture: number;
          updatedAt: string;
        }
      ];
    };
  };
}

const cookies = new Cookies();

function SensorGraphs() {
  const [CurrentData, setCurrentData] = useState([
    {
      "live temperature": 0,
      "live humidity": 0,
      "live light level": 0,
      "live moisture": 0,
      "updatedAt": "",
    },
  ]);

  const [DailyData, setDailyData] = useState([
    {
      temperature: 0,
      humidity: 0,
      light_level: 0,
      moisture: 0,
      updatedAt: "",
    },
  ]);

  function getData() {
    axios
      .get<ModuleData>(
        "http://homenode.tech/api/sensors?id=" + getcookie("sensors_id", true)
      )
      .then((res) => {
        const { data } = res;
        let current_data = data.response.result.current_data;
        let updated_data = {
          "live temperature": current_data.temperature,
          "live humidity": current_data.humidity,
          "live light level": current_data.light_level,
          "live moisture": current_data.moisture,
          "updatedAt": current_data.updatedAt,
        };
        let daily_data = data.response.result.daily_data;
        cookies.set("sensors_temperature", current_data.temperature);
        cookies.set("sensors_humidity", current_data.humidity);
        cookies.set("sensors_light_level", current_data.light_level);
        cookies.set("sensors_moisture", current_data.moisture);
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
            key: "live temperature",
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
            key: "live humidity",
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
            key: "live light level",
            stroke: "#ff9d86",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff9d86"]}
      />
      <GeneralLineChart
        data={CurrentData}
        lines={[
          {
            key: "live moisture",
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
            stroke: "#9086ff",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#9086ff"]}
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
      <GeneralLineChart
        data={DailyData}
        lines={[
          {
            key: "moisture",
            stroke: "#ff9d86",
          },
        ]}
        // xAxisKey="updatedAt"
        yAxisColours={["#ff9d86"]}
      />
    </div>
  );
}

export default SensorGraphs;
