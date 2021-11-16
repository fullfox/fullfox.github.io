//OBJETS COTÉ ADMIN
// victor.falaise 2021


//Construit le form des objets et la listes des magasins
function construireObjetAide(){
  res = "";
  for (const elem of univers.type) {//Tout les types possibles
    res += `<option value="${elem}">${elem}</option>`;
  }
  document.getElementById('aide.objet.type').innerHTML = res;


  res = `<option disabled selected value="" >rien</option>`;
  for (const elem in magasins) {//Tout les types possibles
    res += `<option value="${elem}">${elem}</option>`;
  }
  document.getElementById('aide.magasins.liste').innerHTML = res;



  res = "";
  objets.sort(function(a, b) {
    //on trie la bdd objet par ordre alphabetique
    return a.nom.localeCompare(b.nom);
  });
  for (const elem of objets) {//Tout les objets en bdd
    res += `<option value=\`${elem.nom}\`>${elem.nom}</option>`;
  }
  document.getElementById('aide.objet.liste').innerHTML = res;


  genererBonusAide();
}


currentShop = "";
function loadShop(){ //genere la preview d'un magasin + on rajoute le nom apres le bouton ajouter
  currentShop = document.getElementById("aide.magasins.liste").value;
  if(currentShop){
    document.getElementById("currentShop").innerHTML = capitalize(currentShop);
    let res = "";
    for (const item of magasins[currentShop]) {
      let degat;

      if(item.degat){degat = "(" + item.degat + ")";} else {degat = "";} //on definit degat si ca existe pas

      //calcul des pieces
      let or = parseInt(item.cout/(100**2));
      let ar = parseInt(item.cout/(100) % 100);
      let cu = parseInt(item.cout%100);

      res+= `
      <span class=item>
      (w=${item.weight}) - ${capitalize(item.nom)} (${item.type} ${item.poids}kg)
      ${degat}
      (<a class="lore" onclick="alert(this.nextElementSibling.innerHTML);">lore</a>)<span style="display:none;">${item.lore}</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      ${or ? or + ' <img class=coin src="img/po.png">' : ""}
      ${ar ? ar + ' <img class=coin src="img/pa.png">' : ""}
      ${cu ? cu + ' <img class=coin src="img/pu.png">' : ""}
      <button onclick="deleteItem(\`${item.nom}\`);">del</button>
      </span><br>`;
    }

    document.getElementById("item_vente").innerHTML = res;
} else {
  document.getElementById("currentShop").innerHTML = "rien";
}}

function deleteItem(nom){
  for (const id of Object.keys(magasins[currentShop])) {
    if(magasins[currentShop][id].nom == nom){
      delete magasins[currentShop][id];
      break;
    }
  }
  magasins[currentShop] = magasins[currentShop].filter(function(){return true;}); //re indexe les elements

  let shop = {
              "shopName": currentShop,
              "content": magasins[currentShop]
             };
  saveShop(shop);
  loadShop();
}

//Charge un objet depuis la bdd
function loadObjetFromBDDAide(){
  let nom = document.getElementById('aide.objet.liste').value;
  for (const elem of objets) {
    if(elem.nom == nom){
      document.getElementById('aide.objet.nom').value = elem.nom;
      document.getElementById('aide.objet.poids').value = elem.poids;
      document.getElementById('aide.objet.type').value = elem.type;
      document.getElementById('aide.objet.lore').value = elem.lore;
      if(elem.degat != null){
        document.getElementById('aide.objet.degat').value = elem.degat;
      } else {
        document.getElementById('aide.objet.degat').value = "";
      }
      genererBonusAide();
      if(elem.bonus != null){
      for (const c in elem.bonus) {
        document.getElementById('aide.c.' + c).value = elem.bonus[c];
      }}
      break;
    }
  }
}


//Enregistre cet objet dans la bdd
function getObjetAide(){
  let bonus = {};
  for (const elem in univers.etats) {
    if(document.getElementById('aide.c.' + elem).value != 0){
    bonus[elem] =  parseInt(document.getElementById('aide.c.' + elem).value);
  }}
  for (const elem of univers.caracteristiques) {
    if(document.getElementById('aide.c.' + elem).value != 0){
    bonus[elem] = parseInt(document.getElementById('aide.c.' + elem).value);
  }}
  for (const elem in univers.competences) {
    if(document.getElementById('aide.c.' + elem).value != 0){
    bonus[elem] =  parseInt(document.getElementById('aide.c.' + elem).value);
  }}


  return {
    'nom':document.getElementById('aide.objet.nom').value,
    'poids':document.getElementById('aide.objet.poids').value,
    'type':document.getElementById('aide.objet.type').value,
    'lore':document.getElementById('aide.objet.lore').value,
    'degat':document.getElementById('aide.objet.degat').value,
    'cout':parseInt(document.getElementById('aide.objet.cout').value),
    'weight':parseInt(document.getElementById('aide.objet.weight').value),
    'bonus': bonus
  };
}



//Afficher ou non les bonus dans le form objets
function displayBonusAide(e) {
  if(document.getElementById('aide.objet.bonus').style.display == "block"){
    document.getElementById('aide.objet.bonus').style.display = "none";
  } else {
    document.getElementById('aide.objet.bonus').style.display = "block";
  }
}


//Constuire les bonus
function genererBonusAide(){
  res = "<table class=\"bonus_table\"><td>";
  for (const elem in univers.etats) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"aide.c." + elem}" value="0"></input><br>`;
  }
  res+="</td><td>";
  for (const elem of univers.caracteristiques) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"aide.c." + elem}" value="0"></input><br>`;
  }
  res+="</td><td>";
  for (const elem in univers.competences) {
    res += `${capitalize(elem)}: <input type="number" class="shortInput" id="${"aide.c." + elem}" value="0"></input><br>`;
  }
  res += "</td></table>";
  document.getElementById('aide.objet.bonus').innerHTML = res;
}


//Enregistre un objet dans un magasin
function sendObjetAide(){
  if(currentShop){
  magasins[currentShop].push(getObjetAide());
  let shop = {
              "shopName": currentShop,
              "content": magasins[currentShop]
             };
  saveShop(shop);
  loadShop();
}}

function addShop(){
  let nomMagasin = prompt('Nom du nouveau magasin ?','');
  if(nomMagasin != null){
    magasins[nomMagasin] = [];
    construireObjetAide(); //recharge le select des magasins
    document.getElementById("aide.magasins.liste").value = nomMagasin;
    let shop = {
                "shopName": nomMagasin,
                "content": magasins[nomMagasin]
               };
    saveShop(shop); //on enregistre coté serveur
    loadShop(); //on clear la preview
    construireShop(); //et on recharge les shop sur l'onglet magasins
  }
}


function delShop(){
  if(currentShop && confirm(`Voulez vous vraiment supprimer le magasin "${currentShop}" ?`)){
    requestGET("save.php/?deleteShop=" + currentShop);
    delete magasins[currentShop];
    construireObjetAide();
    loadShop(); //on clear la preview
    construireShop(); //on recharge le select de l'onglet magasin
  }
}
