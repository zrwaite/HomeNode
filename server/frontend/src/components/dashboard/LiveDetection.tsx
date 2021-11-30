import React, { useState, useEffect } from "react";
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  Link,
  CircularProgress,
  Button,
  Table,
  Td,
  Tr,
  Tbody,
  Icon,
} from "@chakra-ui/react";
import getcookie from "../../getcookie";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  MdSensors,
  MdPersonSearch,
  MdOutlineYard,
  MdDeviceThermostat,
  MdOutlineWbSunny,
  MdOutlineWaterDrop,
  MdWhatshot,
  MdLightbulbOutline,
  MdWater,
  MdAlarm,
  MdManageSearch,
} from "react-icons/md";

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
        // height={250}
        minHeight="250px"
        overflowY="hidden"
        overflowX="hidden"
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
            <Icon
              mr="2"
              boxSize="8"
              _groupHover={{
                color: useColorModeValue("gray.600", "gray.300"),
              }}
              as={MdSensors}
            ></Icon>
            Sensors Module Live Data
          </Link>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdDeviceThermostat}
                    ></Icon>
                    Temperature:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {getcookie("sensors_temperature", true)}
                    </chakra.p>
                  </chakra.p>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdWhatshot}
                    ></Icon>
                    Humidity:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {getcookie("sensors_humidity", true)}
                    </chakra.p>
                  </chakra.p>
                  <br />
                </Td>
                <Td>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdOutlineWbSunny}
                    ></Icon>
                    Light Level:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {getcookie("sensors_light_level", true)}
                    </chakra.p>
                  </chakra.p>
                  {/* <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    Moisture:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {getcookie("sensors_moisture", true)}
                    </chakra.p>
                  </chakra.p> */}
                  <br />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={-4}
          ml={-2}
        >
          <Button
            color={useColorModeValue("brand.600", "brand.400")}
            variant="ghost"
            onClick={() => history.push("/dashboard/wiki/module/sensors")}
          >
            Learn more
          </Button>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              mt={6}
              color="brand.500"
              size="xxs"
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
        // height={250}
        minHeight="250px"
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
            <Icon
              mr="2"
              boxSize="8"
              _groupHover={{
                color: useColorModeValue("gray.600", "gray.300"),
              }}
              as={MdPersonSearch}
            ></Icon>
            Intruders Module Live Data
          </Link>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdAlarm}
                    ></Icon>
                    Alert Level:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {props.alert_level !== "None"
                        ? `${props.alert_level}`
                        : `...`}
                    </chakra.p>
                  </chakra.p>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdManageSearch}
                    ></Icon>
                    Reason:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {props.alert_level !== "None"
                        ? `${props.detection_level}`
                        : `...`}
                    </chakra.p>
                  </chakra.p>
                  <br />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={-4}
          ml={-2}
        >
          <div>
            <Button
              color={useColorModeValue("brand.600", "brand.400")}
              variant="ghost"
              onClick={() => history.push("/dashboard/wiki/module/intruders")}
            >
              Learn more
            </Button>

            <Button
              color={useColorModeValue("red.600", "red.400")}
              variant="ghost"
              onClick={() => history.push("/dashboard/viewthreats")}
            >
              View threats
            </Button>
          </div>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              mt={6}
              color="brand.500"
              size="xxs"
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
        // height={250}
        minHeight="250px"
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
            <Icon
              mr="2"
              boxSize="8"
              _groupHover={{
                color: useColorModeValue("gray.600", "gray.300"),
              }}
              as={MdOutlineYard}
            ></Icon>
            Plant Module Live Data
          </Link>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdLightbulbOutline}
                    ></Icon>
                    Light Status:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {(PlantModuleData.light_on ? "ON" : "OFF") ||
                        getcookie("plant_light_status", true)}
                    </chakra.p>
                  </chakra.p>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdOutlineWaterDrop}
                    ></Icon>
                    Times Watered:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {PlantModuleData.num_waters ||
                        getcookie("plant_num_waters", true)}
                    </chakra.p>
                  </chakra.p>
                  <br />
                </Td>
                <Td>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdOutlineWbSunny}
                    ></Icon>
                    Light Level:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {PlantModuleData.light_level ||
                        getcookie("plant_light_level", true)}
                    </chakra.p>
                  </chakra.p>
                  <chakra.p
                    mt={2}
                    color={useColorModeValue("gray.600", "gray.300")}
                  >
                    <Icon
                      mr="1"
                      boxSize="6"
                      _groupHover={{
                        color: useColorModeValue("gray.600", "gray.300"),
                      }}
                      as={MdWater}
                    ></Icon>
                    Moisture:{" "}
                    <chakra.p
                      display={{ base: "block", lg: "inline" }}
                      fontWeight="bold"
                      color={useColorModeValue("brand.500", "brand.500")}
                    >
                      {PlantModuleData.moisture ||
                        getcookie("plant_moisture", true)}
                    </chakra.p>
                  </chakra.p>
                  <br />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt={-4}
          ml={-2}
        >
          <Button
            color={useColorModeValue("brand.600", "brand.400")}
            variant="ghost"
            onClick={() => history.push("/dashboard/wiki/module/plant")}
          >
            Learn more
          </Button>

          <Flex alignItems="center">
            <CircularProgress
              isIndeterminate
              w={10}
              h={10}
              mt={6}
              color="brand.500"
              size="xxs"
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default LiveDetection;
