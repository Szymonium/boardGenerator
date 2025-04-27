const tiles = [];
const tileImages = []

const fields = []
const connectors = []
const oneWays = []

let grid = [];

const DIM = 15;
const resolution = 90;

function preload() {
  for (let i = 0; i <= 23; i++) {
    tileImages[i] = loadImage(`resources/${i}.png`)
  }
}

function multiRotate(indx, rotates) {
  let TTR = 1
  for (let i = indx; i < indx + rotates; i++) {
    tiles[i] = tiles[indx - 1].rotate(TTR)
    TTR++;
  }
  TTR = 1;
}

function generateEgdes(ifRandom = true) {
  if (!ifRandom) {
    return [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]]
  }

  let arr = [[0, random(1) < 0.5 ? 1 : 2], [1, random(1) < 0.5 ? 0 : 2], [2, random(1) < 0.5 ? 1 : 0], []];
  if (arr[0].includes(1) && arr[2].includes(1)) {
    arr[3].push(0, 2);
  }

  if (arr[0].includes(2) && arr[1].includes(2)) {
    arr[3].push(0, 1);
  }

  if (arr[1].includes(0) && arr[2].includes(0)) {
    arr[3].push(1, 2);
  }
  
  if (arr[0] == [0,2] && arr[1] == [1, 0] && arr[2] == [2, 1] ) {
    arr[3].push(floor(random(2)), floor(random(2)))
  }

  return arr.sort(() => (random(1) < 0.5 ? 1 : -1));
}

function setup() {
  createCanvas(DIM * resolution, DIM * resolution);

  tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0])
  for (let i = 1; i < 8; i++) {
    tiles[i] = new Tile(tileImages[i], generateEgdes(false))
  }
  tiles[8] = new Tile(tileImages[8], [1, 0, 1, 0])
  tiles[9] = tiles[8].rotate(1)
  tiles[10] = new Tile(tileImages[9], [0, 1, 1, 0])
  multiRotate(11, 3);
  tiles[14] = new Tile(tileImages[10], [0, 1, 1, 1])
  multiRotate(15, 3);
  tiles[18] = new Tile(tileImages[11], [2, 0, 1, 0])
  multiRotate(19, 3);
  tiles[22] = new Tile(tileImages[12], [0, 2, 1, 0])
  multiRotate(23, 3);
  tiles[26] = new Tile(tileImages[13], [0, 1, 2, 0])
  multiRotate(27, 3);
  tiles[30] = new Tile(tileImages[14], [0, 1, 2, 1])
  multiRotate(31, 3);
  tiles[34] = new Tile(tileImages[15], [0, 2, 2, 1])
  multiRotate(35, 3);
  tiles[38] = new Tile(tileImages[16], [0, 1, 2, 2])
  multiRotate(39, 3);
  tiles[42] = new Tile(tileImages[17], [0, 2, 1, 1])
  multiRotate(43, 3);
  tiles[46] = new Tile(tileImages[18], [0, 1, 1, 2])
  multiRotate(47, 3);
  tiles[50] = new Tile(tileImages[19], [0, 2, 1, 2])
  multiRotate(51, 3);
  tiles[54] = new Tile(tileImages[20], [1, 1, 1, 1])
  tiles[55] = new Tile(tileImages[21], [1, 1, 1, 2])
  multiRotate(56, 3);
  tiles[59] = new Tile(tileImages[22], [2, 1, 1, 2])
  multiRotate(60, 3);
  tiles[63] = new Tile(tileImages[23], [2, 2, 1, 2])
  multiRotate(64, 3);

  for (let i = 0; i < tiles.length; i++) {
    if (i < 8) {
      fields.push(tiles[i])
    }
    else if (i < 18 || i == 54) {
      connectors.push(tiles[i])
    }
    else {
      oneWays.push(tiles[i])
    }
  }
  
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i]; 
    tile.analyze(tiles, fields, oneWays);
  }

  startOver()
}

function startOver() {
  for (let i = 0; i < DIM ** 2; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!valid.includes(arr[i])) {
      arr.splice(i, 1);
    }
  }
}

function randomizeWithChances(options) {
  if (options == []) {
    return undefined;
  }

  let specialFields = new Array(fields.length - 2).fill(0).map((_, i) => i+2)

  for (let i = 0; i < options.length; i++) {
    if (specialFields.includes(options[i])) {
      switch (options[i]) {
        // Random tp
        case 2:
          options[i] = random(1) < 0.8 ? 1 : options[i]
        break;

        // +2 gold
        case 3:
          options[i] = random(1) < (1 / 3) ? 1 : options[i]
        break;

        // Shop
        case 4:
          options[i] = random(1) < 0.5 ? 1 : options[i]
        break;

        // Good wheel
        case 5:
          options[i] = random(1) < 0.4 ? 1 : options[i]
        break;

        // Bad wheel
        case 6:
          options[i] = random(1) < 0.4 ? 1 : options[i]
        break;

        // VS
        case 7:
          options[i] = random(1) < 0.8 ? 1 : options[i]
        break;
      }
      //  options[i] = random(1) < 1 ? 1 : options[i]
    }
  }

  return random(options)
}

function draw() {
  background(0);

  const w = width / DIM;
  const h = height / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        image(tiles[cell.options[0]].img, w * i, h * j, w, h) 
      }
      else {
        fill(0);
        stroke(255);
        rect(i*w, j*h, w, h)
      }
    }
  }

  let gridCopy = [...grid]
  gridCopy = gridCopy.filter((a) => !a.collapsed);

  if (gridCopy.length == 0) {
    return;
  }

  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });
  gridCopy.map((x, i) => {
    if (x.options.length > gridCopy[0].options.length) {
      gridCopy.splice(i)
    }
  })

  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = randomizeWithChances(cell.options)
  if (pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];

  const nextGrid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      }
      else {
        let options = new Array(tiles.length).fill(0).map((_, i) => i);
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = []
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (j == 0) {
          let up = grid[i + ((DIM - 1) - ((DIM - j) % DIM)) * DIM];
          let validOptions = []
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = []
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (i == 0) {
          let left = grid[((DIM - 1) - ((DIM - i) % DIM)) + j * DIM];
          let validOptions = []
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = []
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (j == DIM - 1) {
          let down = grid[i + ((j + 1) % DIM) * DIM];
          let validOptions = []
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = []
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        if (i == DIM - 1) {
          let right = grid[((i + 1) % DIM) + j * DIM];
          let validOptions = []
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        nextGrid[index] = new Cell(options);
      }
    }
  }
  grid = nextGrid;
}