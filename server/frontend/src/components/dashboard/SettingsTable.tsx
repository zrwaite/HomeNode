import React, { useContext, useEffect } from "react";
import axios from "axios";
import {
  Flex,
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
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";
import UserContext from "../../User";

interface UserInfo {
  response: {
    result: [
      {
        username: string;
        name: string;
        home_id: string;
        settings: {
          dark_mode: boolean;
          email_notifications: boolean;
        };
      }
    ];
  };
}

export default function SettingsTable() {
  const user = useContext(UserContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const header = ["key", "value", "actions"];
  const data = [
    { key: "Dark Mode", value: "OFF" },
    { key: "Setting #2", value: "N/A" },
    { key: "Setting #3", value: "N/A" },
    { key: "Setting #4", value: "N/A" },
  ];

  function getOppositeColorMode() {
    return colorMode === "dark" ? "false" : "true";
  }

  function forceColorModeUpdate() {
    axios
      .get<UserInfo>(
        "http://homenode.tech/api/user?username=129032699zw@gmail.com"
      )
      .then((res) => {
        const { data } = res;
        console.log(data);
        let received_color_mode = data.response.result[0].settings.dark_mode;
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

  useEffect(() => {
    forceColorModeUpdate();
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
                      {x === "key" ? data[tid]["key"] : data[tid]["value"]}
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
                {data[tid]["key"] === "Dark Mode" ? (
                  <ButtonGroup variant="solid" size="sm" spacing={3}>
                    <Switch
                      size="lg"
                      isChecked={colorMode === "dark"}
                      onChange={() => {axios.put("http://homenode.tech/api/user", {
                        username: "129032699zw@gmail.com",
                        settings: {
                          dark_mode: getOppositeColorMode(),
                        },
                      }).then(() => forceColorModeUpdate()); console.log("PUT COLORMODE: ", getOppositeColorMode());}}
                    />
                  </ButtonGroup>
                ) : (
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
