(function (namespace) {
    let height = 50;
    let width = 20;
    let initialX;

    function Obstacle({ canvas, gameSpeed, horizon }) {
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = canvas.width;
        this.y = horizon - height;
        this.x = initialX;
        this.height = height;
        this.width = width
        this.hit = false;
    }

    Obstacle.prototype = {
        show(ctx, options) {
            if (this.hit) {
                ctx.fillStyle = "#f00";
            } else {
                ctx.fillStyle = "#0f0";
            }
            ctx.fill();
            if (!options.crashed) {
                const before = this.x;
                this.x -= this.gameSpeed;
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        hits(character) {
            if (
                (this.y <= character.y + character.height && this.y >= character.y)
                &&
                (character.x <= this.x + this.width && character.x >= this.x)) {
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