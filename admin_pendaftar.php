<?php
include 'koneksi.php';

// Ambil status pendaftaran
$setting = mysqli_query($koneksi, "SELECT * FROM setting WHERE id=1")->fetch_assoc();

// Ambil daftar pendaftar
$pendaftar = mysqli_query($koneksi, "SELECT * FROM pendaftar ORDER BY tanggal_daftar DESC");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Admin Pendaftaran - Mapatek</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #f0f4f8; }
        .header-bg { background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); color: white; padding: 2rem 0; margin-bottom: 2rem; }
        .status-card { padding: 2rem; border-radius: 15px; text-align: center; margin-bottom: 2rem; }
        .status-buka { background: #d4edda; border: 2px solid #28a745; color: #155724; }
        .status-tutup { background: #f8d7da; border: 2px solid #dc3545; color: #721c24; }
        .btn-toggle { padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; border-radius: 50px; }
    </style>
</head>
<body>

<div class="header-bg text-center">
    <h2><i class="fas fa-user-plus"></i> Panel Admin Pendaftaran</h2>
    <p class="mb-0">Mapatek Abhipraya</p>
    <a href="index.php" class="btn btn-light btn-sm mt-2"><i class="fas fa-arrow-left"></i> Kembali ke Dashboard</a>
</div>

<div class="container">

    <!-- STATUS PENDAFTARAN -->
    <div class="status-card <?= $setting['status_pendaftaran'] == 'buka' ? 'status-buka' : 'status-tutup'; ?>">
        <h3>
            <i class="fas fa-<?= $setting['status_pendaftaran'] == 'buka' ? 'check-circle' : 'times-circle'; ?>"></i>
            Status Pendaftaran: <?= strtoupper($setting['status_pendaftaran']); ?>
        </h3>
        <p class="mb-3">Periode: <strong><?= htmlspecialchars($setting['periode']); ?></strong></p>
        
        <form action="toggle_status.php" method="POST" class="d-inline">
            <?php if ($setting['status_pendaftaran'] == 'tutup'): ?>
                <button type="submit" name="action" value="buka" class="btn btn-success btn-toggle">
                    <i class="fas fa-unlock"></i> BUKA PENDAFTARAN
                </button>
            <?php else: ?>
                <button type="submit" name="action" value="tutup" class="btn btn-danger btn-toggle">
                    <i class="fas fa-lock"></i> TUTUP PENDAFTARAN
                </button>
            <?php endif; ?>
        </form>
    </div>

    <!-- INFO PERIODE -->
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="fas fa-info-circle"></i> Informasi Periode</h5>
        </div>
        <div class="card-body">
            <form action="update_info.php" method="POST">
                <div class="mb-3">
                    <label class="form-label fw-bold">Nama Periode</label>
                    <input type="text" name="periode" class="form-control" value="<?= htmlspecialchars($setting['periode']); ?>" required>
                    <small class="text-muted">Contoh: "Pendaftaran Diksar XV - Periode Agustus 2026"</small>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Info Lanjutan (ditampilkan saat pendaftaran TUTUP)</label>
                    <textarea name="info_lanjutan" class="form-control" rows="2"><?= htmlspecialchars($setting['info_lanjutan']); ?></textarea>
                    <small class="text-muted">Contoh: "Pendaftaran periode berikutnya dibuka bulan Januari 2027"</small>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Link Google Form Pendaftaran</label>
                    <input type="url" name="link_form" class="form-control" value="<?= htmlspecialchars($setting['link_form']); ?>" placeholder="https://docs.google.com/forms/...">
                    <small class="text-muted">Buat Google Form dulu, lalu paste link-nya di sini</small>
                </div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Simpan Informasi</button>
            </form>
        </div>
    </div>

    <!-- DAFTAR PENDAFTAR -->
    <div class="card">
        <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="fas fa-users"></i> Daftar Pendaftar</h5>
            <span class="badge bg-light text-dark"><?= mysqli_num_rows($pendaftar); ?> Orang</span>
        </div>
        <div class="card-body">
            <?php if (mysqli_num_rows($pendaftar) > 0): ?>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Tanggal</th>
                                <th>Nama</th>
                                <th>NIM</th>
                                <th>Jurusan</th>
                                <th>No. WA</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $no = 1; while ($p = mysqli_fetch_assoc($pendaftar)): ?>
                                <tr>
                                    <td><?= $no++; ?></td>
                                    <td><?= date('d/m/Y H:i', strtotime($p['tanggal_daftar'])); ?></td>
                                    <td><strong><?= htmlspecialchars($p['nama']); ?></strong></td>
                                    <td><?= htmlspecialchars($p['nim']); ?></td>
                                    <td><?= htmlspecialchars($p['jurusan']); ?></td>
                                    <td>
                                        <a href="https://wa.me/<?= preg_replace('/[^0-9]/', '', $p['no_wa']); ?>" target="_blank" class="btn btn-sm btn-success">
                                            <i class="fab fa-whatsapp"></i> <?= htmlspecialchars($p['no_wa']); ?>
                                        </a>
                                    </td>
                                    <td>
                                        <span class="badge bg-<?= $p['status'] == 'Diterima' ? 'success' : ($p['status'] == 'Ditolak' ? 'danger' : 'warning'); ?>">
                                            <?= $p['status']; ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="detail_pendaftar.php?id=<?= $p['id']; ?>" class="btn btn-sm btn-info"><i class="fas fa-eye"></i></a>
                                        <a href="hapus_pendaftar.php?id=<?= $p['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Yakin hapus?')"><i class="fas fa-trash"></i></a>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            <?php else: ?>
                <p class="text-center text-muted py-4">Belum ada pendaftar.</p>
            <?php endif; ?>
        </div>
    </div>

</div>

</body>
</html>