class Cell {
  constructor(arg) {
    this.collapsed = false;
    if (arg instanceof Array) {
      this.options = arg
    }
    else {
      this.options = new Array(arg).fill(0).map((_, i) => i);
    }
  }
}