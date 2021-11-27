import React from "react";
import { Flex, Heading, Text, SimpleGrid, Image } from "@chakra-ui/react";
import imageintruders1 from "../../assets/imageintruders1.jpg";
import imageintruders2 from "../../assets/imageintruders2.jpg";
import imageintruders3 from "../../assets/imageintruders3.jpg";
import imageintruders4 from "../../assets/imageintruders4.jpg";
import imageintruders5 from "../../assets/imageintruders5.jpg";
import imageintruders6 from "../../assets/imageintruders6.jpg";


function WikiIntruders() {
  return (
    <Flex alignItems="start" flexDirection="column" gap="500px">
      <Heading size="2xl">Intruders Module</Heading>
      <br />
      <Heading size="xl">Summary</Heading>
      <Text>
        The intruders module is used to detect intruders and alert the user in
        the event that suspicious activity is detected in their home.
      </Text>
      <br />
      <Heading size="xl">Components</Heading>
      <Text>The intruders module contains the following sensors:</Text>
      <br />
      <Heading size="l">Motion Sensor</Heading>
      <Text>The sensor detects motion in a specific area of one's house.</Text>
      <Text>It returns a boolean (true/false) value.</Text>
      <br />
      <Heading size="l">Window Sensor</Heading>
      <Text>
        This sensor detects whether a window has been opened or closed.
      </Text>
      <Text>It returns a boolean (true/false) value.</Text>
      <br />
      <Heading size="l">Door Sensor</Heading>
      <Text>This sensor detects whether a door has been opened or closed.</Text>
      <Text>It returns a boolean (true/false) value.</Text>
      <br />
      <Heading size="xl">Components</Heading>
      <br />
      <SimpleGrid columns={3} spacing={10}>
      <Image
          src={imageintruders1}
          alt="Intruder"
          height="500px"
        />
        <Image
          src={imageintruders2}
          alt="Intruder"
          height="500px"
        />
        <Image
          src={imageintruders3}
          alt="Intruder"
          height="500px"
        />
        <Image
          src={imageintruders4}
          alt="Intruder"
          height="500px"
        />
        <Image
          src={imageintruders5}
          alt="Intruder"
          height="500px"
        />
        <Image
          src={imageintruders6}
          alt="Intruder"
          height="500px"
        />
      </SimpleGrid>
    </Flex>
  );
}

export default WikiIntruders;
