import React from "react";
import { Flex, Heading, Text, SimpleGrid, Image } from "@chakra-ui/react";
import imagesensors1 from "../../assets/imagesensors1.jpg";

function WikiSensors() {
  return (
    <Flex alignItems="start" flexDirection="column" gap="500px">
      <Heading size="2xl">Sensors Module</Heading>
      <br />
      <Heading size="xl">Summary</Heading>
      <Text>
        Sensors are the main way to get information about the state of the
        system. They are used to get information about the state of the system.
      </Text>
      <br />
      <Heading size="xl">Components</Heading>
      <Text>The sensors module contains the following sensors:</Text>
      <br />
      <Heading size="l">Temperature Sensor</Heading>
      <Text>This sensor is used to get the temperature of the system.</Text>
      <Text>
        It returns the temperature in Celsius. Room temperature is 20 degrees
        Celsius.
      </Text>
      <br />
      <Heading size="l">Humidity Sensor</Heading>
      <Text>This sensor is used to get the humidity of the system.</Text>
      <Text>
        It returns the humidity in %. A typical value for humidity is 35-60%.
      </Text>
      <br />
      <Heading size="l">Light Level Sensor</Heading>
      <Text>
        This sensor is used to get the light level of the system. 0% is no light
        while 100% is extremely bright.
      </Text>
      <Text>It returns the light level in %.</Text>
      <br />
      <Heading size="xl">Image Gallery</Heading>
      <br />
      <SimpleGrid columns={3} spacing={10}>
        <Image src={imagesensors1} alt="Intruder" height="500px" />
      </SimpleGrid>
    </Flex>
  );
}

export default WikiSensors;
