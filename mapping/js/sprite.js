class Sprite {
  static iter = 0;

  constructor(obj) {
    this.name = obj.name ?? "sprite";
    this.x = obj.x;
    this.y = obj.y;
    this.sx = obj.sx;
    this.sy = obj.sy;
    this.angle = obj.angle;;
    this.texture = obj.texture;

    this.identifier = Sprite.iter++;
    this.proxy = this; //compatibilité folder
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
