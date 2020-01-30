(function (namespace) {

    let gravity = 4;
    let velocity = 2.2;
    let height = 50;
    let width = 20;
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
        initialY = horizon - height;
        maxJumpHeight = horizon - (height * 4);
        minJumpHeight = horizon - (height * 3.9);
        this.horizon = horizon;
        this.canvas = canvas;
        this.currentRunningImageIndex = 0;
        this.y = initialY;
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
            this.width = width;
            this.height = height;
            this.y = this.horizon - height;
            this.image = null;
            this.sliding = false;
        }



    }


    namespace.GameCharacter = GameCharacter;
})(window);