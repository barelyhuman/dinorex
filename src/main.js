let context, controller, rectangle, loop;

let jumpHeight = 25;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = window.innerHeight;
context.canvas.width = window.innerWidth;

const characterImages = {
    idleImage: new Image(),
    jumpingImage: new Image(),
    runningImageLeft: new Image(),
    runningImageRight: new Image(),
    slideImage: new Image()
}


characterImages.idleImage.src = 'assets/Idle (4).png';
characterImages.jumpingImage.src = 'assets/Jump (7).png';
characterImages.runningImageLeft.src = 'assets/Run (4).png';
characterImages.runningImageRight.src = 'assets/Run (15).png';
characterImages.slideImage.src = 'assets/Dead (15).png';

character = {
    height: 64,
    jumping: true,
    width: 64,
    x: 144,
    image: characterImages.idleImage,
    x_velocity: 0,
    y: 0,
    y_velocity: 0
};

controller = {
    up: false,
    down: false,
    keyListener: function (event) {

        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {
            case 40:
                controller.down = key_state
            case 32:
            case 38:
                controller.up = key_state;
                break;
        }

    }

};

loop = function () {
    if (controller.up && character.jumping == false) {
        character.image = characterImages.jumpingImage;
        character.y_velocity -= jumpHeight;
        character.jumping = true;
    } else {
        character.image = characterImages.idleImage;
    }

    if (controller.down) {
        character.image = characterImages.slideImage;
        character.y_velocity += jumpHeight;
    }

    character.y_velocity += 1.5;
    character.x += character.x_velocity;
    character.y += character.y_velocity;
    character.x_velocity *= 0.9;
    character.y_velocity *= 0.9;


    if (character.y > context.canvas.height / 2 - character.height) {
        character.jumping = false;
        character.y = context.canvas.height / 2 - character.height;
        character.y_velocity = 0;
    }


    if (character.x < 0) {
        character.x = context.canvas.width;
    } else if (character.x > context.canvas.width) {
        character.x = 0;
    }

    context.fillStyle = "#fff";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#ff0000";
    context.beginPath();
    context.drawImage(character.image, character.x, character.y, character.width, character.height);
    context.fill();
    context.strokeStyle = "#333";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, context.canvas.height / 2);
    context.lineTo(context.canvas.width, context.canvas.height / 2);
    context.stroke();


    window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);