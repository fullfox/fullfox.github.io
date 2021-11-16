var magasin;
loadPiece()
loadMagasin();

function loop() {
  joueur = request(fichePath);
  loadPiece();
  loadMagasin(); //a refresh
}

setInterval(loop, 2000);


function loadMagasin(){
  let m = request("magasins/current.json");
  if(JSON.stringify(magasin) != JSON.stringify(m)){
    magasin = m;
    construire();
  }
}

//recalculer puis charger piece
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


//construire le magasin
function construire(){
  document.getElementById('magasin').innerHTML = "";

  for (const objet of trierParType(magasin)) {
    let degat;
    if(objet.degat == null){
      degat = "";
    } else {
      degat = objet.degat;
    }

    let bonus = "";
    if (objet.bonus != null && Object.keys(objet.bonus).length != 0) {
      bonus = "<p>";
      for (const c in objet.bonus) {
        bonus += capitalize(c) + ": " + (objet.bonus[c]<=0?"":"+") + objet.bonus[c] + "<br>";
      }
      bonus+="</p><hr>";
    }

    let or = parseInt(objet.cout/(100**2));
    let ar = parseInt(objet.cout/(100) % 100);
    let cu = parseInt(objet.cout%100);

    let element = `
    <div class=element>
      <span class="expand"><img src="img/expand.png"></span><span class=nom>(${objet.quantity}) ${objet.nom}</span><span class=degat><img src="img/${toAscii(objet.type)}.png"> ${degat}</span><span class=poids>${objet.poids}kg</span>
      <span class="lore">
        <hr>
        <p>"${objet.lore}"</p><hr>
        ${bonus}
        <p>
        Type: ${capitalize(objet.type)}<br>
        ${degat!="" ? "Dégat: " + objet.degat + "<br>" : "" }
        Poids: ${objet.poids}kg<br>
        </p>
      <hr>
      </span>
      <span class=buy><button onclick="buy(\`${objet.nom}\`,this);">Acheter</button></span><span class=cout>
        ${or ? or + ' <img class=coin src="img/po.png">' : ""}
        ${ar ? ar + ' <img class=coin src="img/pa.png">' : ""}
        ${cu ? cu + ' <img class=coin src="img/pu.png">' : ""}
      </span>
    </div>
    `;
    document.getElementById('magasin').innerHTML += element;

  }

  for (const element of document.getElementsByClassName('element')) {
    let expand = element.getElementsByClassName('expand')[0];
    expand.addEventListener('click', function (event) {
      if(element.classList.contains("expanded")){
        element.classList.remove("expanded");
      } else {
        element.classList.add("expanded");
      }
    });
  }
}


//achat
function buy(nom, bouton){
  loadMagasin(); //on rechope le magasin pour etre sur
  for (const elem of magasin) {
    if(elem.nom == nom){//Si on trouve l'item

      let s;
      var req = new XMLHttpRequest();
      req.open('GET', "../buy.php?item="+elem.nom+"&joueur="+joueur.presentation.joueur, false);
      req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
      req.send(null);

      if (req.status === 200) {
        s = req.responseText;
      }


      if(s == "success"){
        bouton.style.transition = "all 0s";
        bouton.style.background = "#5bbf5a";
        loop();
      } else if(s == "fail") {
        bouton.style.transition = "all 0s";
        bouton.style.background = "#e74c3c";
      }
      setTimeout(function(){ bouton.style.transition = "all 0.2s";bouton.style.background = "#b9b9b9"; }, 50);
      break;
    }
  }
}
