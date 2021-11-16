var etangs = [];
function etang(){
  let taille = 40;

  let cx = canvas.width*Math.random();
  let cy = canvas.height*Math.random();

  etangs.push({'x':cx+100,'y':cy+100,'r':taille*10 + 100});
  let eaux = [];
  for (var i = 0; i < taille**1.5; i++) {
    let phi = 2*Math.PI*Math.random();
    let pas = taille*10*Math.random();
    let x = cx + pas*Math.cos(phi);
    let y = cy + pas*Math.sin(phi);
    eaux.push({'x':x,'y':y});
  }

  let plage = 20;

  for (var eau of eaux) {
    drawImage('littoral',eau.x-plage,eau.y-plage,200+2*plage,200+2*plage,360*Math.random());
  }

  for (var eau of eaux) {
    drawImage('eau',eau.x,eau.y,200,200,360*Math.random());
  }

}
