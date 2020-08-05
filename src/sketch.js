var X;
var Y;
var radius;
var counter = 0;
var brush_color;
var last_frame;
var is_painting;

function setup() {

  c = createCanvas(windowWidth, windowHeight);
  background(0);

  // prepare microphone
  if (!mic_started) {
    textAlign(CENTER);
    fill(255, 255, 255, 60);
    textSize(16);
    text('touch to start microphone', width / 2, height / 2);
  }

  // user gesture to start mic
  c.mousePressed(mic_start);

  //fft = new p5.FFT();

  Y = height;
  updRadius();
  X = -radius / 2 + 10;

  hue2 = random(255);
  last_frame = null;
  counter = 0;
  is_painting = false;
}


function getColor(factor) {

  if (factor < 0) factor = 0;

  colorMode(HSB, 255);
  result = color(hue(brush_color),
    20 + pow(factor + 0.2, 2) * 240,
    20 + pow(1 - factor, 2) * 240,
    50);
  colorMode(RGB, 255);
  return result;
}

function painter(X, Y, radius) {

  push();
  noStroke();
  if (last_frame != null)
    set(0, 0, last_frame);
  fill(getColor(Y / height - 0.2));
  ellipse(X, Y, radius, radius);
  last_frame = get();
  pop();
}

function updX(deltaX) {

  X += deltaX;
  if (X > (width + radius / 2))
    X = -radius / 2 + 1;
  else if (X < (-radius / 2))
    X = width + radius / 2;
}

function updY(deltaY) {

  Y += deltaY;
  if ((Y >= (height - counter)) && (Y > 0))
    Y -= random() * 20.0 - 8.0;
}

function updRadius() {

  radius = (height - Y) / 4.0 + width / 6.0;
}

function start_paint() {
  background(0);
  mic_start();
  is_painting = true;
}

function draw() {

  // check for audio mic
  if (mic_starting())
    return;

  var level;

  // choose color
  if (!is_painting) {
    background(0);
    level = -map(mic_read_level(50, true), 0.05, 0.3, 
                 -256 / 2 + 20 / 2, 256 / 2 - 20 / 2);
    brush_color = pickColor(width / 2, height / 2, 20, level);
    drawClock(width / 2, height / 2 + 256 / 2 + 66 / 2, 45, 
              "speak to choose a color...", 6000, start_paint);
    return;
  }

  // paint
  // update X, Y, and radius
  level = -mic_read_level(20, false) * width / 20;
  updX(width / 160);
  updY(level);
  updRadius();
  painter(X, Y, radius);
  if (Y > 0) {
    drawClock(width - 50, height - 50, 25, "speak...", 1000);
  } else {
    drawClock(width - 50, height - 50, 25, "finishing...", 4000, setup);
  }

  counter += 0.2;
}