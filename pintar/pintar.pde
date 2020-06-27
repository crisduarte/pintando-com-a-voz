float X = 0.0;
float Y = 0.0;
float minY = 0.0;
float radius = 0.0;
float maxradius = 0.0;
PImage clockFrame = null;
int clockStartTime = 0;
float clockMaxTime = 5000.0;
int counter = 0;
int hue = 0;

void setup(){
  setupAudio();
  
  size(1024, 712);
  radius = width / 4;
  maxradius = radius;
  X = -radius / 2 + 1;
  Y = height - radius / 3;
  minY = Y;
  background(0);
  hue = (int)random(255);
  clockFrame = null;
  clockStartTime = 0;
  counter += 1;
}


color getColor(float factor){
  if (factor < 0) factor = 0; 
  colorMode(HSB, 255);
  color result = color(hue + random(0.0), 10 + pow(factor + 0.2, 2) * 240, 10 + pow(1 - factor, 2) * 240, 45);
  colorMode(RGB, 255);
  return result;
}

void painter(float X, float Y, float radius){
  pushStyle();
  noStroke();
  fill(getColor(Y / height));
  ellipse(X, Y, radius, radius);
  popStyle();
}

void updXPainter(float deltaX){
  if (X > (width + radius / 2))
    X = -radius / 2 + 1;
  else if (X < (- radius / 2))
    X = width + radius / 2;
  else
    X += deltaX;
}

void updYPainter(float deltaY){
  Y -= deltaY;
}

void updRadius(float deltaR){
  //radius += deltaR;
}

float brushHeight(){
  return Y + (1 - Y / height) * radius / 2;
}

void drawClock(int clockSize){
  if (brushHeight() < 0) {
    if (clockFrame != null)
      blend(clockFrame, 0, 0, clockFrame.width, clockFrame.height, 
            width / 2 - clockSize / 2, height / 2 - clockSize / 2, 
            clockFrame.width, clockFrame.height, BLEND);
    else {
      clockFrame = get(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockSize, clockSize);
      clockStartTime = millis();
    }
    noStroke();
    fill(128, 128, 128, 63);
    ellipseMode(CORNER);
    arc(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockSize, clockSize, (millis() - clockStartTime) / clockMaxTime * TWO_PI, TWO_PI, PIE);
  } else {
    if (clockFrame != null){
      set(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockFrame);
      clockFrame = null;
      clockStartTime = 0;
    }
  }
}

void draw(){
  // fill(0);
  // rect(width / 2, height / 2 - 10, 37, 12);
  // fill(255);
  // text(rms.analyze(), width / 2, height / 2);
  
  updXPainter(map(rms.analyze(), 0.001, 1, 0.0, radius / 6));
  
  updYPainter(map(rms.analyze(), 0.1, 0.5, -0.2 * (1 - (Y - minY) / (radius / 8)), 
       random(radius / 26)));
  radius += 0.3 * (1 - Y / height) * (1 - radius / height);
  
  if (Y < minY) minY = Y;
  if (radius > maxradius) maxradius = radius;
  
  painter(X, Y, radius);
  
  // fill(255, 0, 0);
  // ellipse(10, Y + (1 - Y / height) * radius / 2, 3, 3);
  
  int clockSize = 100;
  drawClock(clockSize);
  
  if ((brushHeight() < 0) && ((millis() - clockStartTime) >= clockMaxTime)) {
    set(width / 2 - clockSize / 2, height / 2 - clockSize / 2, clockFrame);
    save("./image" + counter + ".jpg");
    setup();
  }
}
