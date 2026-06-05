<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $periode = htmlspecialchars($_POST['periode']);
    $info = htmlspecialchars($_POST['info_lanjutan']);
    $link = htmlspecialchars($_POST['link_form']);
    
    $query = "UPDATE setting SET periode='$periode', info_lanjutan='$info', link_form='$link' WHERE id=1";
    
    if (mysqli_query($koneksi, $query)) {
        echo "<script>alert('✅ Informasi periode berhasil diupdate!'); window.location.href='admin_pendaftar.php';</script>";
    } else {
        echo "Error: " . mysqli_error($koneksi);
    }
}
?>