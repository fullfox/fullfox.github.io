const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let img = new Image();
img.src = "asteroid.png";

const ctx = canvas.getContext("2d");

let _loop = window.setInterval(draw, 10);
ctx.fillStyle = "#FFFFFF";

control = { x: 0, y: 0, z: 0 };
momentum = { x: 0, y: 0, z: 0 };

points = [];
let n = 1000;
let v0 = 0.001;
let g = 0.1 / n;

let camera = [5000, 5000, 0];
focal = 20;
attenuation = 1.5;
visu = [];

for (var i = 0; i < n; i++) {
  addElem(Math.random());
}

function addElem(r) {
  asteroid = (Math.random() > 0.75 && r == 1);
  points.push([
    (Math.random() - 0.5) * 50000 * r + camera[0],
    (Math.random() - 0.5) * 50000 * r + camera[1],
    r * 1000 + camera[2],
    asteroid,
    asteroid ? Math.random() * Math.PI * 2 : 0,
  ]);
}

function calcul() {
  camera[2] += 2;

  if (control.x != 0) momentum.x = control.x;
  else momentum.x /= attenuation;
  if (control.y != 0) momentum.y = control.y;
  else momentum.y /= attenuation;

  camera[0] += 30 * momentum.x;
  camera[1] += 30 * momentum.y;

  visu = [];
  for (i = 0; i < points.length; i++) {
    p = points[i];
    let ratio = focal / (p[2] - camera[2]);
    if (ratio > 0) {
      visu.push([
        canvas.width / 2 + (p[0] - camera[0]) * ratio,
        canvas.height / 2 + (p[1] - camera[1]) * ratio,
        ratio,
        p[3],
        p[4],
      ]);
    } else {
      points.splice(i, 1);
      i--;
      addElem(1);
    }
  }
  //camera[2] += 0.1;
}

let t = 0;
function draw() {
  calcul();
  visu.sort(function (a, b) {
    return a[2] - b[2];
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  t++;
  for (p of visu) {
    ctx.beginPath();
    if (p[3] == true) {
      if (p[2] < 2) {
        taille = 1000 * p[2] ** 1.4;
        ctx.translate(p[0], p[1]);
        ctx.rotate(p[4]);
        ctx.translate(-taille / 2, -taille / 2);
        ctx.drawImage(img, 0, 0, taille, taille);
        ctx.resetTransform();
        ctx.fillStyle = "#FF0000";

        //ctx.arc(p[0], p[1], 4, 0, 2 * Math.PI);
      }
    } else {
      ctx.fillStyle = "#FFFFFF";
      ctx.arc(p[0], p[1], 1, 0, 2 * Math.PI);
    }
    ctx.fill();
  }
}

function stop() {
  clearInterval(_loop);
}

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      control.y = -1;
      break;
    case "KeyS":
      control.y = 1;
      break;
    case "KeyA":
      control.x = -1;
      break;
    case "KeyD":
      control.x = 1;
      break;
  }
}, false);

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      control.y = 0;
      break;
    case "KeyS":
      control.y = 0;
      break;
    case "KeyA":
      control.x = 0;
      break;
    case "KeyD":
      control.x = 0;
      break;
  }
}, false);
