(function (namespace) {

    let height = 45;
    let width = 45;
    let initialX = 30;

    const runningImages = [
        '/assets/2-running.svg',
        '/assets/3-running.svg',
        '/assets/4-running.svg',
        '/assets/5-running.svg',
        '/assets/6-running.svg',
    ];


    const slidingImages = ['/assets/slide.svg'];

    function GameCharacter({ canvas, horizon }) {
        this.horizon = horizon;
        this.canvas = canvas;
        this.gravity = 1.5;
        this.jumpHeight = height;
        this.velocity = 0;
        this.friction = 0.9;
        this.currentRunningImageIndex = 0;
        this.y = 0;
        this.x = initialX;
        this.height = height;
        this.width = width
        this.sliding = false;

        this.runningObjects = runningImages.map(imgPath => {
            const img = new Image();
            img.src = imgPath;
            return img;
        });

        this.slidingObjects = slidingImages.map(imgPath => {
            const img = new Image();
            img.src = imgPath;
            return img;
        });

    }

    GameCharacter.prototype = {
        jump() {
            if (!this.jumping) {
                this.jumping = true;
                this.velocity -= this.jumpHeight;
            }
        },
        show(ctx, frames, crashed) {
            let image;

            if (this.sliding) {
                image = this.slidingObjects[0];
            } else {
                if (this.runningObjects[this.currentRunningImageIndex]) {
                    image = this.runningObjects[this.currentRunningImageIndex];
                } else {
                    image = this.runningObjects[0];
                }
                if (!crashed && frames % 4 === 0) {
                    if (this.currentRunningImageIndex + 1 > runningImages.length) {
                        this.currentRunningImageIndex = 0;
                    } else {
                        this.currentRunningImageIndex += 1;
                    }
                }
            }

            this.velocity += this.gravity;
            this.y += this.velocity;
            this.velocity *= this.friction;

            if (this.y > this.horizon - this.height) {
                this.jumping = false;
                this.y = this.horizon - this.height;
                this.velocity = 0;
            }


            ctx.drawImage(image, this.x, this.y, this.width, this.height);
        },
        slide() {
            this.sliding = true;
            this.velocity += this.jumpHeight;
        },
        getUp() {
            this.sliding = false;
        }
    }


    namespace.GameCharacter = GameCharacter;
})(window);