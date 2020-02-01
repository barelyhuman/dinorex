(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 1.2;
    const arrow = new Image();
    arrow.src = "/assets/arrow.svg";

    function Arrow({ gameSpeed, horizon, character }) {
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = rand(canvas.width, canvas.width + canvas.width);
        this.y = rand(horizon - character.height, horizon - (character.height / 2));
        this.x = initialX;
        this.height = arrow.height;
        this.width = arrow.width;
    }

    Arrow.prototype = {
        show(ctx, options) {
            if (!options.crashed) {
                this.x -= this.gameSpeed * velocity;
            }
            ctx.drawImage(arrow, this.x, this.y, this.width, this.height);
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


    namespace.Arrow = Arrow;
})(window);