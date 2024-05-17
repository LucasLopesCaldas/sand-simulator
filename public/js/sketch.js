const PANEL_SIZE = 30;
const CANVAS_MARGIN = 50;

let canvasSize = 600;
let gridSize = 100;
let paused = false;
let present = new Array();
let panel, pauseButton, resetButton, gridSizeInput;

function setupGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function setup() {
  const cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent('canvas_container');
  present = setupGrid(gridSize);

  panel = createDiv();
  panel.parent('canvas_container');
  panel.style('background', '#000');
  panel.style('display', 'flex');
  panel.style('align-items', 'stretch');
  panel.style('border-radius', '0 0 10px 10px');
  panel.style('font-family', 'monospace');

  pauseButton = createButton('PLAY');
  pauseButton.style('display', 'block');
  pauseButton.parent(panel);
  pauseButton.mousePressed(playPause);

  resetButton = createButton('RESET');
  resetButton.style('display', 'block');
  resetButton.parent(panel);
  resetButton.mousePressed(reset);

  const sizeLabel = createDiv('Grid Size: &nbsp;');
  sizeLabel.style('display', 'block');
  sizeLabel.parent(panel);
  sizeLabel.style('color', 'white');
  sizeLabel.style('display', 'flex');
  sizeLabel.style('align-items', 'center');
  sizeLabel.style('margin-left', '10px');

  gridSizeInput = createInput('100');
  gridSizeInput.style('display', 'block');
  gridSizeInput.parent(panel);
}

function draw() {
  background(0);
  strokeWeight(0);

  const future = setupGrid(gridSize);

  if (gridSize != present.length) {
    present = setupGrid(gridSize);
  }

  for (let j = 0; j < gridSize; j++) {
    for (let i = 0; i < gridSize; i++) {
      computeCell(i, j, present, future);
      drawCell(i, j, present);
    }
  }

  if (!paused) present = future;
  computeCanvasSize();
  updatePanel();

  if (mouseIsPressed) {
    const gridPosX = int((mouseX / canvasSize) * gridSize);
    const gridPosY = int((mouseY / canvasSize) * gridSize);
    setPresentAliveCell(gridPosX, gridPosY);
  }
}

function computeCell(i, j, present, future) {
  if (cell(i, j, present) === 1) {
    if (cell(i, j + 1, present) === 0 && j < gridSize - 1) {
      future[i][j + 1] = 1;
    } else if (cell(i + 1, j + 1, present) === 0 && random() > 0.7) {
      future[i + 1][j + 1] = 1;
    } else if (cell(i - 1, j + 1, present) === 0 && random() > 0.7) {
      future[i - 1][j + 1] = 1;
    } else {
      future[i][j] = 1;
    }
  }
}

function drawCell(i, j, grid) {
  let cellSize = canvasSize / gridSize;

  if (cell(i, j, grid) === 1) {
    const p = Math.pow(j/gridSize, 3);
    fill(lerpColor(color(255, 255, 0), color(255, 80, 80), p));
    rect(i * cellSize, j * cellSize, cellSize, cellSize);
  }
}

function cell(i, j, grid) {
  if (i < 0 || j < 0 || j >= gridSize || i >= gridSize) return 1;
  return grid[i][j];
}

function setPresentAliveCell(i, j) {
  if (i < gridSize && j < gridSize && i >= 0 && j >= 0) {
    present[i][j] = 1;
  }
}

function computeCanvasSize() {
  if (height != canvasSize) {
    resizeCanvas(canvasSize, canvasSize);
  }

  canvasSize = min(innerHeight - PANEL_SIZE, innerWidth) - CANVAS_MARGIN;
}

function updatePanel() {
  panel.size(canvasSize, PANEL_SIZE);
  pauseButton.html(paused ? 'PLAY' : 'PAUSE');
  if (int(gridSizeInput.value()) >= 10) gridSize = int(gridSizeInput.value());
}

function reset() {
  present = setupGrid(gridSize);
  paused = true;
}

function playPause() {
  paused = !paused;
}
