const paper = require("paper/dist/paper-core");
import random from "canvas-sketch-util/random";
const math = require("canvas-sketch-util/math");

const createGrid = require("../../util/createGrid.js");

// Only executed our code once the DOM is ready.
window.onload = function() {
  const canvas = document.getElementById("myCanvas");
  paper.setup(canvas);
  const { width, height } = paper.view.size;
  const meas = Math.max(width, height) * 0.05;

  const points = [];
  const cols = 24;
  const rows = 16;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const u = x / (cols - 1);
      const v = y / (rows - 1);
      if (x === 0 && y === 0) {
        console.log(random.noise2D(u, v));
      }
      points.push({
        uv: [u, v],
        noise: random.noise2D(u, v)
      });
    }
  }

  const margin = meas;
  let path = new paper.Path();

  points.forEach((point, i) => {
    const x = math.lerp(margin, width - margin, point.uv[0]);
    const y = math.lerp(margin, height - margin, point.uv[1]);
    const radius = meas * 0.35 + meas * point.noise * 0.65;
    const circle = new paper.Path.Circle([x, y], radius);
    path = path.unite(circle);
    circle.strokeColor = "blue";
    circle.remove();
  });

  path.strokeColor = "red";

  // Draw the view now:
  paper.view.draw();
  // log SVG node to console
  console.log(paper.project.exportSVG());
};
