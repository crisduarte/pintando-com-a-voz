class Layer {

  constructor() {
    this.layer = null;
  }

  screenshot() {
    this.layer = get();
  }

  imprint() {
    if (!this.layer) return;
    image(this.layer, 0, 0);
  }

  reset() {
    this.layer = null;
  }
}