import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";

function WikiPlant() {
  return (
    <Flex alignItems="start" flexDirection="column" gap="500px">
      <Heading size="2xl">Plant Module</Heading>
      <br />
      <Heading size="xl">Summary</Heading>
      <Text>
        The plant module is responsible for monitoring the plant and maintaining
        it's wellbeing.
      </Text>
      <br />
      <Heading size="xl">Components</Heading>
      <Text>The plant module contains the following components:</Text>
      <br />
      <Heading size="l">Moisture Sensor</Heading>
      <Text>
        This sensor is used to get the moisture of the system. A typical value
        for moisture is 35-60%.
      </Text>
      <Text>It returns the moisture in %.</Text>
      <br />
      <Heading size="l">Light Level Sensor</Heading>
      <Text>
        This sensor is used to get the light level of the system. 0% is no light
        while 100% is extremely bright.
      </Text>
      <Text>It returns the light level in %.</Text>
      <br />
      <Heading size="l">Watering Mechanism</Heading>
      <Text>This mechanism waters the plant.</Text>
      <br />
      <Heading size="l">Light Switch</Heading>
      <Text>
        A simple light switch that turns on and off the light near the plant.
      </Text>
      <br />
    </Flex>
  );
}

export default WikiPlant;
