class HueBar {
  
  constructor(x, y, w, h, HSBs, HSBb) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = HSBs;
    this.b = HSBb;
    this.selector = 0.0;
  }
  
  updateSelector(delta) {
    this.selector = ((this.selector + delta) % 255);
  }
  
  hue() {
    return 255 - this.selector;
  }
  
  draw() {
    push();
    colorMode(HSB, 255);
    noStroke();
    for (var i = 1; i <= 255; i++) {
      fill(lerpColor(color(0, this.s, this.b), color(254, this.s, this.b), 
                     (i - 1) / 255));
      rect(this.x, floor(this.y - this.h / 2 + (i - 1) * this.h / 255),
           this.w, ceil(this.h / 255));
    }
    noFill();
    stroke(255, 180);
    strokeWeight(3);
    rect(this.x, this.y - this.h / 2 + (1 - this.selector / 255) * (this.h - this.w), this.w, this.w);
    fill(lerpColor(color(0, this.s, this.b), color(254, this.s, this.b), 1 - this.selector / 255));
    rect(this.x + this.w * 2, this.y -this.h / 2 + this.h * 2 / 7, this.h * 3 / 7, this.h * 3 / 7);
    pop();
  }
}
