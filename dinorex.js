
// Canvas Setup

const container = document.querySelector('.game');
const canvas = document.createElement('canvas');

canvas.height = container.offsetHeight;
canvas.width = container.offsetWidth;

container.appendChild(canvas);

// Constant Declarations
const jumpKeys = [32, 38];
const initialSpeed = 10;
const ctx = canvas.getContext('2d');
const storeName = 'dino-score';
const horizonPosition = canvas.height / 2 + 100;


// Variable Declarations
let animationFrame;
let character;
let obstacles = [];
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
    character.show(ctx);
    initKeyMaps();
    setBackground();
    loop();
}


// Reset Frames
function reset() {
    setHighscore();
    cancelAnimationFrame(animationFrame);
    character;
    obstacles = [];
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
    frames += 1;

    setBackground();

    if (jump) {
        character.jump();
        if (character.reachedMaxHeight()) {
            jump = false;
            drop = true;
        }
    }

    else if (drop) {
        character.drop();
    } else if (character.landed()) {
        drop = false;
    }

    drawHorizon();

    renderScore();

    increaseGameSpeed();

    obstacles.forEach((obs, index) => {
        obs.show(ctx, { crashed });
        if (obs.hits(character)) {
            crashed = true
        }

        if (obs.outside()) {
            obstacles.splice(index, 1);
        }
    });

    if (crashed) {
        showCrashedMessage();
    } else {
        if (frames % 150 === 0) {
            const value = rand(1, 4);
            addObstacle(value);
        }

        character.show(ctx);
    }


    animationFrame = requestAnimationFrame(loop);
}

// Map Keys and Events to actions
function initKeyMaps() {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    document.addEventListener('touchstart', touchstarted);
    document.addEventListener('touchend', touchended);
}

function touchstarted() {
    if (character.landed()) {
        jump = true;
    }

    if (!gameStarted) {
        gameStarted = true;
    }

    if (crashed) {
        reset();
    }
}

function touchended(event) {
    jump = false;
    drop = true;
}

function keyup(event) {
    if (jumpKeys.indexOf(event.keyCode) > -1) {
        jump = false;
        drop = true;
    }
}

function keydown(event) {
    if (crashed && event.keyCode === 13) {
        reset();
    }

    if (jumpKeys.indexOf(event.keyCode) > -1) {
        if (character.landed()) {
            jump = true;
        }
    }
    if (!gameStarted) {
        gameStarted = true;
    }
}

// Render Crash message
function showCrashedMessage() {
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#fff";
    const threshold = 20;
    const messageLineOne = "You Crashed";
    const messageLineTwo = "Press Enter to continue";
    ctx.fillText(messageLineOne, (canvas.width / 2) - 100, horizonPosition / 2);
    ctx.fillText(messageLineTwo, (canvas.width / 2) - 150, horizonPosition / 2 + threshold);
}



// Render Background
function setBackground() {
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// Increment Obstacles
function addObstacle(numberOfObstacles) {
    for (let i = 0; i < numberOfObstacles; i++) {
        obstacles.push(new Obstacle({ canvas, gameSpeed, horizon: horizonPosition }));
    }
}

// Render Score and High Score
function renderScore() {
    if (gameStarted && !crashed) {
        score += 1;
    }

    const highScore = getHighscore()

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#fff";
    const threshold = 30;
    const text = `HI ${highScore || 0} | ${score}`;
    ctx.fillText(text, canvas.width - (text.length * text.length) - threshold, threshold);
}


// Change Game Speed
function increaseGameSpeed() {
    if (frames % 500 === 0 && !crashed) {
        gameSpeed += 1;
    }
}


// Render Horizon
function drawHorizon() {
    ctx.beginPath();
    ctx.moveTo(0, horizonPosition);
    ctx.lineTo(canvas.width, horizonPosition);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
}

// Render Clouds
function drawClouds() {

}

// Initial Call
setup();

