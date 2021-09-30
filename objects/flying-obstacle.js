import { rand } from '../helpers';
import ArrowImage from '../assets/arrow.png';

let height;
let width;
let initialX;
let velocity = 1.2;
const arrow = new Image();
arrow.src = ArrowImage;

export function Arrow({ gameSpeed, horizon, character, canvas }) {
  this.gameSpeed = gameSpeed;
  this.canvas = canvas;
  initialX = rand(canvas.width, canvas.width + canvas.width);
  const yOne = horizon - character.height / 2;
  const yTwo = horizon - character.height + 5;
  this.x = initialX;
  const yPositioning = [yOne, yTwo];
  const topPositions = rand(0, 2);
  this.y = yPositioning[topPositions];
  this.height = arrow.height;
  this.width = arrow.width;
  this.changeImageHeight();
}

Arrow.prototype = {
  changeImageHeight() {
    var maxWidth = 50; // Max width for the image
    var maxHeight = 50; // Max height for the image
    var ratio = 0; // Used for aspect ratio
    var width = arrow.width; // Current image width
    var height = arrow.height; // Current image height

    // Check if the current width is larger than the max
    if (width > maxWidth) {
      ratio = maxWidth / width; // get ratio for scaling image
      height = height * ratio; // Reset height to match scaled image
      width = width * ratio; // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if (height > maxHeight) {
      ratio = maxHeight / height; // get ratio for scaling image
      width = width * ratio; // Reset width to match scaled image
      height = height * ratio; // Reset height to match scaled image
    }
    this.height = height;
    this.width = width;
  },
  show(ctx, options) {
    if (!options.crashed) {
      this.x -= this.gameSpeed * velocity;
    }
    ctx.drawImage(arrow, this.x, this.y, this.width, this.height);
  },
  hits(character) {
    if (
      !character.sliding &&
      this.x < character.x + character.width &&
      this.x + this.width > character.x &&
      this.y < character.y + character.height &&
      this.y + this.height > character.y
    ) {
      this.hit = true;
      return true;
    }
    this.hit = false;
    return false;
  },
  outside() {
    if (this.x < 0) {
      return true;
    }
    return false;
  },
};
