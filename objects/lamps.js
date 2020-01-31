(function (namespace) {
    let height;
    let width;
    let initialX;
    let velocity = 0.7;

    const lamp = new Image();
    lamp.src = "/assets/lamp-1.svg";

    function Lamp({ gameSpeed, horizon }) {
        height = width = 100;
        this.gameSpeed = gameSpeed;
        this.canvas = canvas;
        initialX = rand(canvas.width, canvas.width + canvas.width);
        this.y = horizon - height;
        this.x = initialX;
        this.height = height;
        this.width = width;
    }

    Lamp.prototype = {
        show(ctx, options) {
            if (!options.crashed) {
                this.x -= this.gameSpeed * velocity;
            }
            ctx.drawImage(lamp, this.x, this.y, this.width, this.height);
        },
        outside() {
            if (this.x < 0) {
                return true;
            }
            return false;
        }
    }


    namespace.Lamp = Lamp;
})(window);