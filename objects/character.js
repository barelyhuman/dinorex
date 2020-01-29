(function (namespace) {

    let gravity = 5;
    let velocity = 1.2;
    let height = 50;
    let width = 20;
    let initialX = 30;
    let maxJumpHeight;
    let minJumpHeight;
    let initialY;

    function GameCharacter({ canvas, horizon }) {

        initialY = horizon - height;
        maxJumpHeight = horizon - (height * 4);
        minJumpHeight = horizon - (height * 3.9);
        this.canvas = canvas;
        this.y = initialY;
        this.x = initialX;
        this.height = height;
        this.width = width
    }

    GameCharacter.prototype = {
        jump() {
            if (this.y >= maxJumpHeight) {
                this.y -= gravity * velocity;
            }
        },
        drop() {
            this.y += gravity * velocity;
            if (this.y + gravity >= initialY) {
                this.y = initialY;
            }
        },
        show(ctx) {
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        canJump() {
            if (this.canvas.height - height >= this.y) {
                return true;
            }
            return false;
        },
        reachedMaxHeight() {
            if (this.y < minJumpHeight || this.y <= maxJumpHeight) {
                return true;
            }
            return false;
        },
        landed() {
            if (this.y >= initialY) {
                return true;
            }
            return false;
        }



    }


    namespace.GameCharacter = GameCharacter;
})(window);