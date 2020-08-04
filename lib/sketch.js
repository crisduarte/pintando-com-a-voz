var X = 0.0;
var Y = 0.0;
var minY = 0.0;
var radius = 0.0;
var maxradius = 0.0;
var clockFrame = null;
var clockStartTime = 0;
var clockMaxTime = 3000.0;
var clockSize = 100;
var counter = 0;
var hue2 = 0;
var mic;
var last;


function setup() {
  
  createCanvas(windowWidth, windowHeight);

  last = [];
  
  mic = new p5.AudioIn();

  radius = width / 4;
  maxradius = radius;
  X = -radius / 2 + 10;
  Y = height;
  minY = Y;
  
  background(0);
  hue2 = random(255);
  clockFrame = null;
  clockStartTime = 0;
  counter += 1;
}


function getColor(factor) {
  
  if (factor < 0) factor = 0;
  
  colorMode(HSB, 255);
  
  result = color(hue2 + random(0.0), 
                 10 + pow(factor + 0.2, 2) * 240, 
                 10 + pow(1 - factor, 2) * 240, 50);
  
  colorMode(RGB, 255);
  return result;
}

function painter(X, Y, radius) {
  
  push();
  noStroke();
  fill(getColor(Y / height - 0.2));
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
  
  Y -= deltaY;
  
  if (Y > (height))
    Y = height
}

function updRadiusPainter() {
  
  radius = width / 3.0 * (1 - Y / height) + width / 6.0;
}

function brushHeight() {
  
  return Y + (1 - Y / height) * radius / 2;
}

function drawClock(clockSize) {
  
  if (brushHeight() < 0) {
    
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

function mean(x) {

  var res = 0.0;
  
  if (x.length == 0)
    return(res);
  
  for (i = 0; i < x.length; i++)
    res += x[i];
  
  return(res / x.length);
}

function draw() {
  
  var level = mic.getLevel(0.0);
  
  if (last.length >= 500)
    last.shift();
  last.push(level);
  
  // level - mean(last)
  var value = level - mean(last);
  
  // update X, Y, and radius
  updXPainter(5.0);

  updYPainter((value) * 100.0);
    
  updRadiusPainter();

  if (Y < minY) minY = Y;
  
  if (radius > maxradius) maxradius = radius;

  painter(X, Y, radius);

  drawClock(clockSize);

  if ((brushHeight() < 0) && ((millis() - clockStartTime) >= clockMaxTime)) {
    
    set(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockFrame);
    //save("./image" + counter + ".jpg");
    setup();
  }
}
