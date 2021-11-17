let custom = {'x':0,'y':0,'scale':1,'angle':0};

map.custom = [];
map.temp = [];


function customMove(){
  let magnet = document.getElementById('magnet').checked;
  switch (customMode) {
    case 'position':
      if(magnet){
        custom.x = 50*Math.floor((mouse.x-25)/50) + 50;
        custom.y = 50*Math.floor((mouse.y-25)/50) + 50;
      } else {
        custom.x = mouse.x;
        custom.y = mouse.y;
      }
      break;

    case 'rotation':
      let rotation = (arctan(custom.y - mouse.y, custom.x - mouse.x) + 3*Math.PI/2) % (2*Math.PI);
      if(magnet){
        custom.angle = Math.floor((rotation+1*Math.PI/8)/(Math.PI/4))*(Math.PI/4);
      } else {
        custom.angle = rotation;
      }
      break;

    case 'scale':
      let scale = Math.sqrt((custom.y - mouse.y)**2 + (custom.x - mouse.x)**2)/(100/1.41421356);
      if(magnet){
        custom.scale = Math.ceil(scale);
      } else {
        custom.scale = scale;
      }
      break;

  }

  let img = getTexture(custom.texture);
  map.temp[0] = new Sprite({
    'x':custom.x,
    'y':custom.y,
    'sx':img.naturalWidth*custom.scale/8,
    'sy':img.naturalHeight*custom.scale/8,
    'angle':custom.angle,
    'texture':custom.texture
  });
}

function customClick(){
  map.custom.push(map.temp[0]);
}





function buildPanel(){
  document.getElementById('assets').innerHTML = '<ul>' + generateFolderHTML(assets) + '</ul>';

  for (let elem of document.getElementsByClassName('expand')) {
    elem.addEventListener('click', (e) =>{
      if(!e.target.nextSibling.offsetParent){
        e.target.nextSibling.style.display = "initial";
      } else {
        e.target.nextSibling.style.display = "none";
      }
    });
  }
}

let id = 0;
function generateFolderHTML(obj,path=""){
  path+= obj.name + "/";
  let res = `<li><div class="folder"><span class="expand">${obj.name} <br></span><span class="folderContent">`;
  for (let fichier of obj.fichiers) {
    res+=`<div class="asset" id=${id++} onclick="selectAsset(this);"><img width="100px" src="img/${path + fichier}.png"> ${fichier}</div>`;
  }

  for (let dossier of obj.dossiers) {
    res+="<ul>" + generateFolderHTML(dossier,path) + "</ul>";
  }

  res+=`</span></div></li>`;
  return res;
}


function selectAsset(elem){
  mode='custom';
  for (let asset of document.getElementsByClassName('selected_asset')) {
    asset.classList.remove('selected_asset');
  }

  custom.texture = assetsArray[elem.id];
  elem.classList.add('selected_asset');
}



function buildAssetsArray(obj,path = ""){
  path+= obj.name + "/";
  for (let fichier of obj.fichiers) {
    assetsArray.push(path + fichier);
  }

  for (let dossier of obj.dossiers) {
    buildAssetsArray(dossier,path);
  }
}
