import React from "react";
import { Flex, Heading, Text, SimpleGrid, Image } from "@chakra-ui/react";
import imageplant1 from "../../assets/imageplant1.jpg";
import imageplant2 from "../../assets/imageplant2.jpg";
import imageplant3 from "../../assets/imageplant3.jpg";
import imageplant4 from "../../assets/imageplant4.jpg";
import imageplant5 from "../../assets/imageplant5.jpg";
import imageplant6 from "../../assets/imageplant6.jpg";

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
      <Heading size="xl">Video & Image Gallery</Heading>
      <br />
      <iframe
        width="560"
        height="315"
        src="https://www.youtube-nocookie.com/embed/-wechVphMZE"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <br />
      <SimpleGrid columns={3} spacing={10}>
        <Image src={imageplant3} alt="Plant" height="500px" />
        <Image src={imageplant1} alt="Plant" height="500px" />
        <Image src={imageplant2} alt="Plant" height="500px" />
        <Image src={imageplant4} alt="Plant" height="500px" />
        <Image src={imageplant5} alt="Plant" height="500px" />
        <Image src={imageplant6} alt="Plant" height="500px" />
      </SimpleGrid>
    </Flex>
  );
}

export default WikiPlant;
