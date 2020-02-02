const canvas = document.createElement('canvas');
const container = document.querySelector('.game');
const context = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

container.appendChild(canvas);

export default () => ({ canvas, context });