(function (namespace) {

    let height = 64;
    let width = 64;
    let initialX = 30;

    const runningImages = [
        '/assets/Run (1).png',
        '/assets/Run (2).png',
        '/assets/Run (3).png',
        '/assets/Run (4).png',
        '/assets/Run (5).png',
        '/assets/Run (6).png',
        '/assets/Run (7).png',
        '/assets/Run (8).png',
        '/assets/Run (9).png',
        '/assets/Run (10).png',
        '/assets/Run (11).png',
        '/assets/Run (12).png',
        '/assets/Run (13).png',
        '/assets/Run (14).png',
        '/assets/Run (15).png',
    ];

    const jumpingImages = [
        '/assets/Jump.png',
    ];

    const slidingImages = ['/assets/Slide.png'];

    function GameCharacter({ canvas, horizon }) {
        this.horizon = horizon;
        this.canvas = canvas;
        this.gravity = 1.5;
        this.jumpHeight = height / 2 + 2;
        this.velocity = 0;
        this.friction = 0.9;
        this.currentRunningImageIndex = 0;
        this.y = 0;
        this.x = initialX;
        this.height = height;
        this.width = width
        this.sliding = false;

        this.jumpingImages = jumpingImages.map(createImageObject);

        this.runningObjects = runningImages.map(createImageObject);

        this.slidingObjects = slidingImages.map(createImageObject);

    }

    function createImageObject(imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        return img;
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
            }
            else if (this.jumping) {
                image = this.jumpingImages[0];
            }
            else {
                if (this.runningObjects[this.currentRunningImageIndex]) {
                    image = this.runningObjects[this.currentRunningImageIndex];
                } else {
                    image = this.runningObjects[0];
                }
                if (!crashed && frames % 2 === 0) {
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

            if (this.y > this.horizon - this.height + 10) {
                this.jumping = false;
                this.y = this.horizon - this.height + 10;
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