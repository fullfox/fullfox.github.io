//if get cookie

let cookie = getCookie("joueur");
var fichePath;
if(cookie != ""){
  fichePath = "fiches/" + cookie + ".json";
} else {
  window.location.href = "index.html";
  exit();
}

var univers = request("univers.json");
var joueur = request(fichePath);

if(joueur == null){
  joueur = request("template.json");
  joueur.presentation.joueur = cookie;
  save();//creation de la fiche
  alert("Fiche en cours de creation \"" + cookie + "\"");
  document.location.reload();
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function toAscii(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//save un joueur (sa fiche)
function save(){
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);

  req.onreadystatechange = function() { //Appelle une fonction au changement d'état.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  //Envoie les informations du header adaptées avec la requête
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("data=" + encodeURIComponent(JSON.stringify(joueur)));
}


function request(file){
  var req = new XMLHttpRequest();
  req.open('GET', "../" + file, false);
  req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  req.send(null);

  if (req.status === 200) {
    return JSON.parse(req.responseText);
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}



function getBonus(str){
  let b = 0;
  for (const elem of joueur.inventaire) {
    if(elem.bonus != null && elem.bonus[str] != null){
      b+=parseInt(elem.bonus[str]);
    }
  }
  return b;
}
