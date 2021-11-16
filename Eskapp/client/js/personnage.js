construire();

function construire(){
  let listes = document.getElementsByTagName('select');
  for (var liste of listes) {
    liste.innerHTML+="<option disabled selected>Veuillez choisir votre " + liste.name.slice(0,-1) + "</option>";
    for (var option of univers[liste.name]) {
      liste.innerHTML+="<option value=\"" + option + "\">" + capitalize(option) + "</option>";
    }
  }

  //Charger les données joueurs
  for (var elem in joueur.presentation) {
    if(document.getElementById(elem) != null){
    document.getElementById(elem).value = joueur.presentation[elem];
  }}
}
