import React, { useEffect, useState } from "react";
import axios from "axios";
import {baseurl} from "../../zacserver";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import getcookie from "../../getcookie";
import Cookies from "universal-cookie";

interface UserInfo {
  response: {
    result: {
      username: string;
      name: string;
      home_id: string;
      settings: {
        dark_mode: boolean;
        email_notifications: boolean;
        intrusion_detection: boolean;
      };
    };
  };
}

export default function SettingsTable() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [EmailNotifications, setEmailNotifications] = useState(false);
  const [IntrusionDetection, setIntrusionDetection] = useState(false);
  const [SafetyLevel, setSafetyLevel] =
    useState(5);
  const header = ["key", "actions"];
  const data = [
    { key: "Dark Mode" },
    { key: "Email Notifications" },
    { key: "Intrusion Detection" },
    { key: "Safety Level" },
  ];
  const cookies = new Cookies();

  function getOppositeColorMode() {
    return colorMode === "dark" ? "false" : "true";
  }

  function forceColorModeUpdate() {
    axios
      .get<UserInfo>(
        baseurl+"/api/user?username=" + getcookie("email", true)
      )
      .then((res) => {
        const { data } = res;
        let received_color_mode = data.response.result.settings.dark_mode;
        console.log("GET COLORMODE: ", received_color_mode);
        if (colorMode === "dark" && received_color_mode === false) {
          toggleColorMode();
        } else if (colorMode === "light" && received_color_mode === true) {
          toggleColorMode();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function forceEmailNotificationsUpdate() {
    axios
      .get<UserInfo>(
        baseurl+"/api/user?username=" + getcookie("email", true)
      )
      .then((res) => {
        const { data } = res;
        let received_email_notifications =
          data.response.result.settings.email_notifications;
        console.log("GET EMAILNOTIFS: ", received_email_notifications);
        setEmailNotifications(received_email_notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function forceIntrusionDetectionUpdate() {
    axios
      .get(baseurl+"/api/home?id=" + getcookie("home_id", true))
      .then((res) => {
        const { data } = res;
        let received_intrusion_detection =
          data.response.result.settings.intrusion_detection;
        let received_safety_level =
          data.response.result.settings.safety_level;

        console.log(
          "GET INTRUSIONDETECTION: ",
          received_intrusion_detection,
          received_safety_level,
        );
        setIntrusionDetection(received_intrusion_detection);
        setSafetyLevel(received_safety_level);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    forceColorModeUpdate();
    forceEmailNotificationsUpdate();
    forceIntrusionDetectionUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                            baseurl+"/api/user?put_type=settings.dark_mode",
                            {
                              username: getcookie("email", true),
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
                            baseurl+"/api/user?put_type=settings.email_notifications",
                            {
                              username: getcookie("email", true),
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
                            baseurl+"/api/home?put_type=settings.intrusion_detection",
                            {
                              id: getcookie("home_id", true),
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
                {data[tid]["key"] === "Safety Level" && (
                  <NumberInput
                    size="sm"
                    width="75px"
                    defaultValue={getcookie("safety_level", true) || SafetyLevel}
                    min={1}
                    max={10}
                    onChange={(val) =>
                      // console.log("SAFETY LEVEL: ", val)
                      axios.put(
                        baseurl+"/api/home?put_type=settings.safety_level",
                        {
                          id: getcookie("home_id", true),
                          settings: {
                            safety_level: val,
                          },
                        }
                      ).then(() => cookies.set("safety_level", val))
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}

                {data[tid]["key"] !== "Dark Mode" &&
                  data[tid]["key"] !== "Email Notifications" &&
                  data[tid]["key"] !== "Intrusion Detection" &&
                  data[tid]["key"] !== "Safety Level" && (
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
