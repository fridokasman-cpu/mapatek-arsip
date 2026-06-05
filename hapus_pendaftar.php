<?php
include 'koneksi.php';

// Cek apakah ada parameter ID di URL
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Konversi ke integer untuk keamanan
    
    // Cek apakah data dengan ID tersebut ada
    $cek = mysqli_query($koneksi, "SELECT * FROM pendaftar WHERE id=$id");
    
    if (mysqli_num_rows($cek) > 0) {
        // Ambil data pendaftar untuk ditampilkan di konfirmasi
        $pendaftar = mysqli_fetch_assoc($cek);
        
        // Jika sudah dikonfirmasi (ada parameter confirm=1)
        if (isset($_GET['confirm']) && $_GET['confirm'] == 1) {
            // Hapus data dari database
            $query = "DELETE FROM pendaftar WHERE id=$id";
            
            if (mysqli_query($koneksi, $query)) {
                echo "<script>
                        alert('✅ Data pendaftar atas nama " . addslashes($pendaftar['nama']) . " berhasil dihapus!'); 
                        window.location.href='admin_pendaftar.php';
                      </script>";
            } else {
                echo "<script>
                        alert('❌ Error: Gagal menghapus data. " . mysqli_error($koneksi) . "'); 
                        window.location.href='admin_pendaftar.php';
                      </script>";
            }
        } else {
            // Tampilkan halaman konfirmasi
            ?>
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Konfirmasi Hapus - Mapatek Abhipraya</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    body { background: #f0f4f8; }
                    .confirm-box {
                        max-width: 500px;
                        margin: 5rem auto;
                        background: white;
                        padding: 2rem;
                        border-radius: 15px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    .warning-icon {
                        font-size: 4rem;
                        color: #dc3545;
                        margin-bottom: 1rem;
                    }
                    .data-preview {
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 8px;
                        margin: 1.5rem 0;
                        text-align: left;
                    }
                    .data-preview p {
                        margin: 0.3rem 0;
                    }
                    .btn-group-custom {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                        margin-top: 1.5rem;
                    }
                </style>
            </head>
            <body>

            <div class="container">
                <div class="confirm-box">
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="color: #dc3545;">Konfirmasi Penghapusan</h3>
                    <p class="text-muted">Apakah Anda yakin ingin menghapus data pendaftar berikut?</p>
                    
                    <div class="data-preview">
                        <p><strong>Nama:</strong> <?= htmlspecialchars($pendaftar['nama']); ?></p>
                        <p><strong>NIM:</strong> <?= htmlspecialchars($pendaftar['nim']); ?></p>
                        <p><strong>Jurusan:</strong> <?= htmlspecialchars($pendaftar['jurusan']); ?></p>
                        <p><strong>No. WA:</strong> <?= htmlspecialchars($pendaftar['no_wa']); ?></p>
                        <p><strong>Tanggal Daftar:</strong> <?= date('d/m/Y H:i', strtotime($pendaftar['tanggal_daftar'])); ?></p>
                    </div>
                    
                    <div class="alert alert-warning" style="font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> 
                        <strong>Peringatan:</strong> Data yang dihapus tidak dapat dikembalikan!
                    </div>
                    
                    <div class="btn-group-custom">
                        <a href="hapus_pendaftar.php?id=<?= $id; ?>&confirm=1" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Ya, Hapus Sekarang
                        </a>
                        <a href="admin_pendaftar.php" class="btn btn-secondary">
                            <i class="fas fa-times"></i> Batal
                        </a>
                    </div>
                </div>
            </div>

            </body>
            </html>
            <?php
        }
    } else {
        echo "<script>
                alert('❌ Data pendaftar tidak ditemukan!'); 
                window.location.href='admin_pendaftar.php';
              </script>";
    }
} else {
    echo "<script>
            alert('❌ Parameter ID tidak valid!'); 
            window.location.href='admin_pendaftar.php';
          </script>";
}
?>