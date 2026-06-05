<?php
$folder = 'images/galeri/';
$files = scandir($folder);
$images = array();

foreach($files as $file) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    if(in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $images[] = $folder . $file;
    }
}
header('Content-Type: application/json');
echo json_encode($images);
?>