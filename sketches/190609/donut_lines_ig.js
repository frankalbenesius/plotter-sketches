import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import createDonutLines from "../../util/createDonutLines";

const settings = {
  animate: true,
  duration: 4,
  dimensions: [1080, 1080],
  fps: 24
};

// Start the sketch
canvasSketch(() => {
  return props => {
    let lines = [];

    const parts = 300;
    const resolution = 100;

    const donutRadius = Math.min(props.width, props.height) * 0.25;
    lines.push(
      ...createDonutLines(
        [props.width * 0.5, props.height * 0.5],
        parts,
        resolution,
        donutRadius,
        "trip",
        Math.sin(props.playhead * Math.PI) * 800
      )
    );

    return renderPolylines(lines, {
      ...props,
      foreground: "#924249",
      background: "#f3c5c8"
    });
  };
}, settings);
