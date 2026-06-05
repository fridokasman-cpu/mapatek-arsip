<?php
include 'koneksi.php';
$id = $_GET['id'];
$p = mysqli_query($koneksi, "SELECT * FROM pendaftar WHERE id=$id")->fetch_assoc();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $status = $_POST['status'];
    mysqli_query($koneksi, "UPDATE pendaftar SET status='$status' WHERE id=$id");
    echo "<script>alert('Status diupdate!'); window.location.href='admin_pendaftar.php';</script>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Detail Pendaftar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="card mx-auto" style="max-width: 600px;">
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Detail Pendaftar</h5>
        </div>
        <div class="card-body">
            <table class="table">
                <tr><th>Nama</th><td><?= $p['nama']; ?></td></tr>
                <tr><th>NIM</th><td><?= $p['nim']; ?></td></tr>
                <tr><th>Jurusan</th><td><?= $p['jurusan']; ?></td></tr>
                <tr><th>Angkatan</th><td><?= $p['angkatan']; ?></td></tr>
                <tr><th>No. WA</th><td><?= $p['no_wa']; ?></td></tr>
                <tr><th>Email</th><td><?= $p['email']; ?></td></tr>
                <tr><th>Alasan</th><td><?= nl2br($p['alasan']); ?></td></tr>
                <tr><th>Tanggal Daftar</th><td><?= date('d/m/Y H:i', strtotime($p['tanggal_daftar'])); ?></td></tr>
            </table>
            
            <hr>
            <form method="POST">
                <label class="fw-bold">Ubah Status:</label>
                <select name="status" class="form-select mb-3">
                    <option value="Baru" <?= $p['status']=='Baru'?'selected':''; ?>>Baru</option>
                    <option value="Diterima" <?= $p['status']=='Diterima'?'selected':''; ?>>Diterima ✅</option>
                    <option value="Ditolak" <?= $p['status']=='Ditolak'?'selected':''; ?>>Ditolak ❌</option>
                </select>
                <button class="btn btn-primary">Simpan Status</button>
                <a href="admin_pendaftar.php" class="btn btn-secondary">Kembali</a>
            </form>
        </div>
    </div>
</div>
</body>
</html>