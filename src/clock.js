var clockStartTime;

function drawClock(x, y, size, msg, maxTime, callback) {
  push();

  if (clockStartTime == null) {
    clockStartTime = millis();
  }
  
  noStroke();
  fill(255, 255, 255, 60);
  ellipseMode(CENTER);

  //last_frame = get();
  
  if (msg != null) {
    textSize(size / 2.0);
    textAlign(CENTER, BOTTOM);
    text(msg, x, y + (size / 2) * 1.1 + textSize());
  }
  
  var angle1 = (millis() - clockStartTime) / maxTime * 2 % 2;
  var angle2 = (millis() - clockStartTime) / maxTime * 2 % 2;
  if (angle1 > 1.0)
    angle1 = 1;
  if (angle2 < 1.0)
    angle2 = 1;
  
  arc(x, y, size, size,
      angle1 * TWO_PI, angle2 * TWO_PI, PIE);
  
  if (millis() - clockStartTime > maxTime) {
    clockStartTime = null;
    if (callback != null)
      callback();
  }
  
  pop();
}
