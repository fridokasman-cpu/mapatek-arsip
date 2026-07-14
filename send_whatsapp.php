<?php
// ================================================================
// Kirim Pesan WhatsApp via Fonnte
// ================================================================

// Ganti dengan token Anda dari dashboard Fonnte
$token = "guMsUPd1Db6Di6BJY8Ep";

// Ambil data dari request
$target = $_POST['target'] ?? ''; // Bisa ID Grup atau nomor HP
$message = $_POST['message'] ?? '';

// Jika target kosong, gunakan ID Grup default (bisa diisi manual di sini)
if (empty($target)) {
    // Masukkan ID Grup yang sudah Anda dapatkan
    $target = "grup_1234567890"; // Ganti dengan ID grup Anda
    // Contoh ID grup WhatsApp: 120363123456789
}

// Jika pesan kosong, beri pesan default
if (empty($message)) {
    $message = "📢 Pengumuman dari Mapatek Abhipraya. Cek website untuk info lengkap.";
}

// Tambahkan info pengirim agar pesan terlihat resmi
$message = "🏔️ *MAPATEK ABHIPRAYA*\n\n" . $message . "\n\n_📱 Dikirim via Sistem Notifikasi Mapatek_";

// Kirim request ke API Fonnte
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.fonnte.com/send',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array(
        'target' => $target,
        'message' => $message,
        'countryCode' => '62', // Kode negara Indonesia
    ),
    CURLOPT_HTTPHEADER => array(
        "Authorization: $token"
    ),
));

$response = curl_exec($curl);
curl_close($curl);

// Kirim balasan ke JavaScript
echo $response;
?>