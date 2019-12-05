import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings, createSphere, createGrid, logSeed } from "../../util";

const sketch = ({ width, height }) => {
  logSeed();
  let lines = [
    [
      [0, 0],
      [0, 0.0001]
    ],
    [
      [width, height],
      [width, height - 0.0001]
    ]
  ];

  const postcardWidth = width / 3;
  const postcardHeight = height / 3;

  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
      if (col > 0) {
        const postcardCenterX = postcardWidth * col + postcardWidth / 2;
        const postcardCenterY = postcardHeight * row + postcardHeight / 2;
        lines.push(
          ...createSphere({
            center: [postcardCenterX, postcardCenterY],
            radius: Math.min(postcardWidth, postcardHeight) * 0.3,
            frequency: 2,
            amplitude: 1.5,
            shellLines: 40,
            arcSteps: 250,
            arcLength: 1,
            fillLength: 1,
            rotation: {
              x: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
              y: random.range(Math.PI * 0, Math.PI * 0.3) * random.sign(),
              z: 0
            }
          })
        );
      }
    }
  }

  return props =>
    renderPolylines(lines, {
      ...props
    });
};

canvasSketch(sketch, {
  dimensions: [17, 11],
  units: "in",
  pixelsPerInch: 300,
  scaleToView: true
});
