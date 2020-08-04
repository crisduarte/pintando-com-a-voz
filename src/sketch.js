var X = 0.0;
var Y = 0.0;
var radius = 0.0;
var clockMaxTime = 2000.0;
var counter = 0;
var hue2 = 0;
var mic;
var last_levels;
var last_frame;
var touched = false;

function setup() {

  createCanvas(windowWidth, windowHeight);

  last_levels = [];
  mic = new p5.AudioIn();
  mic.start();

  X = -radius / 2 + 10;
  Y = height;

  background(0);

  hue2 = random(255);
  last_frame = null;
  counter = 0;

  if (getAudioContext().state !== 'running') {

    textAlign(CENTER);
    fill(255, 255, 255, 60);
    textSize(16);
    text('touch to start microphone', width / 2, height / 2);
  }
}


function getColor(factor) {

  if (factor < 0) factor = 0;

  colorMode(HSB, 255);

  result = color(hue2,
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
  
  touched = true;
}

function mic_error() {
  
  background(0);
  text('failed to start the microphone', width / 2, height / 2);
}

function draw() {

  if (getAudioContext().state !== 'running') { 
    if (touched == true) {
      background(0);
      drawClock(width / 2, height / 2, 16 * 4, "starting microphone...", 1000, mic_error);
    }
    
    return;
  }

  // compute input mic
  var level = mic.getLevel(0.0);
  if (last_levels.length >= 20)
    last_levels.shift();
  last_levels.push(level);
  var value = mean(last_levels) - level;

  // paint
  // update X, Y, and radius
  updX(5.0);
  updY(value * width / 10);
  updRadius();
  painter(X, Y, radius);
  
  if (Y > 0) {

    drawClock(width - 50, height - 50, 25, "speak...", 1000);
  } else {

    drawClock(width - 50, height - 50, 25, "finishing...", 4000, setup);
  }

  counter += 0.2;
}