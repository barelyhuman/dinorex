(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 1;

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
                this.grayscale(ctx);
                ctx.drawImage(this.image, this.x, this.horizon - this.height, this.width, this.height);
                this.resetCtxFilter(ctx);
            }
        },
        multiple() {
            this.grayscale(ctx);
            ctx.drawImage(this.image, this.x, this.horizon - this.randomDimensionsOne, this.randomDimensionsOne, this.randomDimensionsOne);
            ctx.drawImage(this.imageTwo, this.x + this.randomDimensionsOne + 10, this.horizon - this.randomDimensionsTwo, this.randomDimensionsTwo, this.randomDimensionsTwo);
            this.resetCtxFilter(ctx);
        },
        grayscale(ctx) {
            ctx.filter = "grayscale(100%)"
        },
        resetCtxFilter(ctx) {
            ctx.filter = "none";
        },
        hits(character) {
            if (this.existence && this.hitMultiple(character)) {
                this.hit = true;
                return true;
            } else if (!this.existence && this.hitSingle(character)) {
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
        },

        hitSingle(character) {
            return (this.x < character.x + (character.width - character.width / 2) && this.x + (this.width - this.width / 2) > character.x &&
                this.y < character.y + character.height && this.y + this.height > character.y)
        },
        hitMultiple(character) {
            return ((this.x < character.x + (character.width - character.width / 2) && this.x + (this.randomDimensionsOne - this.randomDimensionsOne / 2) > character.x &&
                this.y < character.y + character.height && this.y + this.randomDimensionsOne > character.y) &&
                (this.x < character.x + (character.width - character.width / 2) && this.x + (this.randomDimensionsTwo - this.randomDimensionsTwo / 2) > character.x &&
                    this.y < character.y + character.height && this.y + this.randomDimensionsTwo > character.y))
        }
    }


    namespace.Obstacle = Obstacle;
})(window);