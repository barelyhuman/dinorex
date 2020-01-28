const container = document.querySelector('.game');
const canvas = document.createElement('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext('2d');
container.appendChild(canvas);

const CHARACTERHEIGHT = 50;
const CHARACTERWIDTH = 25;
const HORIZONHEIGHT = 10;
const INITIALXAXISPOSITION = 10;
const INITIALYAXISPOSITION = canvas.height - CHARACTERHEIGHT - HORIZONHEIGHT;

let gameSpeed = 5;

let characterXPosition = INITIALXAXISPOSITION;
let characterYPosition = INITIALYAXISPOSITION;
const OBSTACLEWIDTH = 10 + 10;

let gameStarted = false;
let jump = false;
let gravity = 50;
let frames = 0;
let maxJumpPoint = canvas.height - 250;

let obstacles = [];

const getObstacleX = () => rand(canvas.width, canvas.width + OBSTACLEWIDTH);

function loop() {
    frames += 1;
    setBackground();
    initKeyMaps();

    obstacles.forEach(obs => {
        drawObstacle(obs);
    });

    if (frames % 150 == 0) {
        const value = rand(0, 3);
        for (let i = 0; i <= value; i++) {
            addObstacle();
        }
    }

    drawCharacter();
    requestAnimationFrame(loop);
}

function getNewObstacle() {
    obstaclePosition = rand(canvas.width / 2, canvas.width);;
}


function initKeyMaps() {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
}

function keyup(event) {
    if (event.keyCode === 32) {
        jump = false;
    }
}

function keydown(event) {
    if (event.keyCode === 32) {
        jump = true;
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


function drawObstacle(obs) {
    ctx.fillStyle = "#f00";
    ctx.fill();
    if (gameStarted) {
        obs.x -= gameSpeed;
    }
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.fillRect(obs.x + 10, obs.y, obs.width, obs.height);
}

function addObstacle() {
    const obstacleHeight = CHARACTERHEIGHT + 10;
    obstacles.push({
        x: getObstacleX(),
        y: canvas.height - obstacleHeight - HORIZONHEIGHT,
        width: OBSTACLEWIDTH,
        height: obstacleHeight
    })
}

function removeFirstObstacle() {
    obstacles.splice(0, 1);
}

function drawCharacter() {
    ctx.fillStyle = "#fff";
    ctx.fill();

    if (characterYPosition <= maxJumpPoint) {
        this.drop = true;
        characterYPosition += gravity;
    }

    if (!drop && jump && characterYPosition > maxJumpPoint) {
        characterYPosition -= gravity;
        // characterYPosition -= gravity;
    } else {
        characterYPosition += gravity;
        if (characterYPosition >= INITIALYAXISPOSITION) {
            characterYPosition = INITIALYAXISPOSITION;
        }
        obstacles.forEach((obstacle, index) => {
            if (obstacle.x < 0) {
                obstacles.splice(index, 1);
            }
        });
    }

    ctx.fillRect(characterXPosition, characterYPosition, CHARACTERWIDTH, CHARACTERHEIGHT);

}


loop();



