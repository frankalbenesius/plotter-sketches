import random from "canvas-sketch-util/random";

/**
 * sets and logs a random string
 * @param {string} hardcodedSeed for testing hardcoded seeds
 */
export default function logSeed(hardcodedSeed) {
  const seedString = hardcodedSeed || random.getRandomSeed();
  random.setSeed(seedString);
  console.info("RANDOM SEED:", `"${random.getSeed()}"`);
}
