import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { createGrid } from "../../../../util";
import { lerp, clamp } from "canvas-sketch-util/math";

const settings = {
  // Enable an animation loop
  animate: true,
  // Set loop duration to 3
  duration: 10,
  // Use a small size for better GIF file size
  dimensions: [1080, 1080],
  // Optionally specify a frame rate, defaults to 30
  fps: 24
};

// Start the sketch
canvasSketch(() => {
  return props => {
    random.setSeed("395589");

    let lines = [];
    const margin = Math.min(props.width, props.height) * 0.1;

    const cols = 240;
    const rows = Math.round(cols * (11 / 14));
    const freq = 3;
    const amp = 1;
    const clampAt = 0.2 * amp;
    const t = Math.sin(props.playhead * Math.PI);

    const points = createGrid(cols, rows).map(point => {
      const [u, v] = point;
      const noise = random.noise3D(u, v, t, freq, amp);
      const posNoise = clamp(noise, -clampAt, clampAt);
      return {
        position: [
          lerp(margin, props.width - margin, u + posNoise * 0.03),
          lerp(margin, props.height - margin, v + posNoise * 0.05)
        ],
        noise
      };
    });

    for (let r = 0; r < rows; r++) {
      let rowLine = [];
      for (let c = 0; c < cols; c++) {
        const point = points[c * rows + r].position;
        rowLine.push(point);
      }
      if (r % 2 === 0) {
        rowLine.reverse();
      }
      lines.push(rowLine);
    }

    return renderPolylines(lines, {
      ...props,
      foreground: "#bde684",
      background: "#526b30"
    });
  };
}, settings);
