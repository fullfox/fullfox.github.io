class Sprite {
  constructor(obj) {
    this.name = obj.name ?? "";
    this.x = obj.x;
    this.y = obj.y;
    this.sx = obj.sx;
    this.sy = obj.sy;
    this.angle = obj.angle;;
    this.texture = obj.texture;
  }

  isFolder(){return false;}

  get textureImage(){
    return getTexture(this.texture);
  }

  draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //ctx de base

    ctx.translate(tx,ty);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx,-cy);

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.textureImage, -this.sx/2, -this.sy/2, this.sx, this.sy);
  }

  clone(){
    return new Sprite(this);
  }


}

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
