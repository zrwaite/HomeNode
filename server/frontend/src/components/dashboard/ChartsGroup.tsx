import React from "react";
import SensorGraphs from "./SensorGraphs";
import IntrusionDetectionArea from "./IntrusionDetectionArea"

function ChartsGroup() {
  return (
    <div>
      <IntrusionDetectionArea />
      <SensorGraphs />
    </div>
  );
}

export default ChartsGroup;
