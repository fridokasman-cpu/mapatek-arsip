<?php 
include 'auth.php';
include 'koneksi.php'; 

// Ambil data arsip (max 6 terbaru)
$query = "SELECT * FROM arsip ORDER BY tanggal_upload DESC LIMIT 6";
$result = mysqli_query($koneksi, $query);

// Hitung total arsip
$total_arsip = mysqli_query($koneksi, "SELECT COUNT(*) as total FROM arsip")->fetch_assoc()['total'];

// Hitung total pendaftar
$total_pendaftar = mysqli_query($koneksi, "SELECT COUNT(*) as total FROM pendaftar")->fetch_assoc()['total'];

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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            background: #f0f4f8; 
            font-family: 'Segoe UI', sans-serif;
        }
        .header-bg { 
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); 
            color: white; 
            padding: 2rem 0; 
            margin-bottom: 2rem; 
        }
        .user-info {
            background: rgba(255,255,255,0.15);
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 1rem;
            font-size: 0.9rem;
        }
        .user-info a { 
            color: #ffc107; 
            text-decoration: none; 
            margin-left: 15px; 
            font-weight: 600;
        }
        .user-info a:hover { color: #fff; }
        
        /* Stats Cards */
        .stats-card {
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: 0.3s;
        }
        .stats-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }
        .stats-icon {
            width: 60px;
            height: 60px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
        }
        .stats-icon.green { background: linear-gradient(135deg, #1b4332, #2d6a4f); }
        .stats-icon.blue { background: linear-gradient(135deg, #0077b6, #00b4d8); }
        .stats-icon.orange { background: linear-gradient(135deg, #e76f51, #f4a261); }
        .stats-number { font-size: 1.8rem; font-weight: 800; color: #1b4332; margin: 0; }
        .stats-label { color: #6c757d; font-size: 0.9rem; margin: 0; }
        
        /* Menu Cards */
        .menu-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            transition: 0.3s;
            text-decoration: none;
            color: #333;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            display: block;
            height: 100%;
        }
        .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            color: #1b4332;
        }
        .menu-card .icon-box {
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }
        .menu-card .icon-box i { 
            font-size: 2rem; 
            color: white; 
        }
        .menu-card h4 { 
            margin-bottom: 0.5rem; 
            color: #1b4332;
            font-weight: 700;
        }
        .menu-card p {
            color: #6c757d;
            margin-bottom: 0;
            font-size: 0.9rem;
        }
        
        /* Arsip Cards */
        .card-arsip { 
            border: none; 
            border-left: 5px solid #2d6a4f; 
            transition: 0.3s; 
            background: white;
        }
        .card-arsip:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 8px 20px rgba(0,0,0,0.1); 
        }
        .card-arsip .file-icon {
            width: 50px;
            height: 50px;
            background: #d8f3dc;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1b4332;
            font-size: 1.5rem;
            margin-right: 1rem;
            flex-shrink: 0;
        }
        
        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: bold;
            font-size: 0.9rem;
        }
        .status-buka { background: #d4edda; color: #155724; }
        .status-tutup { background: #f8d7da; color: #721c24; }
        
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: #6c757d;
        }
        .empty-state i {
            font-size: 4rem;
            margin-bottom: 1rem;
            color: #dee2e6;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .btn-view-all {
            background: transparent;
            border: 2px solid #1b4332;
            color: #1b4332;
            padding: 0.4rem 1rem;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            transition: 0.3s;
        }
        .btn-view-all:hover {
            background: #1b4332;
            color: white;
        }
    </style>
</head>
<body>

<div class="header-bg text-center">
    <div class="container">
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
    
    <!-- STATISTIK CARDS -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="stats-card">
                <div class="stats-icon green">
                    <i class="fas fa-folder-open"></i>
                </div>
                <div>
                    <p class="stats-number"><?= $total_arsip; ?></p>
                    <p class="stats-label">Total Arsip</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stats-card">
                <div class="stats-icon blue">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div>
                    <p class="stats-number"><?= $total_pendaftar; ?></p>
                    <p class="stats-label">Total Pendaftar</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stats-card">
                <div class="stats-icon orange">
                    <i class="fas fa-<?= $setting['status_pendaftaran'] == 'buka' ? 'unlock' : 'lock'; ?>"></i>
                </div>
                <div>
                    <p class="stats-number" style="font-size: 1.2rem;"><?= strtoupper($setting['status_pendaftaran']); ?></p>
                    <p class="stats-label">Status Pendaftaran</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- MENU UTAMA -->
    <h4 class="mb-3"><i class="fas fa-th-large"></i> Menu Utama</h4>
    <div class="row g-4 mb-5">
        <div class="col-md-4">
            <a href="tambah_arsip.php" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-upload"></i>
                </div>
                <h4>Upload Arsip</h4>
                <p>Tambah dokumen baru ke sistem</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="kelola_arsip.php" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-folder"></i>
                </div>
                <h4>Kelola Arsip</h4>
                <p>Lihat, edit, atau hapus arsip</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="admin_pendaftar.php" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-user-plus"></i>
                </div>
                <h4>Kelola Pendaftaran</h4>
                <p>Buka/tutup & lihat pendaftar</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="https://fridokasman-cpu.github.io/mapatek-arsip/" target="_blank" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-globe"></i>
                </div>
                <h4>Website Publik</h4>
                <p>Preview website yang dilihat anggota</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="https://docs.google.com/spreadsheets/d/13LJ21xL-7ZOiGZmqwlRSur7BuiYwQhZou0VqYuh4vlk/edit" target="_blank" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-table"></i>
                </div>
                <h4>Status Pendaftaran</h4>
                <p>Update status via Google Sheets</p>
            </a>
        </div>
        <div class="col-md-4">
            <a href="ganti_password.php" class="menu-card">
                <div class="icon-box">
                    <i class="fas fa-key"></i>
                </div>
                <h4>Ganti Password</h4>
                <p>Ubah password akun admin</p>
            </a>
        </div>
    </div>

    <!-- DAFTAR ARSIP TERBARU -->
    <div class="section-header">
        <h4 class="mb-0"><i class="fas fa-folder-open"></i> Arsip Terbaru</h4>
        <?php if ($total_arsip > 0): ?>
            <a href="kelola_arsip.php" class="btn-view-all">
                <i class="fas fa-list"></i> Lihat Semua (<?= $total_arsip; ?>)
            </a>
        <?php endif; ?>
    </div>
    
    <div class="row">
        <?php if (mysqli_num_rows($result) > 0): ?>
            <?php while ($row = mysqli_fetch_assoc($result)): ?>
                <div class="col-md-6 mb-3">
                    <div class="card card-arsip p-3 h-100">
                        <div class="d-flex align-items-start">
                            <div class="file-icon">
                                <?php 
                                $ext = strtolower(pathinfo($row['nama_file'], PATHINFO_EXTENSION));
                                if ($ext == 'pdf') echo '<i class="fas fa-file-pdf"></i>';
                                elseif (in_array($ext, ['doc', 'docx'])) echo '<i class="fas fa-file-word"></i>';
                                elseif (in_array($ext, ['xls', 'xlsx'])) echo '<i class="fas fa-file-excel"></i>';
                                elseif (in_array($ext, ['jpg', 'jpeg', 'png'])) echo '<i class="fas fa-file-image"></i>';
                                elseif (in_array($ext, ['zip', 'rar'])) echo '<i class="fas fa-file-archive"></i>';
                                else echo '<i class="fas fa-file"></i>';
                                ?>
                            </div>
                            <div class="flex-grow-1">
                                <span class="badge bg-success mb-2"><?= htmlspecialchars($row['kategori']); ?></span>
                                <h5 class="card-title fw-bold mb-1" style="font-size: 1rem;"><?= htmlspecialchars($row['judul_dokumen']); ?></h5>
                                <p class="text-muted small mb-1"><?= htmlspecialchars(substr($row['deskripsi'], 0, 80)); ?><?= strlen($row['deskripsi']) > 80 ? '...' : ''; ?></p>
                                <p class="small text-secondary mb-0">
                                    <i class="far fa-calendar-alt"></i> <?= date('d M Y', strtotime($row['tanggal_upload'])); ?>
                                    <br>
                                    <i class="far fa-user"></i> <?= htmlspecialchars($row['diupload_oleh']); ?>
                                </p>
                            </div>
                            <div class="ms-2">
                                <a href="uploads/<?= htmlspecialchars($row['nama_file']); ?>" class="btn btn-sm btn-outline-success mb-1" download title="Download">
                                    <i class="fas fa-download"></i>
                                </a>
                                <a href="hapus_arsip.php?id=<?= $row['id']; ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Yakin hapus arsip ini?')" title="Hapus">
                                    <i class="fas fa-trash"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h5>Belum ada arsip</h5>
                    <p>Klik "Upload Arsip" untuk menambah dokumen pertama.</p>
                    <a href="tambah_arsip.php" class="btn btn-success mt-2">
                        <i class="fas fa-upload"></i> Upload Arsip Pertama
                    </a>
                </div>
            </div>
        <?php endif; ?>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
