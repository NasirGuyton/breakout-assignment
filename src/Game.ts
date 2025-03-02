import { Ball } from "./Ball";
import { Paddle } from "./Paddle";
import { Brick } from "./Brick";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[][];
  score: number;
  lives: number;
  brickRowCount: number = 3;
  brickColumnCount: number = 5;
  brickWidth: number = 75;
  brickHeight: number = 20;
  brickPadding: number = 10;
  brickOffsetTop: number = 30;
  brickOffsetLeft: number = 30;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.ball = new Ball(canvas.width / 2, canvas.height - 30, 2, -2, 10, "#0095DD");
    this.paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10, 75, 10, "#0095DD");
    this.score = 0;
    this.lives = 3;
    this.bricks = [];
    this.initializeBricks();
    this.addEventListeners();
  }

  initializeBricks(): void {
    this.bricks = [];
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        const x = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
        const y = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
        this.bricks[c][r] = new Brick(x, y, this.brickWidth, this.brickHeight, "#0095DD", 1);
      }
    }
  }

  addEventListeners(): void {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    document.addEventListener("mousemove", this.mouseMoveHandler.bind(this), false);
  }

  keyDownHandler(e: KeyboardEvent): void {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.paddle.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.paddle.leftPressed = true;
    }
  }

  keyUpHandler(e: KeyboardEvent): void {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.paddle.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.paddle.leftPressed = false;
    }
  }

  mouseMoveHandler(e: MouseEvent): void {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    this.paddle.moveWithMouse(relativeX, this.canvas);
  }

  collisionDetection(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const brick = this.bricks[c][r];
        if (brick.status && this.ball.x > brick.x && this.ball.x < brick.x + brick.width && this.ball.y > brick.y && this.ball.y < brick.y + brick.height) {
          this.ball.dy = -this.ball.dy;
          brick.status = 0;
          this.score++;
          if (this.score === this.brickRowCount * this.brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            this.restartGame();
          }
        }
      }
    }
  }

  restartGame(): void {
    this.ball.reset(this.canvas);
    this.paddle.reset(this.canvas);
    this.score = 0;
    this.lives = 3;
    this.initializeBricks();
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bricks.forEach(row => row.forEach(brick => brick.render(this.ctx)));
    this.paddle.move(this.canvas);
    this.paddle.render(this.ctx);
    this.ball.render(this.ctx);
    this.collisionDetection();

    if (this.ball.move(this.canvas, this.paddle)) {
      this.lives--;
      if (this.lives === 0) {
        alert("GAME OVER");
        this.restartGame();
      } else {
        this.ball.reset(this.canvas);
        this.paddle.reset(this.canvas);
      }
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}
