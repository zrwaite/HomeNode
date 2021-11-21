import {
  Avatar,
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
  useToast,
} from "@chakra-ui/react";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { FiMenu, FiSearch } from "react-icons/fi";
import { HiCode } from "react-icons/hi";
import { MdHome, MdKeyboardArrowRight } from "react-icons/md";
import React, { useContext } from "react";
import logo from "../../assets/logo.svg";
import UserContext from "../../User";

import Home from "../../pages/dashboard/Home";
import Settings from "../../pages/dashboard/Settings";
import WikiIntruders from "../../pages/dashboard/WikiIntruders";
import WikiPlant from "../../pages/dashboard/WikiPlant";
import WikiSensors from "../../pages/dashboard/WikiSensors";

function Sidebar() {
  const sidebar = useDisclosure();
  const integrations = useDisclosure();
  let match = useRouteMatch();
  const history = useHistory();
  const user = useContext(UserContext);
  const toast = useToast()

  function switchPages(page: string) {
    if (page === "wiki") {
      integrations.onToggle();
    } else {
      history.push(`${match.url}/${page}`);
      user.currentPage = page;
      console.log(user.currentPage, page);
    }
  }

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
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
            <Avatar
              ml="4"
              size="sm"
              name="xx"
              src="https://avatars.githubusercontent.com/u/31512688?v=4"
              cursor="pointer"
            />
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
