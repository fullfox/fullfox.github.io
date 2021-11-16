const root = './img/';
const fs = require('fs');

let i = 0;

function scan(path){
  let files = fs.readdirSync(root + path);
  let obj = {};
  obj.name = path.slice(0,-1).split('/').pop();
  obj.fichiers = [];
  obj.dossiers = [];
  for (var file of files) {
    let fichier = fs.lstatSync(root + path + file);

    if(fichier.isFile() && file.substr(-4) == ".png"){
      obj.fichiers.push(file.slice(0,-4));
      i++;
    } else if(fichier.isDirectory()){
      obj.dossiers.push(scan(path + file + "/"));
    }
  }
  return obj;
}

let arr = scan("ASSETS/");
fs.writeFileSync('assets.js', "var assets_json = `" + JSON.stringify(arr) + "`;");


console.log(`Done ! (${i} items found)`)
