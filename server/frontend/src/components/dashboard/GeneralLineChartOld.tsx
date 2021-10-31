import React, { useState } from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  Crosshair,
  LineSeries,
} from "react-vis";

function LineChart(props: any) {
  const [crosshairValues, setCrosshairValues] = useState([{
    x: 0,
    y: 0,
  }]);

  return (
    <div>
      <XYPlot
        height={300}
        width={300}
        onMouseLeave={() => setCrosshairValues([{ x: 0, y: 0 }])}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries
          data={props.data}
          onNearestX={(value, { index }): any =>
            setCrosshairValues([
              {
                x: props.data.map((d: any) => d["x"])[index],
                y: props.data.map((d: any) => d["y"])[index],
              },
            ])
          }
        />
        <Crosshair values={crosshairValues} />
      </XYPlot>
    </div>
  );
}

export default LineChart;
