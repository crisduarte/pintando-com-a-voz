var mic;
var mic_started = false;
var mic_last_levels = [];

function mic_start(canvas) {
  
  getAudioContext().resume();
  mic = new p5.AudioIn();
  mic.start();
  mic_last_levels = [];
  mic_started = true;
  background(0);
}

function mic_starting() {
  
  if (getAudioContext().state !== 'running') {
    if (mic_started) {
      background(0);
      drawClock(width / 2, height / 2, 64,
                "starting microphone...", 1000, mic_error);
    }
  }
  return (mic == null);
}

function mic_error() {
  
  background(0);
  text('failed to start the microphone', width / 2, height / 2);
}

function mic_read_level(last_n, smooth) {

  if ((last_n == null) || (last_n < 0))
    last_n = 0;
  var level = mic.getLevel();
  if (mic_last_levels.length > 0 && mic_last_levels.length == last_n)
    mic_last_levels.shift();
  if (mic_last_levels.length < last_n)
    mic_last_levels.push(level);
  if (smooth)
    return(_mean(mic_last_levels));
  return(level - _mean(mic_last_levels));
}

function _mean(x) {

  var res = 0.0;
  if (x.length == 0)
    return (res);
  for (i = 0; i < x.length; i++)
    res += x[i];
  return (res / x.length);
}
