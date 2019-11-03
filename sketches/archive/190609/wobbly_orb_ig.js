import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { createSphere } from "../../../util";

const settings = {
  animate: true,
  duration: 3,
  dimensions: [1080, 1080],
  fps: 24
};

// Start the sketch
canvasSketch(() => {
  return props => {
    let lines = [];

    const t = Math.sin(props.playhead * Math.PI);

    lines.push(
      ...createSphere({
        center: [props.width * 0.5, props.height * 0.5],
        radius: Math.min(props.width, props.height) * 0.35,
        frequency: 5,
        amplitude: 0.8,
        shellLines: 100,
        arcSteps: 300,
        arcLength: 1,
        seed: "abbeysta",
        t: t * 0.5,
        rotation: {
          x: Math.PI * 0.5,
          y: 0,
          z: 0
        }
      })
    );

    return renderPolylines(lines, {
      ...props,
      foreground: "#b38de8",
      background: "#634291"
    });
  };
}, settings);
