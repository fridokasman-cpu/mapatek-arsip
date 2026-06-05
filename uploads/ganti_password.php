<?php
session_start();
include 'koneksi.php';

// Cek login
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $old_pass = $_POST['old_pass'];
    $new_pass = $_POST['new_pass'];
    $confirm_pass = $_POST['confirm_pass'];
    
    // Ambil data user
    $user = mysqli_query($koneksi, "SELECT * FROM users WHERE id=" . $_SESSION['user_id'])->fetch_assoc();
    
    // Cek password lama
    if (!password_verify($old_pass, $user['password'])) {
        $error = "❌ Password lama salah!";
    } elseif ($new_pass !== $confirm_pass) {
        $error = "❌ Password baru dan konfirmasi tidak cocok!";
    } elseif (strlen($new_pass) < 6) {
        $error = "❌ Password minimal 6 karakter!";
    } else {
        // Update password
        $hashed = password_hash($new_pass, PASSWORD_DEFAULT);
        if (mysqli_query($koneksi, "UPDATE users SET password='$hashed' WHERE id=" . $_SESSION['user_id'])) {
            $success = "✅ Password berhasil diubah!";
        } else {
            $error = "❌ Gagal mengubah password.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Ganti Password - Mapatek</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background: #f0f4f8; }
        .card-custom { max-width: 500px; margin: 3rem auto; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
<div class="container">
    <div class="card card-custom">
        <div class="card-header bg-success text-white">
            <h5 class="mb-0"><i class="fas fa-key"></i> Ganti Password</h5>
        </div>
        <div class="card-body">
            <?php if ($error): ?><div class="alert alert-danger"><?= $error; ?></div><?php endif; ?>
            <?php if ($success): ?><div class="alert alert-success"><?= $success; ?></div><?php endif; ?>
            
            <form method="POST">
                <div class="mb-3">
                    <label class="fw-bold">Password Lama</label>
                    <input type="password" name="old_pass" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="fw-bold">Password Baru</label>
                    <input type="password" name="new_pass" class="form-control" required minlength="6">
                </div>
                <div class="mb-3">
                    <label class="fw-bold">Konfirmasi Password Baru</label>
                    <input type="password" name="confirm_pass" class="form-control" required>
                </div>
                <button class="btn btn-success w-100"><i class="fas fa-save"></i> Simpan Password</button>
                <a href="index.php" class="btn btn-secondary w-100 mt-2">Kembali</a>
            </form>
        </div>
    </div>
</div>
</body>
</html>