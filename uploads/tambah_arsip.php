<?php include 'auth.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Arsip - Mapatek</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="card mx-auto shadow" style="max-width: 600px;">
        <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="fas fa-upload"></i> Upload Dokumen Arsip</h5>
        </div>
        <div class="card-body">
            <form action="proses_upload.php" method="POST" enctype="multipart/form-data">
                <div class="mb-3">
                    <label class="form-label fw-bold">Judul Dokumen</label>
                    <input type="text" name="judul" class="form-control" required placeholder="Cth: Laporan Pendakian Gn. Gede 2023">
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Kategori</label>
                    <select name="kategori" class="form-select" required>
                        <option value="" disabled selected>Pilih Kategori...</option>
                        <option value="AD_ART">AD / ART</option>
                        <option value="Laporan_Kegiatan">Laporan Kegiatan</option>
                        <option value="Laporan_Keuangan">Laporan Keuangan</option>
                        <option value="SK">Surat Keputusan (SK)</option>
                        <option value="Dokumentasi">Dokumentasi Foto/Video</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Deskripsi Singkat</label>
                    <textarea name="deskripsi" class="form-control" rows="3" placeholder="Jelaskan isi dokumen secara singkat..."></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">File Dokumen (PDF/ZIP/JPG)</label>
                    <input type="file" name="file_arsip" class="form-control" required>
                    <div class="form-text">Maksimal ukuran file tergantung konfigurasi php.ini (default 2MB-8MB).</div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Nama Pengupload</label>
                    <input type="text" name="uploader" class="form-control" required placeholder="Nama Sekretaris/Admin">
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-success fw-bold">Simpan ke Arsip</button>
                    <a href="index.php" class="btn btn-secondary">Batal</a>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>