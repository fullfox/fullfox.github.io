let ctx;
let canvas;
let stack = [];
let timeToDraw = 0;
let mapOrder = ["grass","rivers","chemins","ponts","rocks","forests","custom","temp"];
let map = new Folder("map");

//Ordre:
grass = map.subFolder("grass");
rivers = map.subFolder("rivers");
chemins = map.subFolder("chemins");
ponts = map.subFolder("ponts");
customs = map.subFolder("custom");
rocks = map.subFolder("rocks");
forests = map.subFolder("forests");
temp = []; //Temporaire aka truc en cours de dessinage

let textures = [];

map.subFolder("custom");

let assets = JSON.parse(assets_json);
let assetsArray = [];
let customMode = 'position';

let mode;
let zoom = 1;
//translation
let vitesse = 10; //px par sec
let tx;
let ty;
//centre de zoom
let cx = 100;
let cy = 100;


function main(){
  canvas = document.getElementById('canvas');
  canvas.height = window.outerHeight;
  canvas.width = window.outerWidth;
  ctx = canvas.getContext('2d');
  tx = canvas.width/2;
  ty = canvas.height/2;

  buildAssetsArray(assets);
  buildCustomPanel();
  buildLayerPanel();
  setInterval(loop, 16);
  fond(8);
  river();
  foretClick();
  cheminTerreClick();

  customs.push(new Sprite({
    'x':50,
    'y':50,
    'sx':50,
    'sy':50,
    'angle':0,
    'texture':'undefined'
  }));




  window.setTimeout(function(){
    document.getElementById('loading').style.opacity = '0';
  },0000);
  window.setTimeout(function(){
    document.getElementById('loading').style.display = 'none';
  },1000);
}

function loop(){
  riverFlow();
  move();

  drawFrame();
}
