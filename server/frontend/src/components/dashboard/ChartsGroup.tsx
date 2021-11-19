import React from "react";
import { Box } from "@chakra-ui/react";
import SensorGraphs from "./SensorGraphs";
import IntrusionDetectionArea from "./IntrusionDetectionArea";

function ChartsGroup() {
  return (
    <div>
      <IntrusionDetectionArea />
      <Box h={4} />
      <SensorGraphs />
    </div>
  );
}

export default ChartsGroup;
