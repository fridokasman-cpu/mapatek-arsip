<?php
include 'auth.php';
include 'koneksi.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    
    // Ambil data arsip
    $query = "SELECT * FROM arsip WHERE id = $id";
    $result = mysqli_query($koneksi, $query);
    
    if (mysqli_num_rows($result) == 1) {
        $arsip = mysqli_fetch_assoc($result);
        
        // Hapus file fisik
        $file_path = 'uploads/' . $arsip['nama_file'];
        if (file_exists($file_path)) {
            unlink($file_path);
        }
        
        // Hapus dari database
        if (mysqli_query($koneksi, "DELETE FROM arsip WHERE id = $id")) {
            echo "<script>
                    alert('✅ Arsip berhasil dihapus!'); 
                    window.location.href='kelola_arsip.php';
                  </script>";
        } else {
            echo "<script>alert('❌ Gagal hapus arsip.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('❌ Arsip tidak ditemukan.'); window.location.href='kelola_arsip.php';</script>";
    }
} else {
    header("Location: kelola_arsip.php");
    exit();
}
?>
