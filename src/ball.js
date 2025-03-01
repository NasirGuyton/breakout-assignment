export class Ball {
    constructor(x, y, dx, dy, radius, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.color = color;
    }
  
    render(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  
    move(canvas, paddle) {

      if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
        this.dx = -this.dx;
      }
      

      if (this.y + this.dy < this.radius) {
        this.dy = -this.dy;
      } 

      else if (this.y + this.dy > canvas.height - this.radius) {

        if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
          this.dy = -this.dy;
        } else {

          return true; 
        }
      }
      

      this.x += this.dx;
      this.y += this.dy;
      return false; 
    }
  
    reset(canvas) {

      this.x = canvas.width / 2;
      this.y = canvas.height - 30;
      this.dx = 2;
      this.dy = -2;
    }
  }