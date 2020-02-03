(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 0.7;

    const fenceImages = ['/assets/spike_big.png', '/assets/spike_small.png'];

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
        this.image = loadedFenceImages[rand(0, 2)];
        this.imageTwo = loadedFenceImages[rand(0, 2)];
    }

    Obstacle.prototype = {
        show(ctx, options) {
            if (!options.crashed) {
                this.x -= this.gameSpeed * velocity;
            }
            if (this.existence) {
                this.multiple();
            } else {
                ctx.drawImage(this.image, this.x, this.horizon - this.height, this.width, this.height);
            }
        },
        multiple() {
            ctx.drawImage(this.image, this.x, this.horizon - this.randomDimensionsOne, this.randomDimensionsOne, this.randomDimensionsOne);
            ctx.drawImage(this.imageTwo, this.x + this.randomDimensionsOne + 10, this.horizon - this.randomDimensionsTwo, this.randomDimensionsTwo, this.randomDimensionsTwo);
        },
        hits(character) {
            if (
                (this.x < character.x + character.width && this.x + this.width > character.x &&
                    this.y < character.y + character.height && this.y + this.height > character.y)
                || (this.x < character.x + character.width && this.x + this.randomDimensionsOne > character.x &&
                    this.y < character.y + character.height && this.y + this.randomDimensionsOne > character.y) ||
                (this.x < character.x + character.width && this.x + this.randomDimensionsTwo > character.x &&
                    this.y < character.y + character.height && this.y + this.randomDimensionsTwo > character.y)
            ) {
                this.hit = true;
                return true;
            }
            this.hit = false;
            return false;
        },
        outside() {
            if (this.x + this.width < -10) {
                return true;
            }
            return false;
        }
    }


    namespace.Obstacle = Obstacle;
})(window);