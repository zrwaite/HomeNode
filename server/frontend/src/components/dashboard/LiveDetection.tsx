import React, { useState, useEffect } from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Link,
  CircularProgress,
  Button,
} from "@chakra-ui/react";
import getcookie from "../../getcookie";
import { useHistory } from "react-router-dom";
import axios from "axios";

interface PlantModuleData {
  response: {
    result: {
      current_data: {
        light_level: number;
        light_on: boolean;
        moisture: number;
        num_waters: number;
      };
    };
  };
}

const LiveDetection = (props: any) => {
  let history = useHistory();
  const [DateTime, setDateTime] = useState("");
  const [PlantModuleData, setPlantModuleData] = useState({
    light_level: 0,
    light_on: false,
    moisture: 0,
    num_waters: 0,
  });
  const GetCurrentDateTime = () => {
    const date_obj = new Date();
    let day = date_obj.getDate();
    let month = date_obj.getMonth() + 1;
    let year = date_obj.getFullYear();
    let hours = date_obj.getHours();
    let minutes = date_obj.getMinutes();
    let seconds = date_obj.getSeconds();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let non_24_hour_time = hours > 12 ? hours - 12 : hours;
    let actual_hr = "";
    let actual_min = "";
    let actual_sec = "";
    if (hours > 12) {
      actual_hr = non_24_hour_time.toString();
      actual_min = minutes.toString();
      actual_sec = seconds.toString();
      if (hours < 10) {
        actual_hr = "0" + non_24_hour_time;
      }
      if (minutes < 10) {
        actual_min = "0" + minutes;
      }
      if (seconds < 10) {
        actual_sec = "0" + seconds;
      }
      setDateTime(
        `${days[date_obj.getDay()]}, ${
          months[month - 1]
        } ${day}, ${year} ${actual_hr}:${actual_min}:${actual_sec} PM`
      );
    } else {
      actual_hr = non_24_hour_time.toString();
      actual_min = minutes.toString();
      actual_sec = seconds.toString();
      if (hours < 10) {
        actual_hr = "0" + non_24_hour_time;
      }
      if (minutes < 10) {
        actual_min = "0" + minutes;
      }
      if (seconds < 10) {
        actual_sec = "0" + seconds;
      }
      setDateTime(
        `${days[date_obj.getDay()]}, ${
          months[month - 1]
        } ${day}, ${year} ${actual_hr}:${actual_min}:${actual_sec} AM`
      );
    }
    return 0;
  };

  function GetPlantModuleData() {
    axios
      .get<PlantModuleData>(
        "http://homenode.tech/api/plants?id=" + getcookie("plants_id", true)
      )
      .then((res) => {
        const { data } = res;
        console.log("GET PLANTSMODULEDATA", data);
        let current_data = data.response.result.current_data;
        let updated_data = {
          light_level: current_data.light_level,
          light_on: current_data.light_on,
          moisture: current_data.moisture,
          num_waters: current_data.num_waters,
        };
        setPlantModuleData(updated_data);
      })
      .catch((err) => {
        console.log("GET PLANTSMODULEDATA ERROR", err);
      });
    return 0;
  }

  useEffect(() => {
    var handledate = setInterval(GetCurrentDateTime, 500);
    return () => {
      clearInterval(handledate);
    };
  });

  useEffect(() => {
    var handleplants = setInterval(GetPlantModuleData, 1000);
    return () => {
      clearInterval(handleplants);
    };
  });

  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.700")}
      pb={4}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        px={8}
        py={4}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue("white", "gray.800")}
        width="full"
        height={250}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <chakra.span
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {DateTime}
          </chakra.span>
        </Flex>

        <Box mt={2}>
          <Link
            fontSize="2xl"
            color={useColorModeValue("gray.700", "white")}
            fontWeight="700"
            _hover={{
              color: useColorModeValue("gray.600", "gray.200"),
              textDecor: undefined,
            }}
          >
            Sensors Module Live Data
          </Link>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            Temperature: {getcookie("sensors_temperature", true)}
            &nbsp;&nbsp;&nbsp; Humidity: {getcookie("sensors_humidity", true)}
          </chakra.p>
          <chakra.p
            mt={2}
            color={useColorModeValue("gray.600", "gray.300")}
          ></chakra.p>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            Light Level: {getcookie("sensors_light_level", true)}
            &nbsp;&nbsp;&nbsp; Moisture: {getcookie("sensors_moisture", true)}
          </chakra.p>
          <chakra.p
            mt={2}
            color={useColorModeValue("gray.600", "gray.300")}
          ></chakra.p>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={6}
          ml={-2}
          onClick={() => history.push("/dashboard/wiki/module/sensors")}
        >
          <Button
            color={useColorModeValue("brand.600", "brand.400")}
            variant="ghost"
          >
            Learn more
          </Button>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              my={4}
              color="green.400"
            />
          </Flex>
        </Flex>
      </Box>
      <Box
        mx={4}
        px={8}
        py={4}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue("white", "gray.800")}
        width="full"
        height={250}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <chakra.span
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {DateTime}
          </chakra.span>
        </Flex>

        <Box mt={2}>
          <Link
            fontSize="2xl"
            color={useColorModeValue("gray.700", "white")}
            fontWeight="700"
            _hover={{
              color: useColorModeValue("gray.600", "gray.200"),
              textDecor: undefined,
            }}
          >
            Intruders Module Live Data
          </Link>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            {props.alert_level !== "None"
              ? `Alert Level: ${props.alert_level}`
              : `Alert Level: Loading...`}
          </chakra.p>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            {props.detection_level !== ""
              ? `Reason: ${props.detection_level}`
              : `Reason: Loading...`}
          </chakra.p>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={6}
          ml={-2}
          onClick={() => history.push("/dashboard/wiki/module/intruders")}
        >
          <Button
            color={useColorModeValue("brand.600", "brand.400")}
            variant="ghost"
          >
            Learn more
          </Button>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              my={4}
              color="green.400"
            />
          </Flex>
        </Flex>
      </Box>
      <Box
        px={8}
        py={4}
        rounded="lg"
        shadow="lg"
        bg={useColorModeValue("white", "gray.800")}
        width="full"
        height={250}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <chakra.span
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {DateTime}
          </chakra.span>
        </Flex>

        <Box mt={2}>
          <Link
            fontSize="2xl"
            color={useColorModeValue("gray.700", "white")}
            fontWeight="700"
            _hover={{
              color: useColorModeValue("gray.600", "gray.200"),
              textDecor: undefined,
            }}
          >
            Plant Module Live Data
          </Link>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            Moisture: {PlantModuleData.moisture || getcookie("moisture_light_level", true)}
            &nbsp;&nbsp;&nbsp; Light Status:{" "}
            {(PlantModuleData.light_on ? "ON" : "OFF") || getcookie("plant_light_status", true)}
          </chakra.p>
          <chakra.p mt={2} color={useColorModeValue("gray.600", "gray.300")}>
            Light Level: {PlantModuleData.light_level || getcookie("plant_light_level", true)}
            &nbsp;&nbsp;&nbsp; Times Watered:{" "}
            {PlantModuleData.num_waters || getcookie("plant_times_watered", true)}
          </chakra.p>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={6}
          ml={-2}
          onClick={() => history.push("/dashboard/wiki/module/plant")}
        >
          <Button
            color={useColorModeValue("brand.600", "brand.400")}
            variant="ghost"
          >
            Learn more
          </Button>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              my={4}
              color="green.400"
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LiveDetection;
