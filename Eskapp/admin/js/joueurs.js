var couleur = {'vie':'#99e577','mana': '#7aaeff','mal': '#ff5757'}
function previewJoueurs() {
  let res = "";
  for (var n in joueurs) {
    let joueur = joueurs[n];
    let metaJoueur = getMetaJoueur(joueur);

    res+=`
    <div class="joueur">
        <div class="part">
          <span class="nom">"${joueur.presentation.prénom} ${joueur.presentation.nom}"
          <img width="14" src="img/${joueur.presentation.genre == "homme" ? "male" : joueur.presentation.genre == "femme" ? "female" : "agenre"}.png"></span>
            <br>(${joueur.presentation.joueur})
            <div class="title">${joueur.presentation.race == "" ? "<span title='comme bastien'>Pas de race</span>" : capitalize(joueur.presentation.race)}</div>
            <div class="title">${joueur.presentation.divinité == "" ? "Athée" : capitalize(joueur.presentation.divinité)}</div>
            <span class="dl">
              <a href="../fiches/${joueur.presentation.joueur}.json" download><input type="submit" value="Download"></a>
              <input type="submit" value="Delete"
              onclick="if(window.confirm('Voulez vous supprimer la fiche ${joueur.presentation.joueur} ?')){requestGET('save.php?delete=${joueur.presentation.joueur}');document.location.reload();}">
            </span>
        </div>
        <img class="bar" src="img/bar.png">
        <div class="part">
        <div onclick="changeEtat('vie',\`${joueur.presentation.joueur}\`);" style="background: linear-gradient(90deg, ${couleur["vie"]} ${100*(metaJoueur.vie/metaJoueur.vieMax)}%, white ${100*(metaJoueur.vie/metaJoueur.vieMax)}%);" class="etat"><p>Vie: ${metaJoueur.vie}/${metaJoueur.vieMax}</p></div>
        <div onclick="changeEtat('mana',\`${joueur.presentation.joueur}\`);" style="background: linear-gradient(90deg, ${couleur["mana"]} ${100*(metaJoueur.mana/metaJoueur.manaMax)}%, white ${100*(metaJoueur.mana/metaJoueur.manaMax)}%);" class="etat"><p>Mana: ${metaJoueur.mana}/${metaJoueur.manaMax}</p></div>
        <div onclick="changeEtat('mal',\`${joueur.presentation.joueur}\`);" style="background: linear-gradient(90deg, ${couleur["mal"]} ${100*(metaJoueur.mal/metaJoueur.malMax)}%, white ${100*(metaJoueur.mal/metaJoueur.malMax)}%);" class="etat"><p>Mal: ${metaJoueur.mal}/${metaJoueur.malMax}</p></div>
        </div>
        <img class="bar" src="img/bar.png">
        <div class="part">
          <div class="piece" onclick="changePieces(\`${joueur.presentation.joueur}\`);">
            Bourse:&nbsp;&nbsp;
            ${metaJoueur.or} <img class=coin src="img/po.png">
            ${metaJoueur.ar} <img class=coin src="img/pa.png">
            ${metaJoueur.cu} <img class=coin src="img/pu.png">
          </div>
          <div class="control"><input type="submit" value="Présentation" onclick="construirePanelPresentation(\`${n}\`)"><input type="submit" value="Inventaire" onclick=""></div>
          <div class="control"><input type="submit" value="Caracteristiques" onclick="construirePanelCaracteristiques(\`${n}\`)"><!--
          --><input type="submit" value="Compétences" onclick="construirePanelCompetences(\`${n}\`)"></div>
          <div class="classe">Classe: ${joueur.presentation.classe == "" ? "aucune" : "\"" + capitalize(joueur.presentation.classe) + "\""}</div>
      </div>
    </div>
    `;

  }


  document.getElementById('joueurs').innerHTML = res;
}


function getMetaJoueur(j){
  let metaJ = {};
  metaJ.vie = parseInt(j.etat.vie.valeur);
  metaJ.vieMax = parseInt(j.etat.vie.max) + parseInt(j.competences.vigueur) + getBonus(j,'vigueur') + getBonus(j,'vie');

  metaJ.mal = parseInt(j.etat.mal.valeur) + getBonus(j,'mal');
  metaJ.malMax = parseInt(j.etat.mal.max);

  metaJ.mana = parseInt(j.etat.mana.valeur);
  metaJ.manaMax = parseInt(j.etat.mana.max) + getBonus(j,'mana');

  metaJ.or = parseInt(j.pieces/(100**2));
  metaJ.ar = parseInt(j.pieces/(100) % 100);
  metaJ.cu = parseInt(j.pieces%100);

  return metaJ;
}


function getBonus(j,prop){
  let bonus = 0;
  for (const elem of j.inventaire) {
    if(elem.bonus != null && elem.bonus[prop] != null){
      bonus+=parseInt(elem.bonus[prop]);
    }
  }
  return bonus;
}


function quitterPanel(){
  document.getElementById('joueurs_panel').innerHTML = "";
  get();
  previewJoueurs();
}



function construirePanelCaracteristiques(j){
  res = `
  <div id="caracteristiques_panel" class="joueur_panel">
  <div class=title>${joueurs[j].presentation.prénom} ${joueurs[j].presentation.nom}</div><div class="inputs">`;

  carac = joueurs[j].caracteristiques;
  for (var n in carac) {
    let b = getBonus(joueurs[j],n);
    let v = carac[n];
    let s = v + b;
    res+=`<label><span class="name">${n}: </span><input type="number" value="${v}" onKeyPress="if(this.value.length==2) return false;" id="panel.caracteristiques.${n}">
     + (${b}b) = <img src="img/dice.png">${s}</label>`;
  }

  res += `</div><div class="control"><input type=submit value="Enregistrer" onclick="enregistrerPanelCaracteristiques(\`${j}\`)">
          <input type=submit value="Recharger" onclick="get();previewJoueurs();construirePanelCaracteristiques(\`${j}\`)">
          <input type=submit value="Quitter" onclick="quitterPanel()"></div>
          </div>`;
  document.getElementById('joueurs_panel').innerHTML = res;
}

