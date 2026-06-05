<?php
session_start();
include 'koneksi.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    // Cari user di database
    $query = "SELECT * FROM users WHERE username='$username'";
    $result = mysqli_query($koneksi, $query);
    
    if (mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);
        
        // Verifikasi password (pakai password_verify karena sudah di-hash)
        if (password_verify($password, $user['password'])) {
            // Login berhasil - simpan session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            
            echo "<script>
                    alert('✅ Login berhasil! Selamat datang, " . $user['username'] . "'); 
                    window.location.href='index.php';
                  </script>";
            exit();
        } else {
            $error = "❌ Password salah!";
        }
    } else {
        $error = "❌ Username tidak ditemukan!";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Mapatek Abhipraya</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', sans-serif;
        }
        .login-container {
            background: white;
            padding: 3rem 2.5rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 420px;
            width: 100%;
            margin: 1rem;
        }
        .logo-area {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo-area i {
            font-size: 4rem;
            color: #1b4332;
            margin-bottom: 1rem;
        }
        .logo-area h2 {
            color: #1b4332;
            font-weight: 800;
            margin-bottom: 0.3rem;
        }
        .logo-area p {
            color: #6c757d;
            font-size: 0.9rem;
        }
        .form-control {
            padding: 0.8rem 1rem;
            border-radius: 10px;
            border: 2px solid #e0e0e0;
        }
        .form-control:focus {
            border-color: #2d6a4f;
            box-shadow: 0 0 0 0.2rem rgba(45, 106, 79, 0.15);
        }
        .input-group-text {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-right: none;
            color: #2d6a4f;
        }
        .input-group .form-control {
            border-left: none;
        }
        .btn-login {
            background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
            color: white;
            padding: 0.8rem;
            border-radius: 10px;
            font-weight: 600;
            border: none;
            width: 100%;
            transition: 0.3s;
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(27, 67, 50, 0.4);
            color: white;
        }
        .alert {
            border-radius: 10px;
            font-size: 0.9rem;
        }
        .footer-text {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.85rem;
            color: #6c757d;
        }
        .footer-text a {
            color: #2d6a4f;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>

<div class="login-container">
    <div class="logo-area">
        <i class="fas fa-mountain"></i>
        <h2>Mapatek Abhipraya</h2>
        <p>Sistem Kearsipan & Pendaftaran</p>
    </div>

    <?php if ($error): ?>
        <div class="alert alert-danger"><?= $error; ?></div>
    <?php endif; ?>

    <form method="POST">
        <div class="mb-3">
            <label class="form-label fw-bold">Username</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
                <input type="text" name="username" class="form-control" placeholder="Masukkan username" required autofocus>
            </div>
        </div>

        <div class="mb-4">
            <label class="form-label fw-bold">Password</label>
            <div class="input-group">
                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                <input type="password" name="password" id="password" class="form-control" placeholder="Masukkan password" required>
                <span class="input-group-text" style="cursor: pointer; border-left: none;" onclick="togglePassword()">
                    <i class="fas fa-eye" id="eyeIcon"></i>
                </span>
            </div>
        </div>

        <button type="submit" class="btn btn-login">
            <i class="fas fa-sign-in-alt"></i> LOGIN
        </button>
    </form>

    <div class="footer-text">
        <p class="mb-1">🔐 Halaman khusus admin</p>
        <a href="../mapatek-arsip-public/index.html">← Kembali ke Website Publik</a>
    </div>
</div>

<script>
    function togglePassword() {
        const pwd = document.getElementById('password');
        const icon = document.getElementById('eyeIcon');
        if (pwd.type === 'password') {
            pwd.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            pwd.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }
</script>

</body>
</html>