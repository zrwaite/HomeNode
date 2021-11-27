import {
  Box,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useDisclosure,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  ButtonGroup,
  Table,
  Tbody,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { BsGearFill } from "react-icons/bs";
import { FiMenu, FiSearch } from "react-icons/fi";
import { HiCode } from "react-icons/hi";
import {
  MdHome,
  MdKeyboardArrowRight,
  MdNotifications,
  MdPerson,
} from "react-icons/md";
import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import UserContext from "../../User";
import getcookie from "../../getcookie";
import Cookies from "universal-cookie";
import axios from "axios";

import Home from "../../pages/dashboard/Home";
import Settings from "../../pages/dashboard/Settings";
import WikiIntruders from "../../pages/dashboard/WikiIntruders";
import WikiPlant from "../../pages/dashboard/WikiPlant";
import WikiSensors from "../../pages/dashboard/WikiSensors";

interface Notification {
  id: string;
  title: string;
  info: string;
  read: boolean;
}

function Sidebar() {
  const cookies = new Cookies();
  const sidebar = useDisclosure();
  const integrations = useDisclosure();
  let match = useRouteMatch();
  const history = useHistory();
  const user = useContext(UserContext);
  const toast = useToast();
  const [Notifications, setNotifications] = useState<Notification[]>([]);

  function switchPages(page: string) {
    if (page === "wiki") {
      integrations.onToggle();
    } else {
      history.push(`${match.url}/${page}`);
      user.currentPage = page;
      console.log("GOTO", user.currentPage);
    }
  }

  function goToSettingsOnPopover() {
    history.push(`/dashboard/settings`);
    user.currentPage = "settings";
    console.log("GOTO", user.currentPage);
  }

  function signoutOnPopover() {
    cookies.remove("token", { path: "/" });
    cookies.remove("email", { path: "/" });
    cookies.remove("home_id", { path: "/" });
    cookies.remove("sensors_id", { path: "/" });
    cookies.remove("intruders_id", { path: "/" });
    cookies.remove("name", { path: "/" });
    history.push("/");
    console.log("LOGOUT");
  }

  function getNotifications() {
    axios
      .get("http://homenode.tech/api/home?id=" + getcookie("home_id", true))
      .then((res) => {
        const { data } = res;
        let received_notifs = data.response.result.notifications;
        setNotifications(received_notifs);
        received_notifs.map((notif: Notification) => {
          if (notif.read === false) {
            toast({
              title: notif.title,
              description: notif.info,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          }
          return 0;
        });
        console.log("GET NOTIFS: ", received_notifs);
      })
      .then((res) => {
        axios
          .put("http://homenode.tech/api/home?put_type=notification", {
            id: getcookie("home_id", true),
          })
          .then((res) => {
            console.log("PUT NOTIFSREAD:", res);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    var handlenotifs = setInterval(getNotifications, 5000);
    return () => {
      clearInterval(handlenotifs);
    };
  });

  const NavItem = (props: any) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color={useColorModeValue("inherit", "gray.400")}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
          color: useColorModeValue("gray.900", "gray.200"),
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
        onClick={() => switchPages(props.type)}
      >
        {
          <Icon
            mr="2"
            boxSize="4"
            _groupHover={{
              color: useColorModeValue("gray.600", "gray.300"),
            }}
            as={icon ? icon : MdKeyboardArrowRight}
          />
        }
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props: any) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue("white", "gray.800")}
      borderColor={useColorModeValue("inherit", "gray.700")}
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <img src={logo} alt="logo" width="48" height="48" />
        <Text
          fontSize="2xl"
          ml="2"
          color={useColorModeValue("brand.500", "white")}
          fontWeight="semibold"
        >
          HomeNode
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome} type="home">
          Home
        </NavItem>
        {/* <NavItem icon={FaRss}>Status</NavItem>
        <NavItem icon={HiCollection}>Collections</NavItem>
        <NavItem icon={FaClipboardCheck}>Checklists</NavItem> */}
        <NavItem icon={HiCode} type="wiki">
          Module Wiki
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={integrations.isOpen ? "rotate(90deg)" : "auto"}
          />
        </NavItem>
        <Collapse in={integrations.isOpen}>
          <NavItem pl="12" py="2" type="wiki/module/sensors">
            Sensors Module
          </NavItem>
          <NavItem pl="12" py="2" type="wiki/module/intruders">
            Intruders Module
          </NavItem>
          <NavItem pl="12" py="2" type="wiki/module/plant">
            Plant Module
          </NavItem>
        </Collapse>
        {/* <NavItem icon={AiFillGift}>Changelog</NavItem> */}
        <NavItem icon={BsGearFill} type="settings">
          Settings
        </NavItem>
      </Flex>
    </Box>
  );
  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh"
    >
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup w="96" display={{ base: "none", md: "flex" }}>
            <InputLeftElement color="gray.500" children={<FiSearch />} />
            <Input placeholder="Search..." />
          </InputGroup>

          <Flex align="center">
            <Popover placement="bottom" closeOnBlur={false}>
              <PopoverTrigger>
                <Button mr={2}>
                  <Icon as={MdNotifications} color="gray.500" size="sm" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                color={useColorModeValue("gray.800", "white")}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor="blue.800"
                style={{ overflowY: "scroll", maxHeight: "75vh" }}
                rounded="lg"
                shadow="lg"
              >
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  Notifications
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Table variant="simple">
                    <Tbody>
                      {Notifications.map((item) => item)
                        .reverse()
                        .map((notification: any) => (
                          <Tr key={notification._id}>
                            <Text fontSize="sm" style={{ fontWeight: "bold" }}>
                              {notification.title}
                            </Text>
                            <Text fontSize="sm">{notification.info}</Text>
                            <br />
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  d="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pb={4}
                >
                  <Box fontSize="sm">{"\0"}</Box>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
            <Popover placement="bottom" closeOnBlur={false}>
              <PopoverTrigger>
                <Button>
                  <Icon as={MdPerson} color="gray.500" size="sm" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                color={useColorModeValue("gray.800", "white")}
                bg={useColorModeValue("gray.50", "gray.700")}
                borderColor="blue.800"
                rounded="lg"
                shadow="lg"
              >
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  {getcookie("name", true)}
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>Welcome to HomeNode!</PopoverBody>
                <PopoverFooter
                  border="0"
                  d="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pb={4}
                >
                  <Box fontSize="sm">{"\0"}</Box>
                  <ButtonGroup size="sm">
                    <Button
                      colorScheme="blue"
                      onClick={() => goToSettingsOnPopover()}
                    >
                      Settings
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => signoutOnPopover()}
                    >
                      Sign out
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>

        <Box as="main" p="4">
          <Switch>
            <Route path={`${match.path}/home`}>
              <Home />
            </Route>
            <Route path={`${match.path}/wiki/module/intruders`}>
              <WikiIntruders />
            </Route>
            <Route path={`${match.path}/wiki/module/plant`}>
              <WikiPlant />
            </Route>
            <Route path={`${match.path}/wiki/module/sensors`}>
              <WikiSensors />
            </Route>
            <Route path={`${match.path}/settings`}>
              <Settings />
            </Route>
            <Route path={match.path}>
              <Home />
            </Route>
          </Switch>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
