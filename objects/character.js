import RunningImage1 from '../assets/Run (1).png';
import RunningImage2 from '../assets/Run (2).png';
import RunningImage3 from '../assets/Run (3).png';
import RunningImage4 from '../assets/Run (4).png';
import RunningImage5 from '../assets/Run (5).png';
import RunningImage6 from '../assets/Run (6).png';
import RunningImage7 from '../assets/Run (7).png';
import RunningImage8 from '../assets/Run (8).png';
import RunningImage9 from '../assets/Run (9).png';
import RunningImage10 from '../assets/Run (10).png';
import RunningImage11 from '../assets/Run (11).png';
import RunningImage12 from '../assets/Run (12).png';
import RunningImage13 from '../assets/Run (13).png';
import RunningImage14 from '../assets/Run (14).png';
import RunningImage15 from '../assets/Run (15).png';
import JumpingImage from '../assets/Jump.png';
import SlidingImage from '../assets/Slide.png';

let height = 50;
let width = 50;
let initialX = 30;

const runningImages = [
  RunningImage1,
  RunningImage2,
  RunningImage3,
  RunningImage4,
  RunningImage5,
  RunningImage6,
  RunningImage7,
  RunningImage8,
  RunningImage9,
  RunningImage10,
  RunningImage11,
  RunningImage12,
  RunningImage13,
  RunningImage14,
  RunningImage15,
];

const jumpingImages = [JumpingImage];

const slidingImages = [SlidingImage];

export function GameCharacter({ canvas, horizon }) {
  this.horizon = horizon + 5;
  this.canvas = canvas;
  this.gravity = 1.5;
  this.jumpHeight = height / 2 + 2;
  this.velocity = 0;
  this.friction = 0.9;
  this.currentRunningImageIndex = 0;
  this.y = 0;
  this.x = initialX;
  this.height = height;
  this.width = width;
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
    } else if (this.jumping) {
      image = this.jumpingImages[0];
    } else {
      if (this.runningObjects[this.currentRunningImageIndex]) {
        image = this.runningObjects[this.currentRunningImageIndex];
      } else {
        image = this.runningObjects[0];
      }
      if (!crashed && frames % 1 === 0) {
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

    if (this.y > this.horizon - this.height) {
      this.jumping = false;
      this.y = this.horizon - this.height;
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
  },
};
