import getCanvas from './canvas/get-canvas';
import Character from './character';
import Horizon from './horizon';

const JUMPING_KEYS = [32, 38];
const SLIDING_KEYS = [40];
const SPAWN = 40;
let HORIZON;
let BACKGROUNDIMAGE;


let character;
let characterDimension = 100;
let horizon;
let horizonThreshold = 10;
let frames = 0;
let gameStatesMap = {
    NOTSTARTED: 'NOTSTARTED',
    STARTED: 'STARTED',
    CRASHED: 'CRASHED',
};
let gameState = gameStatesMap.NOTSTARTED;

function main() {
    let { canvas, context: ctx } = getCanvas();

    generateBackgroundImage();
    HORIZON = canvas.height / 2;
    character = new Character(
        SPAWN, HORIZON - characterDimension + horizonThreshold, 0.1, characterDimension, characterDimension
    );
    horizon = new Horizon(
        0, HORIZON
    );
    setupKeyboard();
    update(canvas, ctx);
}

function generateBackgroundImage() {
    const image = new Image();
    image.src = '/assets/background.png';
    BACKGROUNDIMAGE = image;
}

function update(canvas, ctx) {
    frames += 1;

    if (gameState === gameStatesMap.STARTED) {
        if (frames % 2 === 0) {
            character.run();
        }

    }

    renderBackground(canvas, ctx);
    renderHorizon(canvas, ctx);
    character.update(canvas, ctx);
    requestAnimationFrame(() => update(canvas, ctx));
}

function renderBackground(canvas, ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setupKeyboard() {
    document.addEventListener('keydown', onKeyPress);
    document.addEventListener('keyup', onKeyRelease);
}

function onKeyPress(event) {

    if (JUMPING_KEYS.indexOf(event.keyCode) > -1) {
        if (!character.jumping) {
            character.jump();
        }

        if (gameState === gameStatesMap.NOTSTARTED) {
            gameState = gameStatesMap.STARTED;
            character.run();
        }
    }

    if (SLIDING_KEYS.indexOf(event.keyCode) > -1) {
        character.slide();
    }
}

function onKeyRelease(event) {
    if (JUMPING_KEYS.indexOf(event.keyCode) > -1) {
        character.drop();
    }
    if (SLIDING_KEYS.indexOf(event.keyCode) > -1) {
        character.getUp();
    }
}


function renderHorizon(canvas, ctx) {
    horizon.update(canvas, ctx);
}

main();
