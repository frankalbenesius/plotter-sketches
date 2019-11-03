import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import { settings } from "../../../util";
import createDonutLines from "../../util/createDonutLines";

const sketch = ({ width, height }) => {
  let primaryLines = [];
  let secondaryLines = [];

  const parts = 150;
  const resolution = 80;
  const radius = Math.min(width, height) * 0.09;
  const frequency = 0.002;
  const amplitude = 1;

  const baseX = width * 0.35;
  const baseY = height * 0.5;
  const spacer = width * 0.075; // half of distance between two points horizontally
  const primaryPoints = [
    [baseX - spacer, baseY - spacer * 2], // top left
    [baseX, baseY - spacer], // top middle
    [baseX + spacer, baseY], // middle right
    [baseX, baseY + spacer], // bottom middle
    [baseX - spacer, baseY + spacer * 2] // bottom left
  ];
  const secondaryPoints = [
    [baseX + spacer, baseY - spacer * 2], // top right
    [baseX - spacer, baseY], // middle left
    [baseX + spacer, baseY + spacer * 2] // bottom right
  ];

  const seed = random.getRandomSeed();
  const time = 0;
  primaryPoints.forEach(point => {
    const donutLines = createDonutLines(
      point,
      parts,
      resolution,
      radius,
      seed,
      time,
      frequency,
      amplitude
    );
    primaryLines.push(...donutLines);
  });

  secondaryPoints.forEach(point => {
    const donutLines = createDonutLines(
      point,
      parts,
      resolution,
      radius,
      seed,
      time,
      frequency,
      amplitude
    );
    secondaryLines.push(...donutLines);
  });

  return props =>
    renderPolylines(primaryLines, secondaryLines, {
      ...props,
      lineWidth: 1.1,
      foreground: "#5BB65B",
      secondaryForeground: "#DDDDDD",
      secondaryLineWidth: 0.9,
      background: "#333E48"
    });
};

canvasSketch(sketch, settings.workScreen);

/*
copy of canvas-sketch-util's renderPolylines
https://github.com/mattdesl/canvas-sketch-util/blob/master/penplot.js
*/

const renderPolylines = function(primaryPolylines, secondaryPolylines, opt) {
  opt = opt || {};

  var context = opt.context;
  if (!context) throw new Error('Must specify "context" options');

  var width = opt.width;
  var height = opt.height;
  if (typeof width === "undefined" || typeof height === "undefined") {
    throw new Error('Must specify "width" and "height" options');
  }

  // Choose a default line width based on a relatively fine-tip pen
  var lineWidth = opt.lineWidth;
  var secondaryLineWidth = opt.secondaryLineWidth;
  if (typeof width === "undefined" || typeof height === "undefined") {
    throw new Error('Must specify "lineWidth" option');
  }

  // Clear canvas
  context.clearRect(0, 0, width, height);

  // Fill with background or white
  context.fillStyle = opt.background || "white";
  context.fillRect(0, 0, width, height);

  // Draw lines
  secondaryPolylines.forEach(function(points) {
    context.beginPath();
    points.forEach(function(p) {
      context.lineTo(p[0], p[1]);
    });
    context.strokeStyle = opt.secondaryForeground || opt.strokeStyle || "black";
    context.lineWidth = secondaryLineWidth;
    context.lineJoin = opt.lineJoin || "round";
    context.lineCap = opt.lineCap || "round";
    context.stroke();
  });
  primaryPolylines.forEach(function(points) {
    context.beginPath();
    points.forEach(function(p) {
      context.lineTo(p[0], p[1]);
    });
    context.strokeStyle = opt.foreground || opt.strokeStyle || "black";
    context.lineWidth = lineWidth;
    context.lineJoin = opt.lineJoin || "round";
    context.lineCap = opt.lineCap || "round";
    context.stroke();
  });

  // Save layers
  return [
    // Export PNG as first layer
    context.canvas
  ];
};
