(function (namespace) {

    let gravity = 5;
    let velocity = 1.2;
    let height = 60;
    let width = 60;
    let initialX = 30;
    let maxJumpHeight;
    let minJumpHeight;
    let initialY;
    let runningImages = [
        '/assets/running-1.svg',
        '/assets/running-2.svg',
        '/assets/running-3.svg',
        '/assets/running-4.svg',
        '/assets/running-5.svg',
        '/assets/running-6.svg',
        '/assets/running-7.svg',
        '/assets/running-8.svg',
        '/assets/running-9.svg',
        '/assets/running-10.svg',
        '/assets/running-11.svg',
        '/assets/running-12.svg',
        '/assets/running-13.svg',
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
            image = new Image();
            if (this.sliding) {
                image.src = slidingImages[0];
            } else {
                image.src = runningImages[this.currentRunningImageIndex];
                if (!crashed && frames % 5 === 0) {
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