class Sprite {
  constructor(obj) {
    this.name = "";
    this.x = obj.x;
    this.y = obj.y;
    this.sx = obj.sx;
    this.sy = obj.sy;
    this.angle = obj.angle;;
    this.texture = obj.texture;
  }

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
  constructor(){
    this._ = {};
  }

  get isFolder() {
    return true;
  }

  subFolder(name){
    this[name] = new Folder();
  }

  collapse(){
    for (let f in this) {
      console.log(f);
    }
  }
}
