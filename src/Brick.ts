export class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  status: number;

  constructor(x: number, y: number, width: number, height: number, color: string, status: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.status = status;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.status) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}
