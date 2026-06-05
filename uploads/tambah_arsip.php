<?php 
include 'auth.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Arsip - Mapatek Abhipraya</title>
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
        .upload-box {
            background: white;
            padding: 2.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 700px;
            margin: 0 auto;
        }
        .form-label {
            font-weight: 600;
            color: #1b4332;
        }
        .btn-upload {
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
            color: white;
            padding: 0.8rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            width: 100%;
            transition: 0.3s;
        }
        .btn-upload:hover {
            background: #2d6a4f;
            color: white;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>

<div class="header-bg text-center">
    <div class="container">
        <h2><i class="fas fa-upload"></i> Upload Arsip Baru</h2>
        <p class="mb-0">Mapatek Abhipraya</p>
        <a href="dashboard.php" class="btn btn-light btn-sm mt-2">
            <i class="fas fa-arrow-left"></i> Kembali ke Dashboard
        </a>
    </div>
</div>

<div class="container">
    <div class="upload-box">
        <form action="proses_upload.php" method="POST" enctype="multipart/form-data">
            <div class="mb-3">
                <label class="form-label">Judul Dokumen <span class="text-danger">*</span></label>
                <input type="text" name="judul" class="form-control" required 
                       placeholder="Contoh: Laporan Pendakian Gunung Gede 2026">
            </div>

            <div class="mb-3">
                <label class="form-label">Kategori <span class="text-danger">*</span></label>
                <select name="kategori" class="form-select" required>
                    <option value="">Pilih Kategori...</option>
                    <option value="Laporan Kegiatan">Laporan Kegiatan</option>
                    <option value="Laporan Keuangan">Laporan Keuangan</option>
                    <option value="AD_ART">AD/ART</option>
                    <option value="SK">Surat Keputusan (SK)</option>
                    <option value="Dokumentasi">Dokumentasi</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Deskripsi Singkat</label>
                <textarea name="deskripsi" class="form-control" rows="3" 
                          placeholder="Jelaskan isi dokumen secara singkat..."></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">File Dokumen <span class="text-danger">*</span></label>
                <input type="file" name="file_arsip" class="form-control" required 
                       accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.jpg,.jpeg,.png">
                <div class="form-text">
                    Format: PDF, Word, Excel, ZIP, RAR, JPG, PNG | Maksimal: 10 MB
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label">Nama Pengupload <span class="text-danger">*</span></label>
                <input type="text" name="uploader" class="form-control" required 
                       value="<?= htmlspecialchars($_SESSION['username']); ?>">
            </div>

            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-upload">
                    <i class="fas fa-upload"></i> UPLOAD ARSIP
                </button>
                <a href="dashboard.php" class="btn btn-secondary">Batal</a>
            </div>
        </form>
    </div>
</div>

</body>
</html>
