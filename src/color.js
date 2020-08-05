
function pickColor(x, y, size, level) {
  push();
  stroke(255, 255, 255, 60);
  rectMode(CENTER);
  colorMode(HSB, 255);
  for (i = 0; i < 256; i++) {
    fill(i, 200, 120);
    rect(x, y - 256 / 2.0 + i, size, 1);
  }
  stroke(255);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  level = max(min(256 / 2 - size / 2, level), -256 / 2 + size / 2);
  rect(x, y + level, size, size);
  
  var h = Math.round(map(level, -256 / 2 + size / 2, 256 / 2 - size / 2, 0, 255));
  res = color(h, 200, 120);
  fill(res);
  rect(x + size * 4, y, size * 5, size * 5);
  colorMode(RGB, 255);
  pop();
  return res;
}
