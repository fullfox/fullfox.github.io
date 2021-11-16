setCookie("joueur","",999);

function connect(){
  let j = document.getElementById('joueur').value;
  setCookie("joueur",j,999);
  
  window.location.href = "personnage.html";
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
