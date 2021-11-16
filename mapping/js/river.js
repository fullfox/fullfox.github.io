map.rivers = [];
let riverSize = 200;
let riverPas = 15;
//A vers B
function river(A,B){
  A ??= {
    'x':canvas.width/2*Math.random(),
    'y':-200
  };

  B ??= {
    'x':canvas.width/2*Math.random(),
    'y':canvas.height
  };

  let nRiver = map.rivers.length;
  map.rivers[nRiver] = [];

  let x = A.x;
  let y = A.y;

  let delta_angle = 0.1; //0 -> 1 ideal
  let norme = Infinity;
  let inertie = 0;

  let count = 0;
  while(norme>riverPas*2 && count<1000) {
    count++;
    let dx = B.x - x;
    let dy = B.y - y;

    norme = Math.sqrt(dx*dx + dy*dy);
    let s = (count==1) ? 0 : 1;
    let phi = arctan(dy, dx);
    let bruit = Math.random()*2*Math.PI;

    let moyCos = (0.2*Math.cos(phi)+0.52*Math.cos(inertie)*s+0.28*Math.cos(bruit));
    let moySin = (0.2*Math.sin(phi)+0.52*Math.sin(inertie)*s+0.28*Math.sin(bruit));
    x += riverPas*moyCos;
    y += riverPas*moySin;

    inertie = arctan(moySin,moyCos);

    map.rivers[nRiver].push({
      'x':x,
      'y':y,
      'sx':riverSize,
      'sy':riverSize,
      'angle':2*Math.PI*Math.random(),
      'texture':'river'
    });
  }
}

function overlapRiver(x,y,r){
  r ??= 0;
  for (let river of map.rivers) {
    for (let point of river) {
      let distance = Math.sqrt( (point.x - x)**2 + (point.y - y)**2 );
      if(distance<100+r){
        return true;
      }
    }
  }
  return false;
}


function riverFlow(){
  for (let river of map.rivers) {
    for (let id in river) {
      if(frame%8==0)
      river[river.length-id-1].angle = river[(2*river.length-id-2)%river.length].angle;
    }
  }
}


function riverMove(){

}

let riverNbClick = 0;
function riverClick(){
  riverNbClick++;
  if(riverNbClick%2) {
    c1 = lastClick;
    marker = lastClick;
  } else {
    let c2 = lastClick;
    river(c1,c2);
  }
}
