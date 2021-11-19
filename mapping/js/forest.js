let treeSize = 200;

function foret(A,q){
  let cx = A.x;
  let cy = A.y;

  let radius = q;

  let nForest = forests.countFolders();
  foretCourante = forests.subFolder(nForest);

  for (var i = 0; i < radius**2/5000; i++) {
    let x = 0;
    let y = 0;

    x = 0.8*normal()*radius + cx;
    y = 0.8*normal()*radius + cy;

    let overlap = overlapChemin(x,y,20) + overlapRiver(x,y,50);


    if(!overlap){
      let n = Math.floor(Math.random()*2);
      foretCourante.push(new Sprite({
        'x':x,
        'y':y,
        'sx':treeSize,
        'sy':treeSize,
        'angle':2*Math.PI*Math.random(),
        'texture':'Tree'+n
      }));
    }
  }
}

function foretMove(){

}

function foretClick(){
  let quantity = document.getElementById('quantity').value;
  foret(lastClick,quantity);
}
