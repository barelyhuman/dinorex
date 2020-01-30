(function (namespace) {
    let height;
    let width;
    let initialX;

    function Obstacle({ canvas, gameSpeed, horizon }) {
        height = rand(50, 70);
        width = rand(20, 40);
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = canvas.width;
        this.y = horizon - height;
        this.x = initialX;
        this.height = height;
        this.width = width;
        this.hit = false;
    }

    Obstacle.prototype = {
        show(ctx, options) {
            ctx.fillStyle = "#333";
            if (!options.crashed) {
                this.x -= this.gameSpeed;
            }
            ctx.fill();
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        hits(character) {
            if (this.x < character.x + character.width && this.x + this.width > character.x &&
                this.y < character.y + character.height && this.y + this.height > character.y) {
                this.hit = true;
                return true;
            }
            this.hit = false;
            return false;
        },
        outside() {
            if (this.x < 0) {
                return true;
            }
            return false;
        }
    }


    namespace.Obstacle = Obstacle;
})(window);