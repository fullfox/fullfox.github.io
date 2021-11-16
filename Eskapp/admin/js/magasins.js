//MAGASIN COTÉ ADMIN
// victor.falaise 2021

//construit la liste des shops
function construireShop() {
  let res = "";
  let magasinListe = request("save.php?allShop");
  for (const magasinFile of magasinListe) {
    let magasin = request("magasins/" + magasinFile);
    let nom = magasinFile.slice(0,-5);
    magasins[nom] = magasin;
    res+=`<option value="${nom}">${capitalize(nom)}</option>`;
  }
  document.getElementById('magasin').innerHTML = res;
}

//Genere un shop
function generateShop(){
  magasinD = [];
  let nb = document.getElementById('magasin.nb').value; //le nb d'item
  let magasinP = magasins[document.getElementById('magasin').value].slice(0); //On fait une copie de magasin proba


  //La somme des poids proba
  let totalWeight = 0;
  for (const id in magasinP) {
    totalWeight+= (magasinP[id].weight > 0 ? magasinP[id].weight : 0);
  }


  //nb éléments ds le magasin
  for (var i = 0; i < nb; i++) {
    //Algo de choix par poids
    let currentWeight = 0;
    let r = Math.random();
    for (var item of magasinP) {
      if(item.weight>0){
      if(currentWeight < r && currentWeight+(item.weight/totalWeight) > r){
        //oui ou non

        if(magasinD.includes(item)){//Si deja l'item dans le shop
          let i = magasinD.indexOf(item); //on recup ou est l'item
          magasinD[i].quantity++; //on augmente la quantité de 1
        } else { //si nouvel item
          item.rarity = parseInt(100*(item.weight/totalWeight));
          item.quantity = 1; //quantité = 1
          magasinD.push(item); //On rajoute au magasin deterministe
        }
      }
      currentWeight += item.weight/totalWeight;
    }}
  }

  //item deterministe

  for (var item of magasinP) {
    if(item.weight<0){
      item.rarity = 100;
      item.quantity = -item.weight;
      magasinD.push(item);
    }
  }

  //On delink les elements entre magasinD et magasinP
  //Et on delete la propriété weight car inutile en deterministe
  for (var i in magasinD) {
    magasinD[i] = { ...magasinD[i] };
    delete magasinD[i].weight;
  }

  //On trie par prix decroissant
  magasinD.sort(function(a, b) {
    if(a.cout > b.cout){
      return 1;
    } else {
      return -1;
    }
   });

  document.getElementById("magasin.preview").innerHTML = genererPreview(magasinD);
}


//Retourne le code dla preview
function genererPreview(obj){
  //On construit la preview
  let res = "";
  for (const item of obj) {
    let degat;

    if(item.degat){degat = "(" + item.degat + ")";} else {degat = "";} //on definit degat si ca existe pas

    //calcul des pieces
    let or = parseInt(item.cout/(100**2));
    let ar = parseInt(item.cout/(100) % 100);
    let cu = parseInt(item.cout%100);


    res+= `
    <span class=item>
    ${item.quantity}x - ${capitalize(item.nom)} (${item.type} ${item.poids}kg)
    ${degat}
    (p=${item.rarity}%)
    (<a class="lore" onclick="alert(this.nextElementSibling.innerHTML);">lore</a>)<span style="display:none;">${item.lore}</span>
    &nbsp;&nbsp;&nbsp;&nbsp;
    ${or ? or + ' <img class=coin src="img/po.png">' : ""}
    ${ar ? ar + ' <img class=coin src="img/pa.png">' : ""}
    ${cu ? cu + ' <img class=coin src="img/pu.png">' : ""}

    </span><br>`;
  }

  if(res==""){res = "(vide)<br>";}
  return res;
}





function saveCurrentShop(){
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("shop=" + encodeURIComponent(JSON.stringify(magasinD)));
  previewShopAsync();
}


function stopShop(){
  var req = new XMLHttpRequest();
  req.open("POST", "../save.php", true);
  req.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    }
  }

  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.send("shop=" + encodeURIComponent("[]"));
  previewShopAsync();
}



function previewShopAsync(){
  let req = new XMLHttpRequest();
  req.open('GET', "../magasins/current.json", true);
  req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  req.send(null);
  req.onreadystatechange = function(){
      if (req.readyState == XMLHttpRequest.DONE) {
        let current = JSON.parse(req.responseText);
        document.getElementById('magasinCourant.preview').innerHTML = genererPreview(current);
      }
  };

}
