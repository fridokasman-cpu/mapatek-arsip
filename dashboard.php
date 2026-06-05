<?php 
include 'auth.php';   // Cek apakah sudah login
include 'koneksi.php'; 

// Ambil data arsip
$query = "SELECT * FROM arsip ORDER BY tanggal_upload DESC";
$result = mysqli_query($koneksi, $query);

// Ambil status pendaftaran
$setting = mysqli_query($koneksi, "SELECT * FROM setting WHERE id=1")->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Mapatek Abhipraya</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #f0f4f8; }
        .header-bg { 
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); 
            color: white; 
            padding: 2rem 0; 
            margin-bottom: 2rem; 
        }
        .user-info {
            background: rgba(255,255,255,0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 1rem;
        }
        .user-info a { color: #ffc107; text-decoration: none; margin-left: 10px; }
        .card-arsip { border: none; border-left: 5px solid #2d6a4f; transition: 0.3s; }
        .card-arsip:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .menu-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            transition: 0.3s;
            text-decoration: none;
            color: #333;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            color: #1b4332;
        }
        .menu-card i { font-size: 3rem; color: #2d6a4f; margin-bottom: 1rem; }
        .menu-card h4 { margin-bottom: 0.5rem; }
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-weight: bold;
        }
        .status-buka { background: #d4edda; color: #155724; }
        .status-tutup { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>

<div class="header-bg text-center">
    <div class="container">
        <!-- INFO USER LOGIN -->
        <div class="user-info">
            <i class="fas fa-user-circle"></i> 
            Login sebagai: <strong><?= htmlspecialchars($_SESSION['username']); ?></strong>
            (<?= htmlspecialchars($_SESSION['role']); ?>)
            <a href="ganti_password.php"><i class="fas fa-key"></i> Ganti Password</a>
            <a href="logout.php" onclick="return confirm('Yakin logout?')"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
        
        <h2><i class="fas fa-tachometer-alt"></i> Dashboard Admin</h2>
        <h4 class="fw-light">Mapatek Abhipraya</h4>
        
        <div class="mt-3">
            <span class="status-badge <?= $setting['status_pendaftaran'] == 'buka' ? 'status-buka' : 'status-tutup'; ?>">
                <i class="fas fa-<?= $setting['status_pendaftaran'] == 'buka' ? 'unlock' : 'lock'; ?>"></i>
                Pendaftaran: <?= strtoupper($setting['status_pendaftaran']); ?>
            </span>
        </div>
    </div>
</div>

<div class="container">
    
    <!-- MENU UTAMA -->
    <h4 class="mb-4"><i class="fas fa-th-large"></i> Menu Utama</h4>
    <div class="row g-4 mb-5">
        <div class="col-md-4">
            <a href="tambah_arsip.php" class="menu-card">
                <i class="fas fa-upload"></i>
                <h4>Upload Arsip</h4>
                <p class="text-muted mb-0">Tambah dokumen baru ke sistem</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="admin_pendaftar.php" class="menu-card">
                <i class="fas fa-user-plus"></i>
                <h4>Kelola Pendaftaran</h4>
                <p class="text-muted mb-0">Buka/tutup & lihat pendaftar</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="../mapatek-arsip-public/index.html" target="_blank" class="menu-card">
                <i class="fas fa-globe"></i>
                <h4>Lihat Website Publik</h4>
                <p class="text-muted mb-0">Preview website yang dilihat anggota</p>
            </a>
        </div>
    </div>

    <!-- DAFTAR ARSIP TERBARU -->
    <h4 class="mb-3"><i class="fas fa-folder-open"></i> Arsip Terbaru</h4>
    <div class="row">
        <?php if (mysqli_num_rows($result) > 0): ?>
            <?php 
            $count = 0;
            while ($row = mysqli_fetch_assoc($result)): 
                if ($count >= 6) break; // Tampilkan max 6 arsip terbaru
                $count++;
            ?>
                <div class="col-md-6 mb-3">
                    <div class="card card-arsip p-3 h-100">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <span class="badge bg-success mb-2"><?= htmlspecialchars($row['kategori']); ?></span>
                                <h5 class="card-title fw-bold"><?= htmlspecialchars($row['judul_dokumen']); ?></h5>
                                <p class="text-muted small mb-1"><?= htmlspecialchars($row['deskripsi']); ?></p>
                                <p class="small text-secondary mb-0">
                                    <i class="far fa-calendar-alt"></i> <?= date('d M Y', strtotime($row['tanggal_upload'])); ?>
                                </p>
                            </div>
                            <a href="uploads/<?= htmlspecialchars($row['nama_file']); ?>" class="btn btn-sm btn-outline-success" download>
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="col-12 text-center py-4">
                <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                <p class="text-muted">Belum ada arsip.</p>
            </div>
        <?php endif; ?>
    </div>

</div>

</body>
</html>