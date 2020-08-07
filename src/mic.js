class Mic {

  constructor(movingAverage, difference, levelMin, levelMax, callbackError) {
    this.movingAverage = [];
    while (this.movingAverage.length < movingAverage)
      this.movingAverage.push(0.0);
    this.difference = difference;
    this.levelMin = levelMin;
    this.levelMax = levelMax;
    this.device = new p5.AudioIn(callbackError);
    this.device.start();
  }

  enabled() {
    return (getAudioContext().state == 'running');
  }

  reset() {
    for (var i = 1; i < this.movingAverage.length; i++)
      this.movingAverage[i] = 0.0;
  }

  normalize(level) {
    if (level < this.levelMin)
      level = this.levelMin;
    if (level > this.levelMax)
      level = this.levelMax;
    level = map(level, this.levelMin, this.levelMax, 0, 1);
    return level;
  }

  level() {
    if (!this.enabled()) return 0.0;
    var level = this.normalize(this.device.getLevel());
    var mean = level;
    if (this.movingAverage.length) {
      this.movingAverage.shift();
      this.movingAverage.push(level);
      mean = this.movingAverage.reduce((a, b) => a + b, 0) /
        (this.movingAverage.length || 1);
      if (this.difference)
        return level - mean;
    }
    return mean;
  }

  drawIcon(x, y, size) {
    if (!this.enabled()) return;
    push();
    angleMode(RADIANS);
    var dy = size / 10;
    var lv_factors = [0.0, 0.15, 0.4, 0.15, 0.0];
    var level = this.normalize(this.device.getLevel());
    level = abs(sin(level * TWO_PI)) * size;
    stroke(255, 60);
    strokeWeight(size / 10);
    for (var i = 0; i < lv_factors.length; i++)
      line(x + size / 4 * i - size / 2, y - dy - level * lv_factors[i],
        x + size / 4 * i - size / 2, y + dy + level * lv_factors[i]);
    pop();
  }
}