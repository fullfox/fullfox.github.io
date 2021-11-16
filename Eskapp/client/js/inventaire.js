let poidsTotal;
loadPiece();
construire();
loadPoids();
setInterval(loop, 1000);


function loop() {
  let i = joueur.inventaire.slice(0); //On fais une copie de l'inventaire
  joueur = request(fichePath); //On chope le joueur
  loadPiece();
  if(JSON.stringify(i) != JSON.stringify(joueur.inventaire)){ //Si l'inventaire a changé on reload
    construire();
  }
  loadPoids();
}


//recalculer puis charge piece
function loadPiece(){
  let or = parseInt(joueur.pieces/(100**2));
  let ar = parseInt(joueur.pieces/(100) % 100);
  let cu = parseInt(joueur.pieces%100);

  let piece = `Mes pieces:
  ${or + ' <img class=coin src="img/po.png">'}
  ${ar + ' <img class=coin src="img/pa.png">'}
  ${cu + ' <img class=coin src="img/pu.png">'}
  `;
  document.getElementById('account').innerHTML = piece;
}


//charge poids
function loadPoids() {
  let poidsMax = parseInt(10*Math.exp(0.03*(joueur.caracteristiques.force + getBonus("force") )));
  document.getElementById("poidsvaleur").innerHTML = poidsTotal.toFixed(2) + " / " + poidsMax;
  if (poidsTotal>poidsMax) {
    document.getElementById('totalpoids').style.color = "red";
  } else {
    document.getElementById('totalpoids').style.color = "black";
  }
}

//construit l'inventaire
function construire(){
  document.getElementById('inventaire').innerHTML = "";
  poidsTotal = 0;
  for (const objet of trierParType(joueur.inventaire)) {
    //On affiche que les trucs pas caché
    if(objet.type != "caché"){

    //calcul degat
    let degat;
    if(objet.degat == null || objet.degat == ""){
      degat = "";
    } else {
      degat = objet.degat;
    }

    //calcul bonus
    let bonus = "";
    if (objet.bonus != null && Object.keys(objet.bonus).length != 0) {
      bonus = "<p>";
      for (const c in objet.bonus) {
        bonus += capitalize(c) + ": " + (objet.bonus[c]<=0?"":"+") + objet.bonus[c] + "<br>";
      }
      bonus+="</p><hr>";
    }


    let element = `
    <div class=element>
      <span class="expand"><img src="img/expand.png"></span><span class=nom>${objet.nom}</span><span class=degat><img src="img/${toAscii(objet.type)}.png"> ${degat}</span><span class=poids>${parseFloat(objet.poids) | 0}kg</span>
      <span class="lore">
        <hr>
        <p>"${objet.lore}"</p><hr>
        ${bonus}
        <p>
        Type: ${capitalize(objet.type)}<br>
        ${degat!="" ? "Dégat: " + objet.degat + "<br>" : "" }
        Poids: ${parseFloat(objet.poids) | 0}kg<br></p>
      </span>
    </div>
    `;
    document.getElementById('inventaire').innerHTML += element;

  }

  poidsTotal += parseFloat(objet.poids) | 0; //on calcul le poids
}

  //pour chaque element on met l'event du clic
  for (const element of document.getElementsByClassName('element')) {
    element.addEventListener('click', function (event) {
      if(element.classList.contains("expanded")){
        element.classList.remove("expanded");
      } else {
        element.classList.add("expanded");
      }
    });
  }

}
