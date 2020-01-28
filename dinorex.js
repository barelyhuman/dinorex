const container = document.querySelector('.game');
const canvas = document.createElement('canvas');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext('2d');
container.appendChild(canvas);

let character;
let obstacles = [];
let gameStarted = false;
let jump = false;
let drop = false;
let frames = 0;
let gameSpeed = 5;
let crashed = false;

function setup() {
    character = new GameCharacter(canvas);
    character.show(ctx);
    initKeyMaps();
    setBackground();
    loop();
}

function reset() {
    character = {}
    obstacles = [];
    gameStarted = false;
    jump = false;
    drop = false;
    frames = 0;
    gameSpeed = 5;
    crashed = false;
    setup();
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


    obstacles.forEach(obs => {
        obs.show(ctx, { crashed });
        if (obs.hits(character)) {
            crashed = true
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


    requestAnimationFrame(loop);
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
    ctx.font = "30px Arial";
    ctx.fillText("You Crashed", canvas.height / 2, canvas.width / 2);
}

function keyup(event) {
    if (event.keyCode === 32) {
        jump = false;
        drop = true;
    }
}

function keydown(event) {
    if (event.keyCode === 32) {
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


function drawObstacle(obs) {

}

function addObstacle(numberOfObstacles) {
    for (let i = 0; i < numberOfObstacles; i++) {
        obstacles.push(new Obstacle({ canvas, gameSpeed }));
    }
}

function removeFirstObstacle() {
    obstacles.splice(0, 1);
}


setup();

