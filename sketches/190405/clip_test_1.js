import canvasSketch from "canvas-sketch";
import { renderPolylines } from "canvas-sketch-util/penplot";
import { clipPolylinesToBox } from "canvas-sketch-util/geometry";
import random from "canvas-sketch-util/random";
import { lerp } from "canvas-sketch-util/math";
import { settings } from "../../util";
import polygonClipping from "polygon-clipping";
import * as martinez from "martinez-polygon-clipping";

const sketch = ({ width, height }) => {
  let lines = [];
  const margin = Math.max(width, height) / 20;

  const boxLine = [
    [margin * 4, margin * 4],
    [width - margin * 4, margin * 4],
    [width - margin * 4, height - margin * 4],
    [margin * 4, height - margin * 4],
    [margin * 4, margin * 4]
  ];
  // lines.push(boxLine);

  const horizontalLine = [[margin, height / 2], [width - margin, height / 2]];
  const r = martinez.diff([horizontalLine], [boxLine]);
  console.log(r);
  lines.push(r[0][0]);
  // none of this works like i want

  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);
  return props => renderPolylines(lines, props);
};

canvasSketch(sketch, settings.playground);
