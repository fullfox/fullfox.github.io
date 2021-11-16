var couleur = {'vie':'#5bbf5a4a','mana': '#5a95bf4a','mal': '#ffaaaa4a'}

function loop(){
  joueur = request(fichePath);
  calculerAll(); //a refresh
}

construire();
loop();
setInterval(loop, 2000);

for (const incrementer of document.getElementsByClassName('incrementer')) {

  //INCREMENTATION (link l'event)
  incrementer.nextElementSibling.addEventListener('click', function (event) {
      let name = this.previousElementSibling.name.split(".");
      if(name[0] == "etat"){

        //Calcul des bonus des états
        let bonusVal = 0;
        let bonusMax = 0;
        if (name[1] == "vie") {
          bonusMax = joueur.competences.vigueur + getBonus("vigueur") + getBonus(name[1]);
        } else if (name[1] == "mal") {
          bonusVal = getBonus(name[1]);
        } else if (name[1] == "mana") {
          bonusMax = getBonus(name[1])
           + joueur.competences["connaissance de la magie"] + getBonus("connaissance de la magie")
           + joueur.caracteristiques[univers.competences["connaissance de la magie"]] + getBonus(univers.competences["connaissance de la magie"]);
        }

        if ((joueur[name[0]][name[1]].valeur + bonusVal)<(joueur[name[0]][name[1]].max + bonusMax)) {
            joueur[name[0]][name[1]].valeur++;
        }
      } else if (name[0] == "caracteristiques" || name[0] == "competences") {
        if (joueur[name[0]][name[1]]<100) {
          joueur[name[0]][name[1]]++;
        }
      }
      calculerAll();
      save();
  });

  //DECREMENTATION (link l'event)
  incrementer.previousElementSibling.addEventListener('click', function (event) {
      let name = this.nextElementSibling.name.split(".");
      if(name[0] == "etat"){
        if (joueur[name[0]][name[1]].valeur>0) {
          joueur[name[0]][name[1]].valeur--;
        }
      } else if (name[0] == "caracteristiques" || name[0] == "competences") {
        if (joueur[name[0]][name[1]]>0) {
          joueur[name[0]][name[1]]--;
        }
      }
      calculerAll();
      save();
  });
}

//Calculer un element precis
function calculer(incrementer){
  let name = incrementer.name.split(".");
  if(name[0] == "etat"){
      //Etat
      //Calcul des bonus des états
      let bonusVal = 0;
      let bonusMax = 0;

      if (name[1] == "vie") {
        bonusMax = joueur.competences.vigueur + getBonus("vigueur") + getBonus(name[1]);
      } else if (name[1] == "mal") {
        bonusVal = getBonus(name[1]);
      } else if (name[1] == "mana") {
        bonusMax = getBonus(name[1]);
      }

      incrementer.value = (joueur[name[0]][name[1]].valeur + bonusVal) + " / " + (joueur[name[0]][name[1]].max + bonusMax);
      let pourcentage = 100*(joueur[name[0]][name[1]].valeur + bonusVal)/(joueur[name[0]][name[1]].max + bonusMax);
      incrementer.style = "background: linear-gradient(90deg, "+ couleur[name[1]] + " " + pourcentage + "%, white " + pourcentage + "%);";

  } else if (name[0] == "caracteristiques") {
      //Caracteristiques
            let base = joueur[name[0]][name[1]];
      let bonus = getBonus(name[1]);
      let somme = base + bonus;
      somme = Math.max(0, somme);
      incrementer.value = " (" + base + " + " + bonus + "b ) = " + somme;
  } else if (name[0] == "competences") {
      //Competences
      let type = univers.competences[name[1]];
      let base = joueur[name[0]][name[1]];
      let bonus = getBonus(name[1]);
      let somme = base + bonus + joueur.caracteristiques[type] + getBonus(type);
      somme = Math.max(0, somme);
      incrementer.value = " (" + base + " + " + bonus + "b ) = " + (base + bonus) + "  (" + somme + ")";
  }
}

//Calculer tt les elements
function calculerAll(){
  for (const incrementer of document.getElementsByClassName('incrementer')) {
    calculer(incrementer);
  }
  let somme = 0;
  let sommeBonus = 0;
  for (var truc in joueur.caracteristiques) {
    somme += joueur.caracteristiques[truc];
    sommeBonus += getBonus(truc);
  }
  document.getElementById('total').innerHTML = somme + " + " + sommeBonus + "b";

  calculClasse();
}


function masquerCompetences(elem){
  elem.style.display = "none";
  elem.nextElementSibling.style.display = "inline";
  for (const incrementer of document.getElementsByClassName('incrementer')) {
    if(incrementer.name.split(".")[0] == "competences"){
      let name = incrementer.name.split(".");
      let base = joueur[name[0]][name[1]];
      let bonus = getBonus(name[1]);
      if((base + bonus) == 0){
        incrementer.parentElement.style.display = "none";
      }}
  }
}

function afficherCompetences(elem){
  elem.style.display = "none";
  elem.previousElementSibling.style.display = "inline";
  for (const incrementer of document.getElementsByClassName('incrementer')) {
    if(incrementer.name.split(".")[0] == "competences"){
      incrementer.parentElement.style.display = "block";
    }
  }
}

//Generation des <options> pour toutes les caracs et comps
function construire(){
  let caracteristiquesSpan = document.getElementById('caracteristiques');
  for (const caracteristique in joueur.caracteristiques) {
    caracteristiquesSpan.innerHTML+='<label for="">' + caracteristique + '<br><input type=button value="-"><input type="text" class="incrementer" name="caracteristiques.' + caracteristique + '" disabled><input type=button value="+"></label>';

  }

  let competences = document.getElementById('competences');
  for (const competence in joueur.competences) {
    competences.innerHTML+='<label for="">' + competence + ' (' + univers.competences[competence] + ')<br><input type=button value="-"><input type="text" class="incrementer" name="competences.' + competence + '" disabled><input type=button value="+"></label>';
  }


}

//Calcul les classes disponibles
function calculClasse(){
    let select = document.getElementById('classes');
    if(select.value != joueur.presentation.classe){
      select.value = joueur.presentation.classe;
    }

    for (var classe in univers.classes) {
      let requirements = univers.classes[classe];
      let condition = true;
      for (var requirement in requirements) {
        //Pour chaque "minimum" de classe on regarde si il est atteint
        let total = 0;
        if(joueur.caracteristiques.hasOwnProperty(requirement)){
          //C'est une caracteristique
          total = joueur.caracteristiques[requirement] + getBonus(requirement);

        } else if(joueur.competences.hasOwnProperty(requirement)){
          //C'est une competence
          let type = univers.competences[requirement];
          total = joueur.competences[requirement] + getBonus(requirement);

        }

        if (total < requirements[requirement]){
          condition = false;
        }
      }

      let chaine = "<option value=\"" + classe + "\">" + capitalize(classe) + "</option>";
      if (condition && select.innerHTML.indexOf(chaine) == -1) {
        //rajouter si inexistant
        select.innerHTML += chaine;
      } else if(!condition) {
        //enlever si existant
        for (var option of select.children) {
          if (option.value == classe){option.remove();}
        }
      }
    }

    lockClasse(); //On lock si non nul
}



//lock la classe
function lockClasse(){
  let input = document.getElementById("classes");
  if(input.value != ""){
      input.setAttribute("disabled","");
  } else {
      input.removeAttribute("disabled");
  }
}
