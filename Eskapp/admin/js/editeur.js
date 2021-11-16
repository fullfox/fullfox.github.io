//EDITEUR COTÉ ADMIN
// victor.falaise 2021

//Reconstruire les joueurs
function refresh(){
  clear(1);
  loc = "window";
  construireEditeur("joueurs",0);
}

//Refresh une valeur
function refreshValue(){
  document.getElementById('value').value = eval(loc);
}

//Construit les select de l'édition de fiche
//obj l'objet à constuire et lvl la profondeur
function construireEditeur(obj,level){
  loc = loc.split('[').slice(0, level+1).join("[");
  loc += "[\"" + obj + "\"]";

  clear(level);

  if(typeof eval(loc) == "object"){
      res = `<select id="${level}" multiple="multiple" onchange="load(this)">`;
    for (const elem of Object.keys(eval(loc))) {


      if(getLastPart() == "inventaire" || getLastPart() == "wiki"){
        let nom = eval(loc)[elem].nom;
        res+=`<option value="${elem}">${nom}</option>`;
      } else {
      res+=`<option value="${elem}">${elem}</option>`;
      }
    }
      res+='</select>';
      if(getPart(4) == "inventaire" && getLen() == 5){
        document.getElementById('input').innerHTML = `
        <input class="longButton" onclick="deleteObjetFromInventaire()" type="submit" value="Supprimer objet"></input>
        <input class="longButton" onclick="loadObjetFromInventaire()" type="submit" value="Charger l'objet"></input>
        `;
      }

      childNodes = htmlToElements(res);
      for (var i = 0; i < childNodes.length; i++) {
        document.getElementById('panel').appendChild(childNodes[i])
      }

  } else {
    if(("" + eval(loc)).length < 30){
      res=`<input class="input" id="value" type="text" onclick="clic()" value="${eval(loc)}"></input>
      <input id="submit" class="input" type="submit" value="Save" onclick="saveValeur(this)"></input>
      <input id="submit" class="input" type="submit" value="Refresh" onclick="refreshValue();"></input>`;
    } else {
      res=`<textarea id="value" onclick="clic()">${eval(loc)}</textarea>
      <input id="submit" class="input" type="submit" value="Save" onclick="saveValeur(this)"></input>
      <input id="submit" class="input" type="submit" value="Refresh" onclick="refreshValue();"></input>`;
    }
    document.getElementById('input').innerHTML = res;
  }
}


//Au clic sur un element d'un select dans l'édition de fiche
//Lance la construction du dit objet
function load(select){
  construireEditeur(select.value, parseInt(select.id) + 1);
}

//Efface les selects sous la profondeur courante et reset le span input
function clear(lvl){
  let max = getLen();
  for (var i = lvl; i < max; i++) {
    if(document.getElementById(i) != null) {
    document.getElementById(i).remove();
  }}

  if(document.getElementById('input') != null){
    document.getElementById('input').innerHTML = "";
  }
}


//Enregistre l'édition d'une valeur et la stocke dans l'objet js
function saveValeur(e){
  let l = loc.split("[").length;
  let path = loc.split('[').slice(0, l-1).join("[");
  let prop = getPart(l);
  let valeur = document.getElementById('value').value;
  get();
  if(parseInt(valeur) == valeur){
    valeur = parseInt(valeur);
  }
  eval(path)[prop] = valeur;
  save(getPart(3));
  e.value = "Saved";
}

//Repasse le bouton en "save" sur edition de la valeur
function clic(){
  document.getElementById('submit').value = "Save";
}



//Supprime l'objet courant
function deleteObjetFromInventaire(){
  delete joueurs[getPart(3)].inventaire[getLastPart()];
  joueurs[getPart(3)].inventaire = joueurs[getPart(3)].inventaire.filter(function(val){return val}); //degage les valeurs null
  load(document.getElementById(1));
  save(getPart(3));
}



//Donne l'objet à la profondeur n du chemin courant
function getPart(n){
  if(n<=loc.split("[").length){
  return loc.split("[")[n-1].split("\"")[1];
} else {
  return 0;
}
}

//Donne la longueur du chemin courant
function getLen(){
  return loc.split("[").length;
}

//Donne le dernier element du chemin courant
function getLastPart(){
  return getPart(getLen());
}


//Donne le chemin courant sans le dernier element
function getFirstPart(){
  let path = "window";
  for (var i = 2; i < getLen(); i++) {
    path += "[\"" + getPart(i) + "\"]";
  }
  return path;
}

//Permet de construire des element html à partir du code html
function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}


//Construit wiki
function construireWiki(){
  res = "";
  for (const elem in univers.wiki) {//Tout les joueurs
    res += `<option value="${elem}">${univers.wiki[elem].nom}</option>`;
  }
  document.getElementById('wiki.liste').innerHTML = res;

  res = "";
  for (const elem in joueurs) {//Tout les joueurs
    res += `<option value="${elem}">${elem}</option>`;
  }
  res = "<option value=all>Tous</option>" + res;
  document.getElementById('wiki.joueur').innerHTML = res;

  loadWiki();
}


function loadWiki(){
  res = "<table><tr>";
  for (const joueur in joueurs) {//Tout les joueurs
    res += `<td><b>${joueur}</b> :<i>`;
    for (let wiki of joueurs[joueur].wiki) {
      res+= `<br><button onclick="removeWiki(\`${joueur}\`,\`${wiki.nom}\`);">✖</button> <a href="${wiki.lien}" target="_blank"><button>open</button></a> - ` + wiki.nom;
    }
    res+="</i></td>";
  }
  res += "<tr></table>";
  document.getElementById('joueurs_wiki').innerHTML = res;
}



//Donne un wiki a un joueur
function giveWiki(){
  let wikid = document.getElementById('wiki.liste').value;
  let joueurListe = document.getElementById('wiki.joueur').value;
  if (joueurListe != "all") {
    joueurs[joueurListe].wiki.push(univers.wiki[wikid]);
    save(joueurListe);
  } else {
    for (var joueur in joueurs) {
      joueurs[joueur].wiki.push(univers.wiki[wikid]);
    }
    saveAll();
  }
  loadWiki();
}


function removeWiki(joueur,wikiToDelete){
  for (let id in joueurs[joueur].wiki) {
    wiki = joueurs[joueur].wiki[id];
    if(wiki.nom == wikiToDelete){
      delete joueurs[joueur].wiki[id];
      break;
    }
  }
  joueurs[joueur].wiki = joueurs[joueur].wiki.filter(function(){return true;}); //re index

  save(joueur);
  loadWiki();
}
