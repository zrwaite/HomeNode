import React from "react";
import AboutCard from "./AboutCard";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { MdHeadset } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";

function About() {
  return (
    <div>
      <Flex
        bg={useColorModeValue("#F9FAFB", "gray.600")}
        px={50}
        py={50}
        w="full"
        alignItems="center"
        justifyContent="center"
      >
        <AboutCard
          name="Zac Waite"
          role_emoji={MdHeadset}
          emoji_color="white"
          role_description="Role"
          description="[Placeholder description] Full Stack maker & UI / UX Designer , love hip hop music Author of
          Building UI."
          university="University of Waterloo Software Engineering"
          email="userid@uwaterloo.ca"
        />
        <AboutCard
          name="George Shao"
          role_emoji={HiOutlineSparkles}
          emoji_color="yellow"
          role_description="Frontend Developer"
          description="Hackathon Fanatic & 2x VC Grantee."
          university="University of Waterloo Software Engineering"
          email="g6shao@uwaterloo.ca"
        />
        <AboutCard
          name="Steven Gong"
          role_emoji={MdHeadset}
          emoji_color="white"
          role_description="Role"
          description="[Placeholder description] Full Stack maker & UI / UX Designer , love hip hop music Author of
          Building UI."
          university="University of Waterloo Software Engineering"
          email="userid@uwaterloo.ca"
        />
        <AboutCard
          name="Hargun Mujral"
          role_emoji={MdHeadset}
          emoji_color="white"
          role_description="Role"
          description="[Placeholder description] Full Stack maker & UI / UX Designer , love hip hop music Author of
          Building UI."
          university="University of Waterloo Software Engineering"
          email="userid@uwaterloo.ca"
        />
        <AboutCard
          name="Michael Dennisov"
          role_emoji={MdHeadset}
          emoji_color="white"
          role_description="Role"
          description="[Placeholder description] Full Stack maker & UI / UX Designer , love hip hop music Author of
          Building UI."
          university="University of Waterloo Software Engineering"
          email="userid@uwaterloo.ca"
        />
      </Flex>
    </div>
  );
}

export default About;
