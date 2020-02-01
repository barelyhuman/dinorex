(function (namespace) {

    let gravity = 1.9;
    let velocity = 2.2;
    let height = 70;
    let width = 30;
    let initialX = 30;
    let maxJumpHeight;
    let minJumpHeight;
    let initialY;
    const runningImages = [
        '/assets/2-running.svg',
        '/assets/3-running.svg',
        '/assets/4-running.svg',
        '/assets/5-running.svg',
        '/assets/6-running.svg',
    ];


    const slidingImages = ['/assets/slide.svg'];

    function GameCharacter({ canvas, horizon }) {
        initialY = horizon - height + 10;
        this.horizon = horizon;
        this.canvas = canvas;
        this.currentRunningImageIndex = 0;
        this.y = initialY;
        this.x = initialX;
        this.height = height;
        this.width = width
        this.sliding = false;

        maxJumpHeight = this.horizon - (this.height * 2.5);
        minJumpHeight = this.horizon - (this.height * 2.4);

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
            if (this.sliding) {
                return;
            }
            if (!this.sliding && this.y >= maxJumpHeight) {
                this.y -= gravity * velocity;
            }
        },
        drop() {
            this.y += gravity * velocity;
            if (this.y + gravity >= initialY) {
                this.y = initialY;
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

            ctx.drawImage(image, this.x, this.y, this.width, this.height);
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
            this.sliding = true;
        },
        getUp() {
            this.sliding = false;
            this.width = width;
            this.height = height;
            this.y = initialY;
        }



    }


    namespace.GameCharacter = GameCharacter;
})(window);