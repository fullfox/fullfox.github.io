var i = 0;
function menu(){
  i++;
  let menu = document.getElementById('menuDyn').style;
  let body = document.body.style;
  if(i%2){
    //Menu affiché
    menu.marginLeft = "0";
    body.overflow = "hidden";
  } else {
    //Menu masqué
    menu.marginLeft = "-60%";
    body.overflow = "visible";
  }



}
