const paper = require("../node_modules/paper/dist/paper-core");

// Only executed our code once the DOM is ready.
window.onload = function() {
  console.log(paper.project.exportSVG());
};
