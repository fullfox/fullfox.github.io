map.chemins = [];
map.ponts = [];

let cheminSize=80;
let pontSize=60;

function chemin(n,A,B,enableBridge){
  enableBridge ??= true;

  //PARAM CHEMIN CONSTANTE
  let delta_angle = 0.6; //0 -> 1 ideal
  let pas = 30;
  let tailleChemin = 80;
  let taillePont = 60;

 //ALGO
  let nChemin = map.chemins.length;
  map.chemins[nChemin] = [];
  map.ponts[nChemin] = [];

  let x = A.x;
  let y = A.y;

  let count = 0;
  let distanceRestante = Infinity;
  let inertie = 0;


  while(distanceRestante>pas+10 && count<1000) {
    count++;
    let dx = B.x - x;
    let dy = B.y - y;
    distanceRestante = Math.sqrt(dx*dx + dy*dy);

    if(overlapRiver(x,y,-10)){
      //pont
      let phi = arctan(dy, dx);

      let moyCos = (0.1*Math.cos(phi)+0.9*Math.cos(inertie));
      let moySin = (0.1*Math.sin(phi)+0.9*Math.sin(inertie));

      x += 50*moyCos;
      y += 50*moySin;

      inertie = arctan(moySin,moyCos);

      map.ponts[nChemin].push(new Sprite({
        'x':x-Math.cos(inertie)*pontSize/2,
        'y':y-Math.sin(inertie)*pontSize/2,
        'sx':pontSize,
        'sy':pontSize,
        'angle':inertie,
        'texture':'pont'+n
      }));

    } else {
      //pas pont
      let s = (count==1) ? 0 : 1;
      let phi = arctan(dy, dx);
      let bruit = Math.random()*2*Math.PI;

      let moyCos = (0.2*Math.cos(phi)+0.6*Math.cos(inertie)*s+0.2*Math.cos(bruit));
      let moySin = (0.2*Math.sin(phi)+0.6*Math.sin(inertie)*s+0.2*Math.sin(bruit));

      x += pas*moyCos;
      y += pas*moySin;

      inertie = arctan(moySin,moyCos);

      map.chemins[nChemin].push(new Sprite({
        'x':x,
        'y':y,
        'sx':cheminSize,
        'sy':cheminSize,
        'angle': 2*Math.PI*Math.random(),
        'texture':'chemin'+n
      }));
    }
  }
}



function cheminPierre(A,B){
  A ??= {
    'x':-100,
    'y':canvas.height*Math.random()
  };

  B ??= {
    'x':canvas.width,
    'y':canvas.height*Math.random()
  };

  chemin(1,A,B);
}


function cheminTerre(A,B){
  A ??= {
    'x':-100,
    'y':canvas.height*Math.random()
  };

  B ??= {
    'x':canvas.width,
    'y':canvas.height*Math.random()
  };
  chemin(0,A,B);
}


function overlapChemin(x,y,r){
  r ??= 0;
  for (let chemin of map.chemins) {
    for (var point of chemin) {
      let distance = Math.sqrt( (point.x - x)**2 + (point.y - y)**2 );
      if(distance<40+r){
        return true;
      }
    }
  }
  return false;
}


function cheminTerreMove(){

}

function cheminPierreMove(){

}

let cheminTerreNbClick = 0;
function cheminTerreClick(){
  cheminTerreNbClick++;
  if(cheminTerreNbClick%2) {
    c1 = lastClick;
    marker = lastClick;
  } else {
    let c2 = lastClick;
    cheminTerre(c1,c2);
  }
}

let cheminPierreNbClick = 0;
function cheminPierreClick(){
  cheminPierreNbClick++;
  if(cheminPierreNbClick%2) {
    c1 = lastClick;
    marker = lastClick;
  } else {
    let c2 = lastClick;
    cheminPierre(c1,c2);
  }
}
