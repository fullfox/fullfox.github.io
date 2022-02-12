class Folder {
  constructor(name){
    this.name = name;
    this._ = [];
  }

  isFolder(){return true;}

  subFolder(name){
    let newFolder = new Folder(name);
    this._.push(newFolder);
    return newFolder;
  }

  push(sprite){
    this._.push(sprite);
  }

  get length(){
    return this._.length;
  }

  countFolders(){
    let i = 0;
    for (let elem of this._) {
      if(elem.isFolder() == true){i++;}
    }
    return i;
  }

  countFiles(){
    let i = 0;
    for (let elem of this._) {
      if(elem.isFolder() == false){i++;}
    }
    return i;
  }

  getFolders(){
    let arr = [];
    for (let elem of this._) {
      if(elem.isFolder() == true){arr.push(elem);}
    }
    return arr;
  }

  getFiles(){
    let arr = [];
    for (let elem of this._) {
      if(elem.isFolder() == false){arr.push(elem);}
    }
    return arr;
  }

  getContent(){
    return this._;
  }

  f(folder){
    return this._[folder];
  }

  collapse(){
    let arr = [];
    for (let elem of this._) {
      if(elem.isFolder() == true){
        arr = arr.concat(elem.collapse());
      } else {
        arr.push(elem);
      }
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
  folderHTML.appendChild(document.createTextNode(folder.name));

  for (var file of folder.getContent()) {
    if(file.isFolder()){ //folder
      generateFolderHTML2(file, folderHTML);
    } else { //file
      let fileHTML = document.createElement('div');
      fileHTML.className = 'file';
      fileHTML.appendChild(document.createTextNode(folder.name));
      folderHTML.appendChild(fileHTML);
    }
    htmlElement.appendChild(folderHTML);
  }

}
