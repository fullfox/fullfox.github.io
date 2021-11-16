<?php
  if(isset($_GET['item']) && isset($_GET['joueur'])){
    $joueur = json_decode(file_get_contents('fiches/' . $_GET['joueur'] . '.json'),true);
    $magasin = json_decode(file_get_contents('magasins/current.json'),true);

    $force = 0;
    $poidsInv = 0;
    foreach ($joueur['inventaire'] as $key => $item) {
      $poidsInv+=intval($item['poids']);
      if(isset($item['bonus']['force'])){
        $force += $item['bonus']['force'];
      }
    }

    $poidsMax = intval(10*exp(0.03*($joueur['caracteristiques']['force'] + $force )));

    foreach ($magasin as $key => $item) {
      if ($item['nom'] == $_GET['item']) {
        if($joueur['pieces']>=$item['cout'] && ($poidsInv + $item['poids']) < $poidsMax){//ok
          $joueur['pieces']-=$item['cout'];
          if($item['quantity'] > 1){
            $magasin[$key]['quantity']--;
          } else {
            array_splice($magasin,$key,1);
          }
          $item->quantity=0;
          array_push($joueur['inventaire'], $item); //on rajoute dans l'inventaire joueur

          file_put_contents('fiches/' . $_GET['joueur'] . '.json', json_encode($joueur));
          file_put_contents('magasins/current.json', json_encode($magasin));
          echo "success";
        } else {
          echo "fail";
        }
        break;
      }
    }
  }
?>
