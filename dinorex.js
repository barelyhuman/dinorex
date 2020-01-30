
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
let clouds = [];
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
    character = {};
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
    if (!gameStarted && !crashed) {
        showWelcomeMessage();
    }

    if (gameStarted) {
        clouds.forEach((cloud, index) => {
            cloud.show(ctx, { crashed });

            if (cloud.outside()) {
                clouds.splice(index, 1);
            }
        });

        obstacles.forEach((obs, index) => {
            obs.show(ctx, { crashed });
            if (obs.hits(character)) {
                crashed = true
            }

            if (obs.outside()) {
                obstacles.splice(index, 1);
            }
        });

        const frameInterval = rand(60, 70);

        if (frames % frameInterval === 0) {
            if (obstacles.length < 5) {
                addObstacle();
            }
        }

        if (frames % 10 === 0) {
            const value = rand(1, 3);
            drawClouds(value);
        }

        character.show(ctx, frames, crashed);

    }

    if (crashed) {
        showCrashedMessage();
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

    if (event.keyCode === 40) {
        character.getUp();
    }
}

function keydown(event) {

    if (!crashed) {
        if (jumpKeys.indexOf(event.keyCode) > -1) {
            if (character.landed()) {
                jump = true;
            }

            if (!gameStarted) {
                gameStarted = true;
            }
        }

        if (gameStarted && event.keyCode === 40) {
            drop = false;
            character.slide()
        }
    } else {
        if (jumpKeys.indexOf(event.keyCode) > -1) {
            reset();
        }
    }

}

// Render Crash message
function showCrashedMessage() {
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#333";
    const threshold = 20;
    const messageLineOne = "You Crashed";
    const messageLineTwo = "Press Space to continue";
    ctx.fillText(messageLineOne, (canvas.width / 2) - 100, horizonPosition / 2);
    ctx.fillText(messageLineTwo, (canvas.width / 2) - 150, horizonPosition / 2 + threshold);
}



// Render Background
function setBackground() {
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// Increment Obstacles
function addObstacle() {
    obstacles.push(new Obstacle({ canvas, gameSpeed, horizon: horizonPosition }));
}

// Render Score and High Score
function renderScore() {
    if (gameStarted && !crashed) {
        score += 1;
    }

    const highScore = getHighscore()

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#333";
    const threshold = 30;
    const text = `HI ${highScore || 0} | ${score}`;
    ctx.fillText(text, canvas.width - (text.length * text.length) - threshold, threshold);
}


// Change Game Speed
function increaseGameSpeed() {
    if (frames % 1000 === 0 && !crashed) {
        gameSpeed += 1;
    }
}


// Render Horizon
function drawHorizon() {
    ctx.beginPath();
    ctx.moveTo(0, horizonPosition);
    ctx.lineTo(canvas.width, horizonPosition);
    ctx.strokeStyle = "#333";
    ctx.stroke();
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
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#333";
    const messageLineTwo = "Press Space to start";
    ctx.fillText(messageLineTwo, (canvas.width / 2) - 150, horizonPosition / 2);
}

// Initial Call
window.requestAnimationFrame(setup)
// setup();

