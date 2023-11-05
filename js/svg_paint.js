const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.rect(20, 20, 200, 100);
ctx.fillStyle = "yellow";
ctx.fill();
ctx.beginPath();
ctx.arc(100, 75, 50, 0, 2 * Math.PI);
ctx.stroke();

const canvas2 = document.getElementById("canvas2");
const ctx2= canvas2.getContext("2d");
ctx2.rect(10, 20, 150, 100);
ctx2.strokeStyle = "purple";
ctx2.stroke();