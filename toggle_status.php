<?php
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action']; // 'buka' atau 'tutup'
    
    $query = "UPDATE setting SET status_pendaftaran='$action' WHERE id=1";
    if (mysqli_query($koneksi, $query)) {
        $status_baru = $action == 'buka' ? 'DIBUKA ✅' : 'DITUTUP 🔒';
        echo "<script>alert('Status pendaftaran berhasil $status_baru!'); window.location.href='admin_pendaftar.php';</script>";
    } else {
        echo "Error: " . mysqli_error($koneksi);
    }
}
?>