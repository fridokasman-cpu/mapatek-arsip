// ================================================================
// DATA CAMPAIGN DONASI & MERCHANDISE — Silakan edit sesuai kondisi asli
// ----------------------------------------------------------------
// campaignData:
// - deadline    : opsional, format "YYYY-MM-DD". Kosongkan "" kalau
//                 campaign tidak punya batas waktu (badge countdown
//                 otomatis disembunyikan).
//
// merchData:
// - stok        : opsional, angka. Kalau diisi dan <= 5, badge
//                 "Sisa X" otomatis muncul di kartu produk.
//
// donaturData   : nama & jumlah donasi (HANYA tampilkan donatur yang
//                 sudah izin namanya dipublikasikan). Tingkat Bronze/
//                 Silver/Gold dihitung otomatis dari nominal.
//
// dampakGaleri  : foto-foto hasil kegiatan yang didanai dari donasi
//                 sebelumnya, ditampilkan di "Galeri Dampak Ekspedisi".
// ================================================================

const campaignData = [
    {
        id: "rinjani-2026",
        judul: "Ekspedisi Gunung Rinjani 2026",
        deskripsi: "Dana dipakai untuk transportasi tim, sewa perlengkapan teknis, logistik makan 5 hari perjalanan, dan izin resmi jalur pendakian.",
        target: 15000000,
        terkumpul: 8750000,
        deadline: "2026-10-15",
        gambar: "images/galeri/ekspedisi_rinjani.jpg"
    },
    {
        id: "diksar-litaniaram",
        judul: "Diksar Angkatan LITANIARAM",
        deskripsi: "Pendanaan untuk pendidikan dan latihan dasar anggota baru: pelatih tamu, sewa alat rock climbing, dan konsumsi selama 3 hari kegiatan.",
        target: 8000000,
        terkumpul: 3200000,
        deadline: "2026-09-20",
        gambar: "images/galeri/diksar.jpg"
    }
];

const merchCategories = [
    { key: 'all', label: 'Semua' },
    { key: 'pakaian', label: 'Pakaian' },
    { key: 'aksesoris', label: 'Aksesoris' }
];

const merchData = [
    {
        nama: "Kaos Mapatek Abhipraya",
        kategori: "pakaian",
        harga: 95000,
        gambar: "",
        deskripsi: "Kaos katun combed 30s, sablon logo depan-belakang, tersedia size S-XXL. Cocok dipakai harian maupun kegiatan lapangan.",
        varian: ["S", "M", "L", "XL", "XXL"],
        stok: null
    },
    {
        nama: "Hoodie Ekspedisi",
        kategori: "pakaian",
        harga: 175000,
        gambar: "",
        deskripsi: "Hoodie fleece tebal, hangat untuk aktivitas outdoor maupun santai. Bordir logo di dada kiri.",
        varian: ["M", "L", "XL"],
        stok: 4
    },
    {
        nama: "Gantungan Kunci Logo",
        kategori: "aksesoris",
        harga: 20000,
        gambar: "",
        deskripsi: "Gantungan kunci akrilik dengan cetakan logo Mapatek, tahan lama dan ringan dibawa.",
        varian: [],
        stok: null
    },
    {
        nama: "Buff / Masker Multifungsi",
        kategori: "aksesoris",
        harga: 35000,
        gambar: "",
        deskripsi: "Bahan scuba lembut, bisa dipakai sebagai masker, penutup kepala, atau syal saat pendakian.",
        varian: [],
        stok: null
    },
    {
        nama: "Topi Trucker Mapatek",
        kategori: "aksesoris",
        harga: 65000,
        gambar: "",
        deskripsi: "Topi trucker dengan bordir logo, adjustable strap, nyaman untuk aktivitas luar ruangan.",
        varian: [],
        stok: 3
    },
    {
        nama: "Stiker Set Mapatek (5 pcs)",
        kategori: "aksesoris",
        harga: 15000,
        gambar: "",
        deskripsi: "Set 5 stiker vinyl anti air dengan berbagai desain logo & quote alam Mapatek.",
        varian: [],
        stok: null
    }
];

// Nominal cepat untuk tombol "Donasi Cepat"
const donationTiers = [50000, 100000, 250000, 500000];

// Donatur yang SUDAH MENGIZINKAN namanya ditampilkan publik.
// Tingkat (Bronze < Rp100rb, Silver < Rp500rb, Gold >= Rp500rb) dihitung otomatis.
const donaturData = [
    { nama: "Anonim Baik Hati", jumlah: 750000 },
    { nama: "Hendra S.", jumlah: 500000 },
    { nama: "Keluarga Alumni PANCATOMPAK", jumlah: 300000 },
    { nama: "Rina W.", jumlah: 150000 },
    { nama: "Dimas P.", jumlah: 100000 },
    { nama: "Anggota Angkatan TAPAKKAKI", jumlah: 250000 },
    { nama: "Bu Sari (Wali Anggota)", jumlah: 200000 },
    { nama: "Fajar N.", jumlah: 50000 }
];

// Galeri hasil kegiatan yang didanai dari donasi sebelumnya
const dampakGaleri = [
    { gambar: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80", caption: "Ekspedisi Gunung Sumbing, didanai donasi 2025" },
    { gambar: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=80", caption: "Latihan Rock Climbing hasil pengadaan alat dari donasi" },
    { gambar: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80", caption: "Diksar angkatan TEDAKDAIVAT" },
    { gambar: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=700&q=80", caption: "Aksi konservasi & penanaman pohon" }
];

// FAQ seputar donasi & pembelian merchandise
const faqData = [
    { q: "Bagaimana cara memastikan donasi saya benar-benar sampai?", a: "Setiap donasi via transfer wajib dikonfirmasi ke WhatsApp admin dengan bukti transfer, lalu dicatat manual oleh bendahara sebelum progress bar campaign diperbarui." },
    { q: "Apakah donasi bisa untuk campaign tertentu saja?", a: "Bisa. Saat konfirmasi ke WhatsApp, sebutkan nama campaign yang dituju supaya dana dialokasikan sesuai keinginan kamu." },
    { q: "Berapa lama pesanan merchandise diproses?", a: "Setelah konfirmasi pembayaran, pesanan biasanya diproses 2-4 hari kerja sebelum dikirim atau bisa diambil langsung di sekretariat." },
    { q: "Apakah ada laporan penggunaan dana setelah ekspedisi selesai?", a: "Ya, laporan ringkas penggunaan dana akan dibagikan melalui Instagram organisasi dan disebutkan di halaman ini setelah kegiatan selesai." },
    { q: "Bisa donasi tanpa menyebutkan nama (anonim)?", a: "Tentu bisa. Cukup sampaikan ke admin saat konfirmasi kalau kamu ingin donasimu ditampilkan sebagai 'Anonim' di Wall of Fame." }
];

const WA_ADMIN_NUMBER = "6282214428371";

const BANK_INFO = {
    bank: "BRI — 1234-0123-4567-890",
    atasNama: "Mapatek Abhipraya UST"
};