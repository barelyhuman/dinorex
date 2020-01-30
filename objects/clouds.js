(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 0.2;
    const cloud = new Image();
    cloud.src = "/assets/cloud.svg";

    function Cloud({ gameSpeed, horizon }) {
        height = width = rand(40, 70);
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = rand(canvas.width, canvas.width + canvas.width);
        this.y = rand(canvas.height / 2 - (height * 2), canvas.height / 2 - (height * 1));
        this.x = initialX;
        this.height = height;
        this.width = width;
    }

    Cloud.prototype = {
        show(ctx, options) {
            if (!options.crashed) {
                this.x -= this.gameSpeed * velocity;
            }
            ctx.drawImage(cloud, this.x, this.y, this.width, this.height);
        },
        outside() {
            if (this.x < 0) {
                return true;
            }
            return false;
        }
    }


    namespace.Cloud = Cloud;
})(window);