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
let gravity = 5;
let maxJumpPoint = 300;

let obstacles = [];

const getObstacleX = () => rand(canvas.width, canvas.width + OBSTACLEWIDTH);

function loop() {
    setBackground();
    initKeyMaps();
    obstacles.forEach(obs => {
        drawObstacle(obs);
    });
    addObstacle();
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
}

function addObstacle() {
    const obstacleHeight = CHARACTERHEIGHT + 10;
    if (obstacles.length < 3) {
        obstacles.push({
            x: getObstacleX(),
            y: canvas.height - obstacleHeight - HORIZONHEIGHT,
            width: OBSTACLEWIDTH,
            height: obstacleHeight
        })
    }
}

function removeFirstObstacle() {
    obstacles.splice(0, 1);
}

function drawCharacter() {
    ctx.fillStyle = "#fff";
    ctx.fill();
    if (gameStarted) {

    }

    if (jump) {
        if (characterYPosition - gravity < 20) {
            jump = false;
        } else {
            characterYPosition -= gravity;
        }
    } else {
        characterYPosition = characterYPosition + gravity > INITIALYAXISPOSITION ? INITIALYAXISPOSITION : characterYPosition + gravity;
        obstacles.forEach(obstacle => {
            if (characterYPosition > obstacle.y && characterXPosition > obstacle.x) {
                removeFirstObstacle();
                const randomNumber = rand(0, 10);
                console.log(randomNumber);
                for (let i = 0; i < randomNumber; i++) {
                    addObstacle()
                }
            }
        });
    }

    ctx.fillRect(characterXPosition, characterYPosition, CHARACTERWIDTH, CHARACTERHEIGHT);

}


loop();



