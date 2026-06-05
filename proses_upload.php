<?php
include 'auth.php';
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file_arsip'])) {
    
    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $judul = mysqli_real_escape_string($koneksi, $_POST['judul']);
    $kategori = mysqli_real_escape_string($koneksi, $_POST['kategori']);
    $deskripsi = mysqli_real_escape_string($koneksi, $_POST['deskripsi']);
    $uploader = mysqli_real_escape_string($koneksi, $_POST['uploader']);

    $file = $_FILES['file_arsip'];
    $file_name = $file['name'];
    $file_tmp = $file['tmp_name'];
    $file_size = $file['size'];
    $file_error = $file['error'];

    $allowed_ext = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'jpg', 'jpeg', 'png'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

    if ($file_error !== 0) {
        die("<script>alert('❌ Error upload file!'); window.history.back();</script>");
    }

    if ($file_size > 10485760) {
        die("<script>alert('❌ Ukuran file terlalu besar! Maksimal 10 MB.'); window.history.back();</script>");
    }

    if (!in_array($file_ext, $allowed_ext)) {
        die("<script>alert('❌ Format file tidak diperbolehkan!'); window.history.back();</script>");
    }

    $new_file_name = uniqid() . '_' . time() . '.' . $file_ext;
    $upload_path = $upload_dir . $new_file_name;

    if (move_uploaded_file($file_tmp, $upload_path)) {
        $query = "INSERT INTO arsip (judul_dokumen, kategori, deskripsi, nama_file, diupload_oleh, tanggal_upload) 
                  VALUES ('$judul', '$kategori', '$deskripsi', '$new_file_name', '$uploader', NOW())";
        
        if (mysqli_query($koneksi, $query)) {
            echo "<script>
                    alert('✅ Arsip berhasil diupload!'); 
                    window.location.href='dashboard.php';
                  </script>";
        } else {
            unlink($upload_path);
            echo "<script>alert('❌ Gagal simpan ke database.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('❌ Gagal upload file!'); window.history.back();</script>";
    }
} else {
    header("Location: dashboard.php");
    exit();
}
?>
