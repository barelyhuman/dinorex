(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 0.7;

    const fenceImages = ['/assets/yard.svg'];

    const loadedFenceImages = fenceImages.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    function Obstacle({ canvas, gameSpeed, horizon }) {
        this.randomDimensionsOne = rand(40, 60);
        this.randomDimensionsTwo = rand(40, 60);
        this.existence = rand(0, 2);
        height = this.randomDimensionsOne;
        width = this.randomDimensionsOne;
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = canvas.width;
        this.y = horizon - height;
        this.horizon = horizon;
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
            if (this.existence) {
                this.multiple();
            } else {
                ctx.drawImage(loadedFenceImages[0], this.x, this.y, this.width, this.height);
            }
        },
        multiple() {
            ctx.drawImage(loadedFenceImages[0], this.x, this.horizon - this.randomDimensionsOne, this.randomDimensionsOne, this.randomDimensionsOne);
            ctx.drawImage(loadedFenceImages[0], this.x + (this.randomDimensionsTwo - this.randomDimensionsTwo / 2), this.horizon - this.randomDimensionsTwo, this.randomDimensionsTwo, this.randomDimensionsTwo);
        },
        hits(character) {
            if (
                this.x < character.x + character.width && this.x + this.randomDimensionsOne > character.x &&
                this.y < character.y + character.height && this.y + this.randomDimensionsOne > character.y &&
                this.x < character.x + character.width && this.x + this.randomDimensionsTwo > character.x &&
                this.y < character.y + character.height && this.y + this.randomDimensionsTwo > character.y
            ) {
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