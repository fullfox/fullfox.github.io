//Param
let nodeNumber = 80;
let maliciousNumber = 20;
let viewSize = 5;
let resetCooldown = 10;
let cyclesPerSecond = 5;
let resetNumber = 1;

let l;
let infectedNode = []; //liste des id des malicieux pour les plot en violet


start();




function start(){

  stop();

  //On initie le canvas
  Graph.init();

  //On cree les noeuds et les pairs
  for (var i = 0; i < nodeNumber-maliciousNumber; i++) {
    new Peer();
    Graph.createNode();
  }
  for (var i = 0; i < maliciousNumber; i++) {
    new Malicous();
    Graph.createNode();
  }

  //On les inits
  for (var i = 0; i < nodeNumber; i++) {
    Peer.peers[i].init();
  }

  //On boucle
  l = setInterval(loop, 1000/cyclesPerSecond);

  function loop(){
    let t1 = (new Date).getMilliseconds();
    Peer.tickAll();
    Graph.edges = Peer.peers[10].getEdges();
    Graph.draw();
    //console.log((new Date).getMilliseconds() - t1);
  }
}

function stop(){
  clearInterval(l);
  Peer.peers = [];
  Malicous.maliciousPeers = [];
  infectedNode = [];
  Peer.i = 0;

}

function updateParam(){
  nodeNumber = parseInt(document.getElementById('nodeNumber').value);
  maliciousNumber = parseInt(document.getElementById('maliciousNumber').value);
  viewSize = parseInt(document.getElementById('viewSize').value);
  resetCooldown = parseInt(document.getElementById('resetCooldown').value);
  cyclesPerSecond = parseInt(document.getElementById('cyclesPerSecond').value);
  resetNumber = parseInt(document.getElementById('resetNumber').value);
}
