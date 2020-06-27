import processing.sound.*;

float sensibility = -1;
AudioIn mic;
Amplitude rms;

void setupAudio(){
  // capture audio
  mic = new AudioIn(this, 0);
  mic.start();
  mic.amp(sensibility);
  
  // create a new Amplitude analyzer
  rms = new Amplitude(this);
  
  // Patch the input to an volume analyzer
  rms.input(mic);

}
