<?php
include 'koneksi.php';
$query = "SELECT * FROM arsip ORDER BY tanggal_upload DESC";
$result = mysqli_query($koneksi, $query);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Kearsipan - Mapatek Abhipraya</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #f0f4f8; }
        .header-bg { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); color: white; padding: 2rem 0; margin-bottom: 2rem; }
        .card-arsip { border: none; border-left: 5px solid #2d6a4f; transition: 0.3s; }
        .card-arsip:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .badge-kategori { font-size: 0.8rem; padding: 5px 10px; }
    </style>
</head>
<body>

<div class="header-bg text-center">
    <div class="container">
        <h2><i class="fas fa-folder-open"></i> Sistem Kearsipan Digital</h2>
        <h4 class="fw-light">Mapatek Abhipraya (Est. 19 Maret 2023)</h4>
        <a href="tambah_arsip.php" class="btn btn-warning fw-bold mt-3"><i class="fas fa-plus"></i> Tambah Arsip Baru</a>
    </div>
</div>

<div class="container">
    <div class="row">
        <?php if (mysqli_num_rows($result) > 0): ?>
            <?php while ($row = mysqli_fetch_assoc($result)): ?>
                <div class="col-md-6 mb-4">
                    <div class="card card-arsip p-3 h-100">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <span class="badge bg-success badge-kategori mb-2"><?= htmlspecialchars($row['kategori']); ?></span>
                                <h5 class="card-title fw-bold text-dark"><?= htmlspecialchars($row['judul_dokumen']); ?></h5>
                                <p class="text-muted small mb-2"><?= htmlspecialchars($row['deskripsi']); ?></p>
                                <p class="small text-secondary mb-0">
                                    <i class="far fa-calendar-alt"></i> <?= date('d M Y', strtotime($row['tanggal_upload'])); ?> | 
                                    <i class="far fa-user"></i> <?= htmlspecialchars($row['diupload_oleh']); ?>
                                </p>
                            </div>
                            <a href="uploads/<?= htmlspecialchars($row['nama_file']); ?>" class="btn btn-sm btn-outline-success ms-2" download>
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="col-12 text-center py-5">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <p class="text-muted">Belum ada arsip yang terdaftar.</p>
            </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>