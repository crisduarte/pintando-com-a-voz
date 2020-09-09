class Timer {

  constructor(total, callback) {
    this.total = total;
    this.callback = callback;
    this.reset();
  }
  
  reset() {
    this.current = 0.0;
    this.previousTime = null;
    this.disabled = false;
    this.running = false;
  }

  tick(running) {
    if (this.disabled) return;
    this.running = running;
    var actualTime = millis();
    if (this.running && this.previousTime) this.current += actualTime - this.previousTime;
    this.previousTime = actualTime;
    // check go off
    if (this.current > this.total) {
      this.disabled = true;
      if (this.callback) this.callback();
    }
  }

  draw(x, y, size, msg) {
    if (this.disabled || !this.running) return;
    push();
    noStroke();
    fill(255, 60);
    ellipseMode(CENTER);
    var angle1 = this.current / this.total * 2 % 2;
    var angle2 = this.current / this.total * 2 % 2;
    if (angle1 < 1.0) angle1 = 1.0;
    if (angle2 > 1.0) angle2 = 1.0;
    if (msg) {
      textAlign(LEFT, CENTER);
      textSize(max(20, size * 0.67));
      text(msg, x + size / 2, y);
    }
    arc(x, y, size, size, 
        angle1 * TWO_PI - HALF_PI, 
        angle2 * TWO_PI - HALF_PI + 1e-4, PIE);
    pop();
  }
}
