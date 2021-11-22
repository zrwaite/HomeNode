import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

function WikiSensors() {
  return (
    <Flex alignItems="start" flexDirection="column" gap="500px">
      <Heading size="2xl">Sensors Module</Heading>
      <Heading size="xl">Summary</Heading>
      <Text>
        Sensors are the main way to get information about the state of the
        system. They are used to get information about the state of the system.
      </Text>
    </Flex>
  );
}

export default WikiSensors;
