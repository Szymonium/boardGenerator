class Tile {
  constructor(img, egdes) {
    this.img = img;
    this.egdes = egdes;

    this.up = []
    this.right = []
    this.down = []
    this.left = []
  }

  analyze(tiles, fieldsArr, oneWaysArr) {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      if (fieldsArr.includes(this) && fieldsArr.includes(tile)) {
        continue;
      }

      if (oneWaysArr.includes(this) && oneWaysArr.includes(tile)) {
        continue;
      }

      let checkIf;

      for (let j = 0; j < 4; j++) {
        let len = tile.egdes.length
        checkIf = this.egdes[j] instanceof Array ? this.egdes[j].includes(tile.egdes[(j - 2 + len) % len]) : tile.egdes[(j - 2 + len) % len] == this.egdes[j]
        switch (j) {
          case 0:
            checkIf === true ? this.up.push(i) : ""
          break;

          case 1:
            checkIf === true ? this.right.push(i) : ""
          break;

          case 2:
            checkIf === true ? this.down.push(i) : ""
          break;

          case 3:
            checkIf === true ? this.left.push(i) : ""
          break;
        }
      }

      for (let j = 0; j < 4; j++) {
        let len = this.egdes.length
        checkIf = tile.egdes[j] instanceof Array ? tile.egdes[j].includes(this.egdes[(j - 2 + len) % len]) : ""
        switch (j) {
          case 0:
            checkIf === true ? this.down.push(i) : ""
          break;

          case 1:
            checkIf === true ? this.left.push(i) : ""
          break;

          case 2:
            checkIf === true ? this.up.push(i) : ""
          break;

          case 3:
            checkIf === true ? this.right.push(i) : ""
          break;
        }
      }
    }
  }

  rotate(num) {
    const w = this.img.width;
    const h = this.img.height
    const newImg = createGraphics(w, h);
    newImg.imageMode(CENTER);
    newImg.translate(w / 2, h / 2)
    newImg.rotate(HALF_PI * num);
    newImg.image(this.img, 0, 0)

    const newEgdes = [];
    const len = this.egdes.length
    for (let i = 0; i < len; i++) {
      newEgdes[i] = this.egdes[(i - num + len) % len]
    }

    return new Tile(newImg, newEgdes);
  }
}