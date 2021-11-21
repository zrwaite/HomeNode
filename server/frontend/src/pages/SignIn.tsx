import React, { useState } from "react";
import {
  chakra,
  Box,
  GridItem,
  useColorModeValue,
  Button,
  Center,
  Flex,
  SimpleGrid,
  VisuallyHidden,
  Input,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import getcookie from "../getcookie";

const cookies = new Cookies();

interface CustomJWT {
  home_id: string;
}

const SignIn = () => {
  let history = useHistory();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("POST SIGNIN");
    axios
      .post("http://homenode.tech/auth/signin", {
        username: Email,
        password: Password,
      })
      .then((res: any) => {
        cookies.set("email", Email, { path: "/" });
        const token = res.data.response.token;
        cookies.set("token", token, { path: "/" });
        try {
          let decoded = jwt_decode<CustomJWT>(token || "") || null;
          console.log("DECODE TOKEN:", decoded);
          if (decoded) {
            cookies.set("home_id", decoded.home_id, {
              path: "/",
            });
          }
        } catch (e) {
          cookies.set("home_id", "INVALID_HOMEID", { path: "/" });
        }
        history.push("/dashboard");
      })
      .then(() => {
        console.log("GET NAME");
        axios
          .get(
            "http://homenode.tech/api/user?username=" + getcookie("email", true)
          )
          .then((res: any) => {
            cookies.set("name", res.data.response.name, { path: "/" });
          })
          .catch((err: any) => {
            console.log("ERROR SIGNIN", err);
          });
        axios
          .get("http://homenode.tech/api/home?id=" + getcookie("home_id", true))
          .then((res: any) => {
            let module_list = res.data.response.result.modules;
            module_list.forEach((module: any) => {
              if (module.type === "sensors") {
                cookies.set("sensors_id", module.module_id, { path: "/" });
              } else if (module.type === "intruders") {
                cookies.set("intruders_id", module.module_id, { path: "/" });
              }
            });
          });
      })
      .catch((err: any) => {
        console.log("ERROR SIGNIN", err);
      });
  };

  return (
    <>
      <Navbar />
      <Box px={8} py={24} mx="auto">
        <SimpleGrid
          alignItems="center"
          w={{ base: "full", xl: 11 / 12 }}
          columns={{ base: 1, lg: 11 }}
          gap={{ base: 0, lg: 24 }}
          mx="auto"
        >
          <GridItem
            colSpan={{ base: "auto", lg: 7 }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <chakra.h1
              mb={4}
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              lineHeight={{ base: "shorter", md: "none" }}
              color={useColorModeValue("gray.900", "gray.200")}
              letterSpacing={{ base: "normal", md: "tight" }}
            >
              Welcome back!
            </chakra.h1>
            <chakra.p
              mb={{ base: 10, md: 4 }}
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.500"
              letterSpacing="wider"
            >
              Let's get you monitoring, controlling, and automating your home
              right now.
            </chakra.p>
          </GridItem>
          <GridItem colSpan={{ base: "auto", md: 4 }}>
            <Box as="form" mb={6} rounded="lg" shadow="xl">
              <Center pb={0} color={useColorModeValue("gray.700", "gray.600")}>
                <chakra.p
                  mb={{ base: 10, md: 4 }}
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.500"
                  letterSpacing="wider"
                >
                  Sign In
                </chakra.p>
              </Center>
              <SimpleGrid
                columns={1}
                px={6}
                py={4}
                spacing={4}
                borderBottom="solid 1px"
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <Flex>
                  <VisuallyHidden>Email</VisuallyHidden>
                  <Input
                    mt={0}
                    type="email"
                    placeholder="Email"
                    isRequired={true}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </Flex>
                <Flex>
                  <VisuallyHidden>Password</VisuallyHidden>
                  <Input
                    mt={0}
                    type="password"
                    placeholder="Password"
                    isRequired={true}
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </Flex>
                <Button
                  colorScheme="brand"
                  w="full"
                  py={2}
                  type="submit"
                  onClick={(e: any) => handleSubmit(e)}
                >
                  Sign In
                </Button>
              </SimpleGrid>
            </Box>
            <chakra.p fontSize="xs" textAlign="center" color="gray.600">
              Don't have an account?{" "}
              <chakra.a
                color="brand.500"
                onClick={() => history.push("/signup")}
                cursor="pointer"
              >
                Sign up here.
              </chakra.a>
            </chakra.p>
          </GridItem>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default SignIn;
