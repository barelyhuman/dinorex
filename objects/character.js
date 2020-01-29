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
        this.horizon = horizon;
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
            ctx.fillStyle = "#333";
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
        },
        slide() {
            this.width = height;
            this.height = width;
            this.y = this.horizon - width;
        },
        getUp() {
            this.width = width;
            this.height = height;
            this.y = this.horizon - height;
        }



    }


    namespace.GameCharacter = GameCharacter;
})(window);