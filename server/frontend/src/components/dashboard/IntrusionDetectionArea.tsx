// 6196f37d29168d65cb1d2adb
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  useColorModeValue,
  ButtonGroup,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import UserContext from "../../User";

interface ModuleData {
  response: {
    result: {
      current_data: {
        detection: string;
        alert_level: number;
        updatedAt: string;
      };
      daily_data: [
        {
          detection: string;
          alert_level: number;
          updatedAt: string;
        }
      ];
    };
  };
}

export default function IntrusionDetectionArea() {
  const user = useContext(UserContext);
  const [CurrentData, setCurrentData] = useState({
    detection: "",
    alert_level: 0,
    updatedAt: "",
  });
  const [DailyData, setDailyData] = useState([
    {
      detection: "",
      alert_level: 0,
      updatedAt: "",
    },
  ]);
  const header = ["key", "actions"];

  function getData() {
    axios
      .get<ModuleData>(
        "http://homenode.tech/api/intruders?id=6196f37d29168d65cb1d2adb"
      )
      .then((res) => {
        const { data } = res;
        let current_data = data.response.result.current_data;
        let daily_data = data.response.result.daily_data;
        console.log("GET INTRUDERSMODULEDATA: ", current_data, daily_data);
        setCurrentData(current_data);
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

  // useEffect(() => {
  //   forceColorModeUpdate();
  //   forceEmailNotificationsUpdate();
  //   forceIntrusionDetectionUpdate();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
      <Thead
        display={{
          base: "none",
          md: "table-header-group",
        }}
        sx={{
          "@media print": {
            display: "table-header-group",
          },
        }}
      >
        <Tr>
          {header.map((x) => (
            <Th key={x}>{x}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody
        display={{
          base: "block",
          lg: "table-row-group",
        }}
        sx={{
          "@media print": {
            display: "table-row-group",
          },
        }}
      >
        {data.map((token, tid) => {
          return (
            <Tr
              key={tid}
              display={{
                base: "grid",
                md: "table-row",
              }}
              sx={{
                "@media print": {
                  display: "table-row",
                },
                gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
                gridGap: "10px",
              }}
            >
              {Object.keys(token).map((x) => {
                return (
                  <React.Fragment key={`${tid}${x}`}>
                    <Td
                      display={{
                        base: "table-cell",
                        md: "none",
                      }}
                      sx={{
                        "@media print": {
                          display: "none",
                        },
                        textTransform: "uppercase",
                        color: "gray.400",
                        fontSize: "xs",
                        fontWeight: "bold",
                        letterSpacing: "wider",
                        fontFamily: "heading",
                      }}
                    ></Td>
                    <Td color="gray.500" fontSize="md">
                      {x === "key" && data[tid]["key"]}
                    </Td>
                  </React.Fragment>
                );
              })}
              <Td
                display={{
                  base: "table-cell",
                  md: "none",
                }}
                sx={{
                  "@media print": {
                    display: "none",
                  },
                  textTransform: "uppercase",
                  color: "gray.400",
                  fontSize: "xs",
                  fontWeight: "bold",
                  letterSpacing: "wider",
                  fontFamily: "heading",
                }}
              >
                Actions
              </Td>
              <Td>
                {data[tid]["key"] === "Dark Mode" && (
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <Switch
                      size="lg"
                      isChecked={colorMode === "dark"}
                      onChange={() => {
                        axios
                          .put(
                            "http://homenode.tech/api/user?put_type=settings.dark_mode",
                            {
                              username: "129032699zw@gmail.com",
                              settings: {
                                dark_mode: getOppositeColorMode(),
                              },
                            }
                          )
                          .then(() => forceColorModeUpdate());
                        console.log("PUT COLORMODE: ", getOppositeColorMode());
                      }}
                    />
                  </ButtonGroup>
                )}
                {data[tid]["key"] === "Email Notifications" && (
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <Switch
                      size="lg"
                      isChecked={EmailNotifications === true}
                      onChange={() => {
                        axios
                          .put(
                            "http://homenode.tech/api/user?put_type=settings.email_notifications",
                            {
                              username: "129032699zw@gmail.com",
                              settings: {
                                email_notifications: !EmailNotifications,
                              },
                            }
                          )
                          .then(() => forceEmailNotificationsUpdate());
                        console.log("PUT EMAILNOTIFS: ", !EmailNotifications);
                      }}
                    />
                  </ButtonGroup>
                )}
                {data[tid]["key"] === "Intrusion Detection" && (
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <Switch
                      size="lg"
                      isChecked={IntrusionDetection === true}
                      onChange={() => {
                        axios
                          .put(
                            "http://homenode.tech/api/home?put_type=settings.intrusion_detection",
                            {
                              id: "616c934f27eae9a51f5d6d8f",
                              settings: {
                                intrusion_detection: !IntrusionDetection,
                              },
                            }
                          )
                          .then(() => forceIntrusionDetectionUpdate());
                        console.log(
                          "PUT INTRUSIONDETECTION: ",
                          !IntrusionDetection
                        );
                      }}
                    />
                  </ButtonGroup>
                )}
                {data[tid]["key"] !== "Dark Mode" &&
                  data[tid]["key"] !== "Email Notifications" &&
                  data[tid]["key"] !== "Intrusion Detection" && (
                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                      <IconButton
                        colorScheme="green"
                        icon={<AiFillEdit />}
                        aria-label="button"
                      />
                    </ButtonGroup>
                  )}
              </Td>
              {/* <Td>
                <ButtonGroup variant="solid" size="sm" spacing={3}>
                  <IconButton
                    colorScheme="blue"
                    icon={<BsBoxArrowUpRight />}
                    aria-label="button"
                  />
                  <IconButton
                    colorScheme="green"
                    icon={<AiFillEdit />}
                    aria-label="button"
                  />
                  <IconButton
                    colorScheme="red"
                    variant="outline"
                    icon={<BsFillTrashFill />}
                    aria-label="button"
                  />
                </ButtonGroup>
              </Td> */}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