function enregistrerPanelCaracteristiques(j){
  for (var carac of univers.caracteristiques) {
    joueurs[j].caracteristiques[carac] = parseInt(document.getElementById('panel.caracteristiques.' + carac).value);
  }
  save(j);
}


function construirePanelCompetences(j){
  res = `
  <div id="competences_panel" class="joueur_panel">
  <div class=title>${joueurs[j].presentation.prénom} ${joueurs[j].presentation.nom}</div><div class="inputs">`;

  comp = joueurs[j].competences;
  for (var n in comp) {
    let b = getBonus(joueurs[j],n);
    let v = comp[n];
    let carac = univers.competences[n];
    let s = v + b + joueurs[j].caracteristiques[carac] + getBonus(joueurs[j],carac);
    res+=`<label><span class="name">${n}:&lrm; </span><input type="number" value="${v}" onKeyPress="if(this.value.length==2) return false;" id="panel.competences.${n}">
     + (${b}b) = <img src="img/dice.png">${s}</label>`;
  }

  res += `</div><div class="control"><input type=submit value="Enregistrer" onclick="enregistrerPanelCompetences(\`${j}\`)">
          <input type=submit value="Recharger" onclick="get();previewJoueurs();construirePanelCompetences(\`${j}\`)">
          <input type=submit value="Quitter" onclick="quitterPanel()"></div>
          </div>`;
  document.getElementById('joueurs_panel').innerHTML = res;
}

function enregistrerPanelCompetences(j){
  for (var comp in univers.competences) {
    joueurs[j].competences[comp] = parseInt(document.getElementById('panel.competences.' + comp).value);
  }
  save(j);
}




function construirePanelPresentation(j){
  let p = joueurs[j].presentation;

  let genres = `<option value="">Pas de genre</option>`;
  for (var genre of univers.genres) {
    genres += `<option value="${genre}" ${p.genre == genre ? "selected" : ""}>${genre}</option>`;
  }

  let races = `<option value="">Pas de race</option>`;
  for (var race of univers.races) {
    races += `<option value="${race}" ${p.race == race ? "selected" : ""}>${race}</option>`;
  }

  let classes = `<option value="">Pas de classe</option>`;
  for (var classe in univers.classes) {
    classes += `<option value="${classe}" ${p.classe == classe ? "selected" : ""}>${classe}</option>`;
  }

  let divinités = `<option value="">Pas de divinité</option>`;
  for (var divinité of univers.divinités) {
    divinités += `<option value="${divinité}" ${p.divinité == divinité ? "selected" : ""}>${divinité}</option>`;
  }

  res=`<div id="presentation_panel" class="joueur_panel">
        <label>nom:<input type="text" id="nom" value="${p.nom}"></label>
        <label>prénom:<input type="text" id="prénom" value="${p.prénom}"></label>
        <label>genre:<select id="genre">${genres}</select></label>
        <label>age:<input type="number" id="age" value="${p.age}"></label>
        <label>race:<select id="race">${races}</select></label>
        <label>classe:<select id="classe">${classes}</select></label>
        <label>divinité:<select id="divinité">${divinités}</select></label>
        <label>taille:<input type="number" id="taille" value="${p.taille}"></label>
        <label>poids:<input type="number" id="poids" value="${p.poids}"></label>
        <div class="control"><input type=submit value="Enregistrer" onclick="enregistrerPanelPresentation(\`${j}\`)">
        <input type=submit value="Recharger" onclick="get();previewJoueurs();construirePanelPresentation(\`${j}\`)">
        <input type=submit value="Quitter" onclick="quitterPanel()"></div>
      </div>`;

  document.getElementById('joueurs_panel').innerHTML = res;
}

function enregistrerPanelPresentation(j){
  let p = joueurs[j].presentation;
  p.nom = document.getElementById("nom").value;
  p.prénom = document.getElementById("prénom").value;
  p.genre = document.getElementById("genre").value;
  p.age = document.getElementById("age").value;
  p.race = document.getElementById("race").value;
  p.classe = document.getElementById("classe").value;
  p.divinité = document.getElementById("divinité").value;
  p.taille = document.getElementById("taille").value;
  p.poids = document.getElementById("poids").value;
  save(j);
  previewJoueurs();
}



function construirePanelInventaire(j){

}














function changeEtat(etat,j){
  let fullname = joueurs[j].presentation.prénom + " " + joueurs[j].presentation.prénom;
  let val = 0;

  val = prompt(capitalize(etat) + " de " + fullname + " : ? / " + joueurs[j].etat[etat].max, joueurs[j].etat[etat].valeur);
  if(val != null){joueurs[j].etat[etat].valeur = parseInt(val)};

  save(j);
  previewJoueurs();
}


function changePieces(j){
  let fullname = joueurs[j].presentation.prénom + " " + joueurs[j].presentation.prénom;
  let val = 0;

  val = prompt("Bourse de " + fullname + " :" + joueurs[j].pieces, joueurs[j].pieces);
  if(val != null){joueurs[j].pieces = parseInt(val)};

  save(j);
  previewJoueurs();
}
