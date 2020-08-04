
function drawClock(clockSize) {

  if (Y + radius / 4.0 <= 0) {

    if (clockFrame != null)
      blend(clockFrame, 0, 0, clockFrame.width, clockFrame.height,
        Math.round(width / 2 - clockSize / 2), Math.round(height / 2 - clockSize / 2),
        clockFrame.width, clockFrame.height, BLEND);
    else {
      clockFrame = get(width / 2 - clockSize / 2,
        height / 2 - clockSize / 2,
        clockSize, clockSize);
      clockStartTime = millis();
    }

    noStroke();
    fill(128, 128, 128, 63);
    ellipseMode(CORNER);
    arc(width / 2 - clockSize / 2,
      height / 2 - clockSize / 2,
      clockSize, clockSize,
      (millis() - clockStartTime) / clockMaxTime * TWO_PI, TWO_PI, PIE);

  } else {

    if (clockFrame != null) {

      set(width / 2 - clockSize / 2,
        height / 2 - clockSize / 2, clockFrame);
      clockFrame = null;
      clockStartTime = 0;
    }
  }
}
