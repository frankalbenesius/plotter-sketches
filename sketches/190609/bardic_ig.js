import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import { createNoisyLines } from "../../util";

const settings = {
  animate: true,
  duration: 9,
  dimensions: [1080, 1080],
  fps: 24
};

// Start the sketch
canvasSketch(() => {
  return props => {
    let lines = [];

    const margin = Math.max(props.width, props.height) / 30;

    lines.push(
      ...createNoisyLines(
        [0, 0],
        [props.width, props.height],
        0.5,
        0.73,
        0.5,
        0.005,
        0.8,
        0,
        " sss",
        Math.sin(props.playhead * Math.PI)
      )
    );

    const box = [margin, margin, props.width - margin, props.height - margin];
    lines = clipPolylinesToBox(lines, box);

    return renderPolylines(lines, {
      ...props,
      foreground: "#a5ceec",
      background: "#5089b1"
    });
  };
}, settings);
