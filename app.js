import { GameCharacter } from './objects/character';
import { Cloud } from './objects/clouds';
import { Obstacle } from './objects/obstacle';
import { rand } from './helpers';
import { Arrow } from './objects/flying-obstacle';
import DirtImage from './assets/dirt.png';
import FloorImage from './assets/floor.png';

// Canvas Setup
const playerCanvas = document.getElementById('canvas1');
const backgroundCanvas = document.getElementById('canvas2');
const characterCanvas = document.getElementById('canvas3');

playerCanvas.height = window.innerHeight;
playerCanvas.width = window.innerWidth;

backgroundCanvas.height = window.innerHeight;
backgroundCanvas.width = window.innerWidth;

characterCanvas.height = window.innerHeight;
characterCanvas.width = window.innerWidth;

const horizonImage = new Image();
horizonImage.src = FloorImage;
const dirtImage = new Image();
dirtImage.src = DirtImage;

// Constant Declarations
const jumpKeys = [32, 38];
const initialSpeed = 10;
const ctx = playerCanvas.getContext('2d');
const ctx2 = backgroundCanvas.getContext('2d');
const storeName = 'dino-score';
const horizonPosition = playerCanvas.height / 2 + 120;

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

function setup() {
  character = new GameCharacter({
    canvas: characterCanvas,
    horizon: horizonPosition,
  });
  drawHorizon(ctx2, horizonPosition);
  initKeyMaps();
}

function animate() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);

  frames += 1;
  renderScore(ctx);
  drawHorizon(ctx2, horizonPosition);
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

  requestAnimationFrame(animate);
}

// Reset Frames
function reset() {
  setHighscore();
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
    playerCanvas.width / 2 - messageLineOne.length - 150 / 2,
    100
  );
  ctx.fillText(
    messageLineTwo,
    playerCanvas.width / 2 - messageLineTwo.length - 150 / 2,
    100 + threshold
  );
}

// Render Score and High Score
function renderScore(context) {
  if (gameStarted && !crashed) {
    score += 1;
  }

  const highScore = getHighscore();

  context.font = '18px sans-serif';
  context.fillStyle = '#5F7A61';
  const threshold = 30;
  const text = `HI ${highScore || 0} | ${score}`;
  context.fillText(
    text,
    playerCanvas.width - text.length * text.length - threshold,
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
function drawHorizon(context, horizonPosition) {
  context.clearRect(0, 0, context.canvas.height, context.canvas.width);
  let draw = true;
  let xValue = 0;
  let yValue = horizonPosition;
  let rowFinished = false;
  let rows = 0;
  const landPattern = context.createPattern(horizonImage, 'repeat');
  const dirtPattern = context.createPattern(dirtImage, 'repeat');
  context.fillStyle = landPattern;
  context.fillRect(xValue, yValue, context.canvas.width, 120);
  context.fillStyle = dirtPattern;
  context.fillRect(
    xValue,
    yValue + 110,
    context.canvas.width,
    context.canvas.height - 120
  );

  // context.drawImage(horizonImage, xValue, yValue);
}

// Render Clouds
function drawClouds(numberOfClouds) {
  if (clouds.length > 10) {
    return;
  }
  for (let i = 0; i < numberOfClouds; i++) {
    const cloud = new Cloud({
      gameSpeed,
      horizon: horizonPosition,
      canvas: playerCanvas,
    });
    clouds.push(cloud);
  }
}

function showWelcomeMessage() {
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#5F7A61';
  const messageLineTwo = 'Press Space to start';
  ctx.fillText(
    messageLineTwo,
    playerCanvas.width / 2 - messageLineTwo.length - 150 / 2,
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
        new Obstacle({
          canvas: playerCanvas,
          gameSpeed,
          horizon: horizonPosition,
        })
      );
    }
  }

  if (score > 1000 && frames % 120 === 0) {
    if (obstacles.length < 4) {
      obstacles.push(
        new Arrow({
          gameSpeed,
          horizon: horizonPosition,
          character,
          canvas: playerCanvas,
        })
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
setup();
animate();
