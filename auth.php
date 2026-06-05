<?php
session_start();

// Cek apakah user sudah login
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    // Kalau belum login, redirect ke halaman login
    header("Location: login.php");
    exit();
}

// Optional: Cek role (kalau mau batasi hanya admin)
// if ($_SESSION['role'] !== 'admin') {
//     echo "<script>alert('Akses ditolak!'); window.location.href='login.php';</script>";
//     exit();
// }
?>