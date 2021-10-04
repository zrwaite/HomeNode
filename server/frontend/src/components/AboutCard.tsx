import React from "react";
import {
  chakra,
  Box,
  Image,
  Flex,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";

const AboutCard = (props: any) => {
  return (
    <Box
      w="sm"
      mx="6"
      bg={useColorModeValue("white", "gray.800")}
      shadow="lg"
      rounded="lg"
      overflow="hidden"
    >
      <Image
        w="full"
        h={56}
        fit="cover"
        objectPosition="center"
        src={props.image}
        alt="avatar"
      />

      <Flex alignItems="center" px={6} py={3} bg="gray.900">
        <Icon as={props.role_emoji} h={6} w={6} color={props.emoji_color} />

        <chakra.h1 mx={3} color="white" fontWeight="bold" fontSize="lg">
          {props.role_description}
        </chakra.h1>
      </Flex>

      <Box py={4} px={6}>
        <chakra.h1
          fontSize="xl"
          fontWeight="bold"
          color={useColorModeValue("gray.800", "white")}
        >
          {props.name}
        </chakra.h1>

        <chakra.p py={2} color={useColorModeValue("gray.700", "gray.400")}>
          {props.description}
        </chakra.p>

        {/* <Flex
          alignItems="center"
          mt={4}
          color={useColorModeValue("gray.700", "gray.200")}
        >
          <Icon as={BsFillBriefcaseFill} h={6} w={6} mr={2} />

          <chakra.h1 px={2} fontSize="sm">
            University of Waterloo
          </chakra.h1>
        </Flex> */}

        <Flex
          alignItems="center"
          mt={4}
          color={useColorModeValue("gray.700", "gray.200")}
        >
          <Icon as={FaUniversity} h={6} w={6} mr={2} />

          <chakra.h1 px={2} fontSize="sm">
            {props.university}
          </chakra.h1>
        </Flex>
        <Flex
          alignItems="center"
          mt={4}
          color={useColorModeValue("gray.700", "gray.200")}
        >
          <Icon as={MdEmail} h={6} w={6} mr={2} />

          <chakra.h1 px={2} fontSize="sm">
            {props.email}
          </chakra.h1>
        </Flex>
      </Box>
    </Box>
  );
};

export default AboutCard;
