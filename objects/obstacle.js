(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 0.7;

    const fenceImages = ['/assets/log-fire.svg'];

    const loadedFenceImages = fenceImages.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    function Obstacle({ canvas, gameSpeed, horizon }) {
        const randDimensions = rand(40, 60);
        height = randDimensions;
        width = randDimensions;
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
            if (!options.crashed) {
                this.x -= this.gameSpeed * velocity;
            }

            ctx.drawImage(loadedFenceImages[0], this.x, this.y, this.width, this.height);
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