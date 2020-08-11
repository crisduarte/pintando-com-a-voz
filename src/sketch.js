var canvas;
var bar;
var mic1;
var mic2;
var phase;
var brush;
var layer;
var timer1;
var timer2;
var timer3;
var timer4;

function setup() {

  canvas = createCanvas(windowWidth, windowHeight);

  bar = new HueBar(width / 2, height / 2, 20, height / 4, 255, 150);
  
  // mic used to pick a color
  mic1 = new Mic(0, true, 0.015, 0.3, startMicError);

  // mic used to control brush
  mic2 = new Mic(50, true, 0.015, 0.5, startMicError);

  // mic must be started by an user gesture
  canvas.mousePressed(startMicGesture);
  startMicMsg();

  phase = 0;
  brush = new Brush();
  layer = new Layer();

  // timer used to pickColor
  timer1 = new Timer(15000, startPaint);

  // timer used to finish painting
  timer2 = new Timer(5000, finishPaint);

  // timer used to contemplation
  timer3 = new Timer(10000, fadeOut);

  // timer used to fade out
  timer4 = new Timer(3000, newPaint);

  //fft = new p5.FFT();
  //start();
}

function startMicGesture() {
  getAudioContext().resume();
  canvas.mousePressed(false);
  background(0);
  phase = 1;
}

function startMicMsg() {
  push();
  background(0);
  textAlign(CENTER);
  fill(255, 255, 255, 60);
  textSize(20);
  text('touch to start microphone', width / 2, height / 2);
  pop();
}

function startMicError() {
  push();
  background(0);
  textAlign(CENTER);
  fill(255, 255, 255, 60);
  textSize(20);
  text('failed to start the microphone', width / 2, height / 2);
  pop();
}

function startPaint() {
  background(0);
  brush.setup(bar.hue());
  phase = 2;
}

function finishPaint() {
  layer.imprint();
  phase = 3;
}

function fadeOut() {
  layer.imprint();
  phase = 4;
}

function newPaint() {
  timer1.reset();
  timer2.reset();
  timer3.reset();
  timer4.reset();
  layer.reset();
  mic1.reset();
  mic2.reset();
  phase = 1;
}

function draw() {
  switch (phase) {
    case 0:
      // wait mic gesture
      break;
    case 1:
      // pick color
      background(0);
      bar.updateSelector(mic1.level() * 10);
      bar.draw();
      mic1.drawIcon(width / 2, height / 2 + bar.h + 40, 80);
      timer1.draw(width / 2, height - 25, 30, " speak to choose a color ");
      timer1.tick(true);
      break;
    case 2:
      // draw
      brush.update(mic2.level());
      layer.imprint();
      brush.draw();
      layer.screenshot();
      mic2.drawIcon(20, height - 25, 20);
      timer2.draw(width / 2, height - 25, 30, " finishing ");
      timer2.tick(brush.y < 0);
      break;
    case 3:
      // contemplation
      timer3.tick(true);
      break;
    case 4:
      // fade out
      push();
      fill(0, timer4.current / timer4.total * 400);
      rect(0, 0, width, height);
      pop();
      timer4.tick(true);
      break;
  }
}
