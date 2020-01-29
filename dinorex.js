const container = document.querySelector('.game');
const canvas = document.createElement('canvas');

canvas.height = container.offsetHeight;
canvas.width = container.offsetWidth;

container.appendChild(canvas);

const jumpKeys = [32, 38];
const initialSpeed = 10;
const ctx = canvas.getContext('2d');
const storeName = 'dino-score';
const horizonPosition = canvas.height / 2 + 100;

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

function setup() {
    character = new GameCharacter({ canvas, horizon: horizonPosition });
    character.show(ctx);
    initKeyMaps();
    setBackground();
    loop();
}

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

function getNewObstacle() {
    obstaclePosition = rand(canvas.width / 2, canvas.width);;
}


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

function showCrashedMessage() {
    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#f00";
    const message = "You Crashed";
    ctx.fillText(message, (canvas.width / 2) - (message.length * message.length), canvas.height / 2);
}

function keyup(event) {
    if (jumpKeys.indexOf(event.keyCode) > -1) {
        jump = false;
        drop = true;
    }
}

function keydown(event) {
    if (jumpKeys.indexOf(event.keyCode) > -1) {
        if (character.landed()) {
            jump = true;
        }
        if (crashed) {
            reset();
        }
    }
    if (!gameStarted) {
        gameStarted = true;
    }
}

function setBackground() {
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addObstacle(numberOfObstacles) {
    for (let i = 0; i < numberOfObstacles; i++) {
        obstacles.push(new Obstacle({ canvas, gameSpeed, horizon: horizonPosition }));
    }
}


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

function increaseGameSpeed() {
    if (frames % 500 === 0 && !crashed) {
        gameSpeed += 1;
    }
}

function drawHorizon() {
    ctx.beginPath();
    ctx.moveTo(0, horizonPosition);
    ctx.lineTo(canvas.width, horizonPosition);
    ctx.strokeStyle = "#fff";
    ctx.stroke();

}

setup();

