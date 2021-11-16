//OBJETS COTÉ ADMIN
// victor.falaise 2021


//Construit le form des objets
function construireObjet(){
  res = "";
  for (const elem of univers.type) {//Tout les types possibles
    res += `<option value="${elem}">${elem}</option>`;
  }
  document.getElementById('objet.type').innerHTML = res;

  res = "";
  for (const elem in joueurs) {//Tout les joueurs
    res += `<option value="${elem}">${elem}</option>`;
  }
  document.getElementById('objet.joueur').innerHTML = res;

  res = "";
  objets.sort(function(a, b) {
    //on trie la bdd objet par ordre alphabetique
    return a.nom.localeCompare(b.nom);
  });
  for (const elem of objets) {//Tout les objets en bdd
    res += `<option value="${elem.nom}">${elem.nom}</option>`;
  }
  document.getElementById('objet.liste').innerHTML = res;


  genererBonus();
}


//Charge un objet depuis la bdd
function loadObjetFromBDD(){
  let nom = document.getElementById('objet.liste').value;
  for (const elem of objets) {
    if(elem.nom == nom){
      document.getElementById('objet.nom').value = elem.nom;
      document.getElementById('objet.poids').value = elem.poids;
      document.getElementById('objet.type').value = elem.type;
      document.getElementById('objet.lore').value = elem.lore;
      if(elem.degat != null){
        document.getElementById('objet.degat').value = elem.degat;
      } else {
        document.getElementById('objet.degat').value = "";
      }
      genererBonus();
      if(elem.bonus != null){
      for (const c in elem.bonus) {
        document.getElementById('c.' + c).value = elem.bonus[c];
      }}
      break;
    }
  }
}


//Charge un objet depuis l'inventaire courant
function loadObjetFromInventaire(){
  let elem = eval(getFirstPart())[getLastPart()];
  document.getElementById('objet.nom').value = elem.nom;
  document.getElementById('objet.poids').value = elem.poids;
  document.getElementById('objet.type').value = elem.type;
  document.getElementById('objet.lore').value = elem.lore;
  if(elem.degat != null){
    document.getElementById('objet.degat').value = elem.degat;
  } else {
    document.getElementById('objet.degat').value = "";
  }
  genererBonus()
  if(elem.bonus != null){
  for (const c in elem.bonus) {
    document.getElementById('c.' + c).value = elem.bonus[c];
  }}

  document.getElementById('objet.joueur').value = getPart(3);
}


//Enregistre cet objet dans la bdd
function getObjet(){
  let bonus = {};
  for (const elem in univers.etats) {
    if(document.getElementById('c.' + elem).value != 0){
    bonus[elem] =  parseInt(document.getElementById('c.' + elem).value);
  }}
  for (const elem of univers.caracteristiques) {
    if(document.getElementById('c.' + elem).value != 0){
    bonus[elem] = parseInt(document.getElementById('c.' + elem).value);
  }}
  for (const elem in univers.competences) {
    if(document.getElementById('c.' + elem).value != 0){
    bonus[elem] =  parseInt(document.getElementById('c.' + elem).value);
  }}


  return {
    'nom':document.getElementById('objet.nom').value,
    'poids':document.getElementById('objet.poids').value,
    'type':document.getElementById('objet.type').value,
    'lore':document.getElementById('objet.lore').value,
    'degat':document.getElementById('objet.degat').value,
    'bonus': bonus
  };
}

//Enregistre un objet dans la bdd
function saveObjet(){
  let objet = getObjet();
  for (const obj in objets) {
    if(objet.nom == objets[obj].nom){
      delete objets[obj];
      objets = objets.filter(function(){return true;}); //Re index les elements
      break;
    }
  }
  objets.push(objet);

  res = "";
  for (const elem of objets) {//Tout les objets en bdd
    res += `<option value="${elem.nom}">${elem.nom}</option>`;
  }
  document.getElementById('objet.liste').innerHTML = res;
  document.getElementById('objet.liste').value = objet.nom;

  saveBDD();
}


//Supprime un objet de la bdd
function deleteObjetFromBDD(){
  let nom = document.getElementById('objet.liste').value;
  for (const elem of Object.keys(objets)) {
    if(objets[elem].nom == nom){
      delete objets[elem];
      break;
    }
  }
  objets = objets.filter(function(){return true;}); //re indexe les elements
  res = "";
  for (const elem of objets) {//Tout les objets en bdd
    res += `<option value="${elem.nom}">${elem.nom}</option>`;
  }
  document.getElementById('objet.liste').innerHTML = res;

  saveBDD();
}



//Afficher ou non les bonus dans le form objets
function displayBonus(e) {
  if(document.getElementById('objet.bonus').style.display == "block"){
    document.getElementById('objet.bonus').style.display = "none";
  } else {
    document.getElementById('objet.bonus').style.display = "block";
  }
}


//Constuire les bonus
function genererBonus(){
  res = "<table class=\"bonus_table\"><td>";
  for (const elem in univers.etats) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"c." + elem}" value="0"></input><br>`;
  }
  res+="</td><td>";
  for (const elem of univers.caracteristiques) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"c." + elem}" value="0"></input><br>`;
  }
  res+="</td><td>";
  for (const elem in univers.competences) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"c." + elem}" value="0"></input><br>`;
  }
  res += "</td></table>";
  document.getElementById('objet.bonus').innerHTML = res;
}


//Give un objet à un joueur
function sendObjet(){
  get();
  let joueur = document.getElementById('objet.joueur').value;
  joueurs[joueur].inventaire.push(getObjet());
  save(joueur);
}
