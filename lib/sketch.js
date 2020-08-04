var X = 0.0;
var Y = 0.0;
var radius = 0.0;
var clockFrame = null;
var clockStartTime = 0;
var clockMaxTime = 2000.0;
var clockSize = 100;
var counter = 0;
var hue2 = 0;
var mic;
var last;


function setup() {

  createCanvas(windowWidth, windowHeight);

  last = [];
  mic = new p5.AudioIn();
  mic.start();

  X = -radius / 2 + 10;
  Y = height;

  background(0);
  hue2 = random(255);
  clockFrame = null;
  clockStartTime = 0;
  counter = 0;

  if (getAudioContext().state !== 'running') {
    
    textAlign(CENTER);
    fill(255);
    textSize(16);
    text('touch to start microphone', width / 2, height / 2);
  }
}


function getColor(factor) {

  if (factor < 0) factor = 0;

  colorMode(HSB, 255);

  result = color(hue2,
    30 + pow(factor + 0.2, 2) * 240,
    30 + pow(1 - factor, 2) * 240, 50);

  colorMode(RGB, 255);
  return result;
}

function painter(X, Y, radius) {

  push();
  noStroke();
  fill(getColor(Y / height));
  ellipse(X, Y, radius, radius);
  pop();
}

function updXPainter(deltaX) {

  if (X > (width + radius / 2))
    X = -radius / 2 + 1;
  else if (X < (-radius / 2))
    X = width + radius / 2;
  else
    X += deltaX;
}

function updYPainter(deltaY) {

  Y += deltaY;

  if (Y >= (height - counter))
    Y -= random() * 20.0 - 8.0;
}

function updRadiusPainter() {

  radius = (height - Y) / 4.0 + width / 6.0;
}

function mean(x) {

  var res = 0.0;

  if (x.length == 0)
    return (res);

  for (i = 0; i < x.length; i++)
    res += x[i];

  return (res / x.length);
}

function touchStarted() {

  if (getAudioContext().state !== 'running') {
    background(0);
    getAudioContext().resume();
    mic = new p5.AudioIn();
    mic.start();
  }
}


function draw() {

  if (getAudioContext().state !== 'running') {
    return;
  }

  var level = mic.getLevel(0.0);

  if (last.length >= 20)
    last.shift();
  last.push(level);

  // level - mean(last)
  var value = mean(last) - level;

  // update X, Y, and radius
  updXPainter(5.0);

  updYPainter(value * width / 10);

  updRadiusPainter();

  painter(X, Y, radius);

  drawClock(clockSize);

  if (Y + radius / 4.0 <= 0 && ((millis() - clockStartTime) >= clockMaxTime)) {

    set(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockFrame);
    //save("./image" + counter + ".jpg");
    setup();
  }
  
  counter += 0.2;
}
