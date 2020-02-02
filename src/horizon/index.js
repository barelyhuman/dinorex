export default class Horizon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update(canvas, ctx) {
        this.draw(canvas, ctx);
    }

    draw(canvas, ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(canvas.width, this.y);
        ctx.lineWidth = 6;
        ctx.stroke();
    }


}