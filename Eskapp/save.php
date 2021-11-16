<?php
  if(isset($_POST['data'])){
    $data = $_POST['data'];
    $presentation = json_decode($data, true)["presentation"];
    $filename = $presentation["joueur"] . ".json";
    file_put_contents("fiches/" . $filename, $data);
    echo "ok";

  } elseif (isset($_GET['all'])) {
    $files = scandir("fiches");
    array_shift($files);
    array_shift($files);
    echo json_encode($files);

  } elseif (isset($_POST['bdd'])) {
    file_put_contents("objets.json", $_POST['bdd']);
    echo "ok bdd";

  } elseif (isset($_POST['shop'])) {
    file_put_contents("magasins/current.json", $_POST['shop']);
    echo "ok shop";

  } elseif (isset($_GET['allShop'])) {
    $files = scandir("magasins");
    array_shift($files);
    array_shift($files);
    $files = array_values(array_diff($files, ["current.json"]));
    echo json_encode($files);

  } elseif(isset($_GET['delete'])){
    $nom = $_GET['delete'];
    unlink("fiches/" . $nom . ".json");
    echo "ok";

  } elseif(isset($_GET['deleteShop'])){
    $nom = $_GET['deleteShop'];
    unlink("magasins/" . $nom . ".json");
    echo "ok";

  } elseif(isset($_POST['updateShop'])){
      $data = json_decode($_POST['updateShop'], true);
      file_put_contents("magasins/" . $data['shopName'] . ".json", json_encode($data['content']));
      echo "ok";
    }
 ?>
