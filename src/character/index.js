export default class Character {

    constructor(x, y, velocity, height, width) {
        this.x = x;
        this.y = y;
        this.initialVelocity = velocity;
        this.velocity = velocity;
        this.height = height;
        this.width = width;
        this.jumping = false;
        this.sliding = false;
        this.running = false;
        this.image = null;
        this.createSprites();
        this.horizon = y;
        this.gravity = 1;
        this.maxJumpHeight = height * 2;
    }

    createSprites() {
        const assets = {
            jumpImages: [
                '/assets/Jump (7).png'
            ],
            idleImages: [
                '/assets/Idle (1).png'
            ],
            runningImages: [
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
            ],
            slidingImages: [
                '/assets/Dead (15).png'
            ]
        };


        this.jumpImages = assets.jumpImages.map(this.getImageObject);
        this.idleImages = assets.idleImages.map(this.getImageObject);
        this.runningImages = assets.runningImages.map(this.getImageObject);
        this.slidingImages = assets.slidingImages.map(this.getImageObject);

        this.image = this.idleImages[0];
    }

    getImageObject(imgSrc) {
        const image = new Image();
        image.src = imgSrc;
        return image;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update(canvas, ctx) {
        if (this.y + this.velocity > this.horizon && !this.jumping) {
            this.velocity = 0;
        }

        const jumpValue = this.y - this.velocity;

        if (jumpValue <= this.horizon - this.maxJumpHeight) {
            this.drop();
        }

        if (this.jumping) {
            this.y -= this.velocity;
        } else {
            this.y += this.velocity;
        }

        if (this.sliding) {
            const temp = this.height;
            this.height = this.width;
            this.width = temp;
        } else {
            const temp = this.height;
            this.height = this.width;
            this.width = temp;
        }

        this.velocity += this.gravity;
        this.draw(ctx);
    }

    jump() {
        this.jumping = true;
        this.image = this.jumpImages[0];
    }

    drop() {
        this.jumping = false;
        this.image = this.idleImages[0];
    }

    run() {
        if (!this.currentRunningIndex) {
            this.currentRunningIndex = 0;
        }
        if (this.currentRunningIndex + 1 > this.runningImages.length - 1) {
            this.currentRunningIndex = 0;
        } else {
            this.currentRunningIndex += 1;
        }
        this.running = true;
        this.image = this.runningImages[this.currentRunningIndex];
    }

    slide() {
        this.image = this.slidingImages[0];
        this.sliding = true;
        this.jumping = false;
    }

    getUp() {
        this.image = this.idleImages[0];
        this.sliding = false;
    }

}
