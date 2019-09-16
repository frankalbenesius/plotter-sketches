const paper = require("paper/dist/paper-core");
import random from "canvas-sketch-util/random";
const math = require("canvas-sketch-util/math");

const createGrid = require("../../util/createGrid.js");

// Only executed our code once the DOM is ready.
window.onload = function() {
  const debug = false;
  const canvas = document.getElementById("myCanvas");
  paper.setup(canvas);
  const { width, height } = paper.view.size;
  const meas = Math.max(width, height) * 0.05;

  const margin = width / 24;
  const bounds = paper.Path.Rectangle({
    topLeft: new paper.Point(margin, margin),
    bottomRight: new paper.Point(width - margin, height - margin)
  });
  bounds.strokeColor = "blue";

  const armWidth = meas * 1;
  const maxArmAngle = 20;
  const freq = 2;
  const amp = 1;

  const cols = 20;
  const rows = 9;

  const strokedArms = [];
  for (let y = rows - 1; y > 0; y--) {
    const rowArmPaths = [];
    for (let x = 0; x < cols; x++) {
      const u = x / (cols - 1);
      const v = y / (rows - 1);
      const noise = random.noise2D(u, v, freq, amp);
      const armAngle = math.lerp(-maxArmAngle, maxArmAngle, Math.abs(noise));
      const armPath = createArmPath(
        new paper.Point(
          math.lerp(0, width, u),
          math.lerp(0, height, v) + armWidth * 0
        ),
        armWidth,
        armAngle,
        debug
      );
      rowArmPaths.push(armPath);
    }
    const shuffledArmPaths = random.shuffle(rowArmPaths);

    shuffledArmPaths.forEach(armPath => {
      const armWithStrokedArmsRemoved = strokedArms.reduce(
        (workingArm, strokedArmPath) => {
          const newWorkingArm = workingArm.subtract(strokedArmPath, {
            insert: true
          });
          workingArm.remove();
          return newWorkingArm;
        },
        armPath
      );
      const boundedArm = armWithStrokedArmsRemoved.intersect(bounds);
      armWithStrokedArmsRemoved.remove();
      boundedArm.strokeColor = "black";
      strokedArms.push(boundedArm);
    });
  }
  bounds.remove();

  paper.view.draw();
  // log SVG node to console
  console.log(paper.project.exportSVG());
};

function createArmPath(armOriginPt, armWidth, armAngle, debug = false) {
  let armPath = new paper.Path();
  const points = getHandPoints(armOriginPt, armWidth, armAngle);

  const forearmWidth = armWidth * 0.7;
  const foreArm = new paper.Path.Rectangle({
    bottomLeft: new paper.Point(
      points.arm.x - forearmWidth * 0.5,
      points.arm.y
    ),
    topRight: new paper.Point(
      points.wrist.x + forearmWidth * 0.5,
      points.wrist.y
    )
    // radius: fingerWidth * 0.1
  });
  foreArm.rotate(armAngle, points.arm);
  armPath = armPath.unite(foreArm);
  foreArm.remove();

  const palm = new paper.Path.Rectangle({
    topLeft: new paper.Point(
      points.palm.x - armWidth * 0.5,
      points.palm.y - armWidth * 0.5
    ),
    bottomRight: new paper.Point(
      points.palm.x + armWidth * 0.5,
      points.palm.y + armWidth * 0.5
    ),
    radius: armWidth * 0.1
  });

  const baseFingerWidth = palm.bounds.width * 0.22;
  const baseFingerLength = palm.bounds.width * 0.9;

  const pinkyFinger = createFingerPath(
    points.pinky,
    baseFingerWidth,
    baseFingerLength * 0.88,
    12
  );

  const ringFinger = createFingerPath(
    points.ring,
    baseFingerWidth,
    baseFingerLength,
    5
  );
  const middleFinger = createFingerPath(
    points.middle,
    baseFingerWidth,
    baseFingerLength * 1.08,
    -5
  );
  const indexFinger = createFingerPath(
    points.index,
    baseFingerWidth,
    baseFingerLength,
    -12
  );
  const thumbFinger = createFingerPath(
    points.thumb,
    baseFingerWidth * 1.2,
    baseFingerLength,
    -45
  );

  const handPath = palm
    .unite(pinkyFinger, { insert: false })
    .unite(ringFinger, { insert: false })
    .unite(middleFinger, { insert: false })
    .unite(indexFinger, { insert: false })
    .unite(thumbFinger, { insert: false });
  palm.remove();
  pinkyFinger.remove();
  ringFinger.remove();
  middleFinger.remove();
  indexFinger.remove();
  thumbFinger.remove();

  const handAngle = armAngle * 1.5; // adds to armAngle
  handPath.rotate(armAngle, points.arm);
  const rotatedWristPt = points.wrist.rotate(armAngle, points.arm);
  handPath.rotate(handAngle, rotatedWristPt);
  const combinedPath = armPath.unite(handPath);
  handPath.remove();
  armPath.remove();

  if (debug) {
    Object.keys(points).forEach(key => {
      const pt = points[key];
      if (key === "arm") {
        addDebugPt(pt);
      } else {
        // rotating non-arm points by arm and then wrist angle for debugging reasons
        addDebugPt(
          pt.rotate(armAngle, points.arm).rotate(handAngle, rotatedWristPt)
        );
      }
    });
  }

  return combinedPath;
}

