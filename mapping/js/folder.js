const FolderProxy = {
  get(target, prop, proxy) {
    var func = target[prop];

    if (typeof func != "function"){
      for (var f of target.content)
        if(f.name == prop) return f.proxy;
		} else {
      return function(){
        return func.apply(target, arguments);
      }
    }
  }
};


class Folder {
  constructor(name){
    this.name = name;
    this.content = [];
    this.proxy = new Proxy(this, FolderProxy);
  }

  isFolder(){return true;}

  subFolder(name){
    let newFolder = new Folder(name);
    this.content.push(newFolder);
    return newFolder;
  }

  push(sprite){
    this.content.push(sprite);
  }

  get length(){
    return this.content.length;
  }

  countFolders(){
    let i = 0;
    for (let elem of this.content)
      if(elem.isFolder() == true) i++;
    return i;
  }

  countFiles(){
    let i = 0;
    for (let elem of this.content)
      if(elem.isFolder() == false) i++;
    return i;
  }

  getFolders(){
    let arr = [];
    for (let elem of this.content)
      if(elem.isFolder() == true) arr.push(elem);
    return arr;
  }

  getFiles(){
    let arr = [];
    for (let elem of this.content)
      if(elem.isFolder() == false) arr.push(elem);
    return arr;
  }

  getContent(){
    return this.content;
  }

  f(folder){
    return this.content[folder];
  }

  collapse(){
    let arr = [];
    for (let elem of this.content) {
      if(elem.isFolder() == true)
        arr = arr.concat(elem.collapse());
      else
        arr.push(elem);
    }
    return arr;
  }
}


function buildLayerPanel(){

  document.getElementById('folders').innerHTML = "";


}

function generateFolderHTML2(folder, htmlElement){
  let folderHTML = document.createElement('div');
  folderHTML.className = 'folder';
  folderHTML.setAttribute('draggable', true);

  let fileNameHTML = document.createElement('span')
  fileNameHTML.className = 'folderName';
  fileNameHTML.appendChild(document.createTextNode(folder.name));
  folderHTML.appendChild(fileNameHTML);

  let contentFolderHTML = document.createElement('div');
  contentFolderHTML.className = 'folderContent';

  folderHTML.addEventListener("click", function(e) {
    e.stopPropagation();
    if(contentFolderHTML.offsetParent === null)
      contentFolderHTML.style.display = 'block';
    else
      contentFolderHTML.style.display = 'none';
  });

  for (var file of folder.getContent()) {
    if(file.isFolder()){ //folder
      generateFolderHTML2(file, contentFolderHTML);
    } else { //file
      let fileHTML = document.createElement('div');
      fileHTML.className = 'file';
      fileHTML.id = "sprite-" + file.identifier;
      fileHTML.setAttribute('draggable', true);

      let fileNameHTML = document.createElement('span')
      fileNameHTML.className = 'fileName';
      fileNameHTML.appendChild(document.createTextNode(file.name));
      fileHTML.appendChild(fileNameHTML);

      fileHTML.addEventListener("click", function(e) {
        e.stopPropagation();
      });

      contentFolderHTML.appendChild(fileHTML);
    }
    folderHTML.appendChild(contentFolderHTML);
    htmlElement.appendChild(folderHTML);
  }
}
