const paper = require("../../node_modules/paper/dist/paper-core");

// Only executed our code once the DOM is ready.
window.onload = function() {
  const canvas = document.getElementById("myCanvas");
  paper.setup(canvas);
  const { width, height } = paper.view.size;
  const meas = Math.max(width, height) * 0.1;

  const circle = new paper.Path.Circle([width / 3, height / 2], meas);
  circle.strokeColor = "black";

  const clone = circle.clone();
  clone.position.x = clone.position.x + meas;

  const cut = clone.subtract(circle);
  cut.position.x += meas;

  clone.position.x -= 2 * meas;
  clone.unite(circle);
  clone.remove();
  circle.remove();

  // Draw the view now:
  paper.view.draw();
  // log SVG node to console
  console.log(paper.project.exportSVG());
};
