let key = {'up':false,'down':false,'left':false,'right':false};
document.addEventListener("keydown", function(e){
  switch (e.code) {
    case "KeyW":
      key.up = true;
      break;
    case "KeyA":
      key.left = true;
      break;
    case "KeyS":
      key.down = true;
      break;
    case "KeyD":
      key.right = true;
      break;
    case "KeyR":
      customMode = 'position';
      custom.angle = 0;
      custom.scale = 1;
      break;
    case "KeyZ":
      customMode = 'rotation';
      break;
    case "KeyX":
      customMode = 'scale';
      break;
    case "KeyC":
      customMode = 'position';
      break;
  }
});
document.addEventListener("keyup", function(e){
  switch (e.code) {
    case "KeyW":
      key.up = false;
      break;
    case "KeyA":
      key.left = false;
      break;
    case "KeyS":
      key.down = false;
      break;
    case "KeyD":
      key.right = false;
      break;
  }
});

function move(){
if(key.up){ty+=vitesse;}
if(key.down){ty-=vitesse;}
if(key.left){tx+=vitesse;}
if(key.right){tx-=vitesse;}
}

let mouse = {'x':0,'y':0};
document.addEventListener("mousemove", function(e){
  mouse.x = (e.clientX - tx)/zoom + cx;
  mouse.y = (e.clientY - ty)/zoom + cy;


  try {
      window[mode+"Move"]();
  } catch (e) {

  }

});


document.getElementById('canvas').addEventListener("wheel", function(e){
  let dcx = (e.clientX - tx)/zoom;
  let dcy = (e.clientY - ty)/zoom;

  tx+=dcx*zoom;
  cx+=dcx;

  ty+=dcy*zoom;
  cy+=dcy;

  zoom*=10**(e.deltaY/-4000);
});


let lastClick = {'x':0,'y':0};
let c1 = {'x':0,'y':0};
let nbClick = 0;
let marker = false;

document.getElementById('canvas').addEventListener("click", function(e){
  marker = false;
  lastClick = {'x':(e.clientX - tx)/zoom + cx,'y':(e.clientY - ty)/zoom + cy};

  try {
      window[mode+"Click"]();
  } catch (e) {

  }
});



function flushTemp(){
  mode = 'none';
  temp = [];
}
