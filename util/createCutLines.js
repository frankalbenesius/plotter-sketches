export default (width, height, margin, length) => {
  let lines = [];
  lines.push([
    [margin, margin + length],
    [margin, margin],
    [margin + length, margin]
  ]);
  lines.push([
    [width - margin - length, margin],
    [width - margin, margin],
    [width - margin, margin + length]
  ]);
  lines.push([
    [width - margin, height - margin - length],
    [width - margin, height - margin],
    [width - margin - length, height - margin]
  ]);
  lines.push([
    [margin + length, height - margin],
    [margin, height - margin],
    [margin, height - margin - length]
  ]);
  return lines;
};
