function drawInterface(){
  ctx.setTransform(1, 0, 0, 1, 0, 0); //ctx de base
  ctx.font = "30px Arial";
  ctx.fillStyle = "#ff0000";

  //ctx.drawImage(getTexture('cross'), canvas.width/2 - 20, canvas.height/2 - 20, 40, 40);

  ctx.translate(tx,ty);
  ctx.scale(zoom, zoom);
  ctx.translate(-cx,-cy);

  if(marker){
    ctx.drawImage(getTexture('marker'), marker.x-20/zoom,marker.y-40/zoom, 40/zoom, 40/zoom);
  }


  let quadrillage = document.getElementById('quadrillage').checked;

  if (quadrillage) {
    for (var i = 0; i < canvas.height/100/zoom; i++) {
      ctx.beginPath();
      ctx.moveTo(cx-tx/zoom, Math.floor((cy-ty/zoom)/100)*100 + i*100);
      ctx.lineTo(cx-tx/zoom + canvas.width/zoom, Math.floor((cy-ty/zoom)/100)*100+ i*100);
      ctx.stroke();
    }
    for (var i = 0; i < canvas.width/100/zoom; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.floor((cx-tx/zoom)/100)*100 + i*100, cy-ty/zoom);
      ctx.lineTo(Math.floor((cx-tx/zoom)/100)*100 + i*100, cy-ty/zoom + canvas.height/zoom);
      ctx.stroke();
    }

  }

}

let frame = 0;
function drawFrame(){
  let t1 = window.performance.now();
  generateStack();
  clear();
  drawAllImages();
  drawInterface();
  timeToDraw = window.performance.now()-t1;
  document.getElementById('fps').innerHTML = timeToDraw.toFixed(2);
  frame++;
}

function generateStack(){
  stack = [];
  for (var elem of map.collapse()) {
    stack.push(elem);
  }

  stack = stack.concat(temp);
}

function drawAllImages() {
  for (var image of stack) {
    image.draw();
  }
}

function getTexture(str){
  if(!textures[str]){
    textures[str] = new Image();
    textures[str].src = `img/${str}.png`;
  }
  return textures[str];
}


//Misc:
function normal(){
  return Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random());
}

function clear(){ctx.setTransform(1, 0, 0, 1, 1, 1);ctx.clearRect(-1, -1, 10*canvas.width + 1, 10*canvas.height + 1);}


function arctan(y,x){
  let angle = Math.atan2(y, x);
  if(angle<0){
    return 2*Math.PI + angle;
  }
  return angle;
}

function format(int){
  return "0".repeat(2-int.toString().length) + int;
}
