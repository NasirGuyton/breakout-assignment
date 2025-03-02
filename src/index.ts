import { Game } from "./Game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  const game = new Game(canvas);
  game.draw();
});
