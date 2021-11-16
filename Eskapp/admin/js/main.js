// victor.falaise 2021

var univers = request("univers.json"); //On chope l'univers
var objets = request("objets.json");  //Puis la bdd objet
var joueurs = {}; get(); //Puis tout les joueurs
var magasins = {};
var magasinD = []; //magasin courant
var loc;
//On boucle
let loop = true;
setInterval(function(){
  if(loop){
    getAsync();
    previewJoueurs();
    previewShopAsync();
  }
}, 5000);


window.onload = function(){
  loc = "window";
  construireEditeur("joueurs",0);
  construireObjet();
  construireWiki();
  construireShop();

  construireObjetAide()
  getAsync();
  previewJoueurs();
  previewShopAsync();
}


function showOnglet(id, t){
  for (var onglet of document.getElementsByClassName('onglet')) {
    onglet.style.display = "none";
  }

  document.getElementById(id).style.display = "inline";

  for (var onglet_title of document.getElementsByClassName('onglet_name')) {
    onglet_title.id = "";
  }
  t.id = "selected";
}




function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


//trier les objets par type d'apres l'univers.json
function trierParType(obj){
  let result = [];
  for (const type of univers.type) {
    for (const elem of obj) {
      if(elem.type == type){
        result.push(elem);
      }
    }
  }
  return result;
}


//Save tout les joueurs
function saveAll(){
  for (var joueur in joueurs) {
    var req = new XMLHttpRequest();
    req.open("POST", "../save.php", true);
    req.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log(this.responseText);
      }
    }

    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send("data=" + encodeURIComponent(JSON.stringify(joueurs[joueur])));
  }
}


//Save un joueur
function save(joueur){
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("data=" + encodeURIComponent(JSON.stringify(joueurs[joueur])));
}


//Save la bdd des objets
function saveBDD() {
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("bdd=" + encodeURIComponent(JSON.stringify(objets)));
}


//Save un shop
function saveShop(shop) {
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("updateShop=" + encodeURIComponent(JSON.stringify(shop)));
}



//Chope les joueurs en sync (->lag)
function get(){
  let list = request("save.php?all");
  for (var file of list) {
    joueurs[file.slice(0,-5)] = request("fiches/" + file);
  }
}


//Chope les joueurs en async
function getAsync(){
  let list = request("save.php?all");
  for (let file of list) {
    let req = new XMLHttpRequest();
    req.open('GET', "../fiches/" + file, true);
    req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    req.send(null);
    req.onreadystatechange = function(){
        if (req.readyState == XMLHttpRequest.DONE) {
            joueurs[file.slice(0,-5)] = JSON.parse(req.responseText);
        }
    };
  }
}


//choper un fichier
function request(file){
  var req = new XMLHttpRequest();
  req.open('GET', "../" + file, false);
  req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  req.send(null);

  if (req.status === 200) {
    return JSON.parse(req.responseText);
  }
}

//requete get sur une url
function requestGET(url){
  var req = new XMLHttpRequest();
  req.open('GET', "../" + url, false);
  req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  req.send(null);

  if (req.status === 200) {
    return req.responseText;
  }
}