function addDebugPt(pt, color = "red", radius = 2) {
  const circle = new paper.Path.Circle(pt, radius);
  circle.strokeColor = color;
}

function createFingerPath(pt, width, length, angle) {
  const fingerPath = new paper.Path.Rectangle({
    bottomLeft: new paper.Point(pt.x - width * 0.5, pt.y + width * 0.5),
    topRight: new paper.Point(pt.x + width * 0.5, pt.y + width * 0.5 - length),
    radius: width * 0.6
  });
  fingerPath.rotate(angle, pt);
  return fingerPath;
}

function getHandPoints(armOriginPt, armWidth) {
  const armPt = new paper.Point(armOriginPt);
  const wristPt = new paper.Point(armPt);
  wristPt.y -= armWidth * 2;

  const palmPt = new paper.Point(wristPt);
  palmPt.y -= armWidth * 0.35;

  const pinkyPt = new paper.Point(palmPt);
  pinkyPt.x += armWidth * (3 / 8);
  pinkyPt.y -= armWidth * (3 / 8);
  const ringPt = new paper.Point(pinkyPt);
  ringPt.x -= armWidth * (1 / 4);
  const middlePt = new paper.Point(ringPt);
  middlePt.x -= armWidth * (1 / 4);
  const indexPt = new paper.Point(middlePt);
  indexPt.x -= armWidth * (1 / 4);
  const thumbPt = new paper.Point(palmPt);
  thumbPt.x -= armWidth * (3 / 8);
  thumbPt.y += armWidth * (5 / 16);

  return {
    wrist: wristPt,
    arm: armPt,
    palm: palmPt,
    pinky: pinkyPt,
    ring: ringPt,
    middle: middlePt,
    index: indexPt,
    thumb: thumbPt
  };
}

// let armA = createArmPath(
//   new paper.Point(width * 0.47, height * 0.65),
//   width * 0.06,
//   15
// );
// armA.strokeColor = "green";

// let armB = createArmPath(
//   new paper.Point(width * 0.53, height * 0.65),
//   width * 0.06,
//   -15
// );
// armB.strokeColor = "black";

// let newA = armA.subtract(armB);
// newA.strokeColor = "black";
// armA.remove();
// // armB.remove();

// // const thing = bounds.intersect(result);
// let newerA = bounds.intersect(newA);
// newA.remove();
// // thing.remove();
// // result.remove();
// bounds.remove();
