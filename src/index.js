import { Brick } from './brick.js';
import { Ball } from './ball.js';


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


class Background {
  constructor(color) {
    this.color = color;
  }

  render(ctx, canvas) {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}


class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rightPressed = false;
    this.leftPressed = false;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move(canvas) {
    if (this.rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    } else if (this.leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }

  reset(canvas) {
    this.x = (canvas.width - this.width) / 2;
  }

  moveWithMouse(relativeX, canvas) {
    if (relativeX > 0 && relativeX < canvas.width) {
      this.x = relativeX - this.width / 2;
    }
  }
}


class Score {
  constructor(x, y, color, font) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.font = font;
    this.score = 0;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, this.x, this.y);
  }

  update(points) {
    this.score += points;
  }

  reset() {
    this.score = 0;
  }
}


class Lives {
  constructor(x, y, color, font, lives) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.font = font;
    this.lives = lives;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Lives: ${this.lives}`, this.x, this.y);
  }

  loseLife() {
    this.lives--;
  }

  reset() {
    this.lives = 3;
  }
}


const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


const background = new Background("#eee");
const ball = new Ball(canvas.width / 2, canvas.height - 30, 2, -2, 10, "#0095DD");
const paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10, 75, 10, "#0095DD");
const score = new Score(8, 20, "#0095DD", "16px Arial");
const lives = new Lives(canvas.width - 65, 20, "#0095DD", "16px Arial", 3);


let bricks = [];
let animationId = null; 
let gameActive = true;


function initializeBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const x = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const y = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = new Brick(x, y, brickWidth, brickHeight, "#0095DD", 1);
    }
  }
}


initializeBricks();


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  paddle.moveWithMouse(relativeX, canvas);
}


function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (
        brick.status &&
        ball.x > brick.x &&
        ball.x < brick.x + brick.width &&
        ball.y > brick.y &&
        ball.y < brick.y + brick.height
      ) {
        ball.dy = -ball.dy;
        brick.status = 0;
        score.update(1);
        

        if (score.score === brickRowCount * brickColumnCount) {
          gameActive = false;
          alert("YOU WIN, CONGRATULATIONS!");
          restartGame();
        }
      }
    }
  }
}


function restartGame() {

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  gameActive = false;
  
  setTimeout(() => {
    ball.reset(canvas);
    paddle.reset(canvas);
    score.reset();
    lives.reset();
    initializeBricks();
    gameActive = true;
    

    animationId = requestAnimationFrame(draw);
  }, 1000);
}


function draw() {

  if (!gameActive) return;
  

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  

  background.render(ctx, canvas);
  bricks.forEach(row => row.forEach(brick => brick.render(ctx)));
  paddle.move(canvas);
  paddle.render(ctx);
  score.render(ctx);
  lives.render(ctx);
  ball.render(ctx);
  

  collisionDetection();
  

  const ballHitBottom = ball.move(canvas, paddle);
  
  if (ballHitBottom) {
    lives.loseLife();
    
    if (lives.lives <= 0) {
      gameActive = false;
      alert("GAME OVER");
      restartGame();
    } else {

      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      gameActive = false;
      
      setTimeout(() => {
        ball.reset(canvas);
        paddle.reset(canvas);
        gameActive = true;


        animationId = requestAnimationFrame(draw);
      }, 1000);
      
      return;
    }
  }
  

  if (gameActive) {
    animationId = requestAnimationFrame(draw);
  }
}


draw();