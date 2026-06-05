<?php
include 'koneksi.php';

// Pastikan folder uploads ada
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$judul = htmlspecialchars($_POST['judul']);
$kategori = htmlspecialchars($_POST['kategori']);
$deskripsi = htmlspecialchars($_POST['deskripsi']);
$uploader = htmlspecialchars($_POST['uploader']);

// Proses File
$nama_file = basename($_FILES["file_arsip"]["name"]);
$target_file = $target_dir . $nama_file;

// Pindahkan file ke folder uploads
if (move_uploaded_file($_FILES["file_arsip"]["tmp_name"], $target_file)) {
    // Simpan data ke database MySQL
    $query = "INSERT INTO arsip (judul_dokumen, kategori, deskripsi, nama_file, diupload_oleh) 
              VALUES ('$judul', '$kategori', '$deskripsi', '$nama_file', '$uploader')";
    
    if (mysqli_query($koneksi, $query)) {
        echo "<script>alert('✅ Arsip berhasil disimpan!'); window.location.href='index.php';</script>";
    } else {
        echo "❌ Error database: " . mysqli_error($koneksi);
    }
} else {
    echo "<script>alert('❌ Maaf, terjadi kesalahan saat mengupload file. Pastikan nama file tidak mengandung karakter aneh.'); window.history.back();</script>";
}
?>