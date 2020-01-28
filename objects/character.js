(function (namespace) {

    let gravity = 10;
    let velocity = 0.35;
    let height = 50;
    let width = 20;
    let initialX = 30;
    let maxJumpHeight;
    let initialY;

    function GameCharacter(canvas) {

        initialY = canvas.height - height;
        maxJumpHeight = canvas.height - (height * 3);
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
            if (this.y <= maxJumpHeight) {
                return true;
            }
            return false;
        },
        landed() {
            if (this.y === initialY) {
                return true;
            }
            return false;
        }



    }


    namespace.GameCharacter = GameCharacter;
})(window);