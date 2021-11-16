map.rocks = [];
let rockSize = 50;
function rock(A,radius){
  for (var i = 0; i < radius**2/10000; i++) {
    let cx = A.x;
    let cy = A.y;

    x = 0.8*normal()*radius + cx;
    y = 0.8*normal()*radius + cy;

    let overlap = overlapRiver(x,y) + overlapChemin(x,y);

    if(!overlap){
      let n = Math.floor(3*Math.random());
      map.rocks.push({
        'x':x,
        'y':y,
        'sx':rockSize,
        'sy':rockSize,
        'angle':2*Math.PI*Math.random(),
        'texture':'rock'+n
      });
    }
  }
}


map.grass = [];
let grassSize = 600;
function fond(n){
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      map.grass.push({
        'x':600*(i+0.5),
        'y':600*(j+0.5),
        'sx':grassSize,
        'sy':grassSize,
        'angle':0,'texture':'grass_seamless'
      });
    }
  }
}

function rockMove(){

}

function rockClick(){
  let quantity = document.getElementById('quantity').value;
  rock(lastClick,quantity);
}
