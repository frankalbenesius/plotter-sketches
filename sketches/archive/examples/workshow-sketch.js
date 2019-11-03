const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048]
};

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  const colorCount = random.rangeFloor(3, 5);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 60;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u * 0.2, v * 0.2)) * 0.15;
        points.push({
          rotation: random.noise2D(u, v),
          color: random.pick(palette),
          radius: radius,
          position: [u, v]
        });
      }
    }
    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(point => {
      const { position, radius, color, rotation } = point;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2);
      // context.fillStyle = color;
      // context.fill();

      context.save();

      context.fillStyle = color;
      context.font = `${radius * width}px "Vulf Mono"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText("=", 0, 0);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
