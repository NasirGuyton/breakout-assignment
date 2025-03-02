export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  rightPressed: boolean;
  leftPressed: boolean;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.rightPressed = false;
    this.leftPressed = false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move(canvas: HTMLCanvasElement): void {
    if (this.rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    } else if (this.leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }

  reset(canvas: HTMLCanvasElement): void {
    this.x = (canvas.width - this.width) / 2;
  }

  moveWithMouse(relativeX: number, canvas: HTMLCanvasElement): void {
    if (relativeX > 0 && relativeX < canvas.width) {
      this.x = relativeX - this.width / 2;
    }
  }
}
