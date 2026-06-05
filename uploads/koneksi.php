<?php
$host = "localhost";
$user = "root";
$pass = ""; // Default XAMPP kosong
$db = "kearsipan_mapatek";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>