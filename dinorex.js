const FPS = 60;
const HORIZON_COLOR = '#4A403A';
let FPSHANDLER;
// Canvas Setup
const container = document.querySelector('.game');
const canvas = document.createElement('canvas');

canvas.height = container.offsetHeight;
canvas.width = container.offsetWidth;

canvas.offscreenCanvas = document.createElement('canvas');
canvas.offscreenCanvas.width = canvas.width;
canvas.offscreenCanvas.height = canvas.height;

container.appendChild(canvas);

const horizonImage = new Image();
horizonImage.src = '/assets/floor.png';
const dirtImage = new Image();
dirtImage.src = '/assets/dirt.png';

// Constant Declarations
const jumpKeys = [32, 38];
const initialSpeed = 10;
const ctx = canvas.getContext('2d', { alpha: false });
const storeName = 'dino-score';
const horizonPosition = canvas.height / 2 + 100;

// Variable Declarations
let animationFrame;
let character;
let sliding = false;
let obstacles = [];
let clouds = [];
let lamps = [];
let arrows = [];
let gameStarted = false;
let jump = false;
let drop = false;
let frames = 0;
let gameSpeed = initialSpeed;
let score = 0;
let crashed = false;

// Initial Render
function setup() {
  character = new GameCharacter({ canvas, horizon: horizonPosition });
  initKeyMaps();
  loop();
}

// Reset Frames
function reset() {
  setHighscore();
  clearTimeout(FPSHANDLER);
  cancelAnimationFrame(animationFrame);
  character = {};
  obstacles = [];
  arrows = [];
  score = 0;
  gameStarted = false;
  gameSpeed = initialSpeed;
  jump = false;
  drop = false;
  frames = 0;
  crashed = false;
  setup();
}

// Local Storage calls
function setHighscore() {
  const storedScore = localStorage.getItem(storeName);
  if (storedScore > score) {
    return;
  }
  localStorage.setItem(storeName, score);
}

function getHighscore() {
  return localStorage.getItem(storeName);
}

// Main Render Function

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frames += 1;

  setBackground();
  renderScore();
  increaseGameSpeed();

  if (!gameStarted && !crashed) {
    showWelcomeMessage();
  }

  if (gameStarted) {
    addFillers();
    addObstacles();
    renderFillers();
    renderObstacles();
    character.show(ctx, frames, crashed);
  }

  if (crashed) {
    showCrashedMessage();
  }

  drawHorizon();
  ctx.drawImage(canvas.offscreenCanvas, 0, 0);

  FPSHANDLER = setTimeout(function () {
    animationFrame = requestAnimationFrame(loop);
  }, 1000 / FPS);
}

// Map Keys and Events to actions
function initKeyMaps() {
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup', keyup);
  document.addEventListener('touchstart', touchstarted);
  document.addEventListener('touchend', touchended);
}

function touchstarted() {
  character.jump();

  if (!gameStarted) {
    gameStarted = true;
  }

  if (crashed) {
    reset();
  }
}

function touchended(event) {}

function keyup(event) {
  if (event.keyCode === 40) {
    sliding = false;
    character.getUp();
  }
}

function keydown(event) {
  if (!crashed) {
    if (jumpKeys.indexOf(event.keyCode) > -1) {
      character.jump();

      if (!gameStarted) {
        gameStarted = true;
      }
    }

    if (gameStarted && event.keyCode === 40) {
      sliding = true;
      character.slide();
    }
  } else {
    if (jumpKeys.indexOf(event.keyCode) > -1) {
      reset();
    }
  }
}

// Render Crash message
function showCrashedMessage() {
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#333';
  const threshold = 20;
  const messageLineOne = 'You Crashed';
  const messageLineTwo = 'Press Space to continue';
  ctx.fillText(
    messageLineOne,
    canvas.width / 2 - messageLineOne.length - 150 / 2,
    100
  );
  ctx.fillText(
    messageLineTwo,
    canvas.width / 2 - messageLineTwo.length - 150 / 2,
    100 + threshold
  );
}

// Render Background
function setBackground() {
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Render Score and High Score
function renderScore() {
  if (gameStarted && !crashed) {
    score += 1;
  }

  const highScore = getHighscore();

  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#5F7A61';
  const threshold = 30;
  const text = `HI ${highScore || 0} | ${score}`;
  ctx.fillText(
    text,
    canvas.width - text.length * text.length - threshold,
    threshold
  );
}

// Change Game Speed
function increaseGameSpeed() {
  if (frames % 1000 === 0 && !crashed) {
    gameSpeed += 1;
  }
}

// Render Horizon
function drawHorizon() {
  let draw = true;
  let xValue = 0;
  let yValue = horizonPosition;
  let rowFinished = false;
  let rows = 0;
  const offScreenCanvasCTX = canvas.offscreenCanvas.getContext('2d', {
    alpha: true,
  });
  offScreenCanvasCTX.drawImage(horizonImage, xValue, yValue);
  while (draw) {
    xValue += horizonImage.width;

    if (xValue > canvas.width) {
      xValue = 0;
      rowFinished = true;
      rows += 1;
    }

    if (rowFinished) {
      yValue += horizonImage.height;
      rowFinished = false;
    }

    if (yValue >= canvas.height) {
      draw = false;
    }

    if (rows < 1) {
      offScreenCanvasCTX.drawImage(horizonImage, xValue, yValue);
    } else {
      offScreenCanvasCTX.drawImage(dirtImage, xValue, yValue);
    }
  }
}

// Render Clouds
function drawClouds(numberOfClouds) {
  if (clouds.length > 10) {
    return;
  }
  for (let i = 0; i < numberOfClouds; i++) {
    const cloud = new Cloud({ gameSpeed, horizon: horizonPosition });
    clouds.push(cloud);
  }
}

function showWelcomeMessage() {
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#5F7A61';
  const messageLineTwo = 'Press Space to start';
  ctx.fillText(
    messageLineTwo,
    canvas.width / 2 - messageLineTwo.length - 150 / 2,
    100
  );
}

function addFillers() {
  if (frames % rand(50, 62) === 0) {
    const value = rand(1, 3);
    drawClouds(value);
  }
}

function addObstacles() {
  if (frames % 100 === 0) {
    if (obstacles.length < 5) {
      obstacles.push(
        new Obstacle({ canvas, gameSpeed, horizon: horizonPosition })
      );
    }
  }

  if (score > 1000 && frames % 120 === 0) {
    if (obstacles.length < 4) {
      obstacles.push(
        new Arrow({ gameSpeed, horizon: horizonPosition, character })
      );
    }
  }
}

function renderFillers() {
  clouds.forEach((cloud, index) => {
    cloud.show(ctx, { crashed });

    if (cloud.outside()) {
      clouds.splice(index, 1);
    }
  });
}

function renderObstacles() {
  obstacles.forEach((obs, index) => {
    obs.show(ctx, { crashed });
    if (obs.hits(character)) {
      crashed = true;
    }

    if (obs.outside()) {
      obstacles.splice(index, 1);
    }
  });

  arrows.forEach((arrow, index) => {
    arrow.show(ctx, { crashed });

    if (arrow.hits(character)) {
      crashed = true;
    }

    if (arrow.outside()) {
      arrows.splice(index, 1);
    }
  });
}

// Initial Call
window.requestAnimationFrame(setup);
