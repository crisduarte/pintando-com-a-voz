class Brush {

  constructor(hue) {
    this.setup(hue);
  }

  color() {
    push();
    colorMode(HSB, 255);
    var level = this.y / height - 0.2;
    var result = color(this.hue,
      20 + pow(level + 0.2, 2) * 240,
      20 + pow(1 - level, 2) * 240, 50);
    pop();
    return result;
  }

  setup(hue) {
    this.x = -width / 12 + 10;
    this.y = height;
    this.r = width / 6;
    this.hue = int(hue || random(255));
    this.brushLevel = 0.0;
  }

  update(level) {
    // update x
    var deltaX = width / 180;
    this.x += deltaX;
    if (this.x > (width + this.r / 2))
      this.x = -this.r / 2 + 1;
    else if (this.x < (-this.r / 2))
      this.x = width + this.r / 2;
    // update y
    var deltaY = -level * width / 16;
    this.y += deltaY;
    if ((this.y >= (height - this.brushLevel)) && (this.y > 0))
      this.y -= random() * 20 - 9;
    // update radius
    this.r = (height - this.y) / 4 + width / 6;
    // update brush level
    this.brushLevel += height / 4000;
  }

  draw() {
    push();
    noStroke();
    fill(this.color());
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }
}
