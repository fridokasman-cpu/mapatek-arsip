// ================================================================
// DATA CAMPAIGN DONASI & MERCHANDISE — Silakan edit sesuai kondisi asli
// ================================================================

const campaignData = [
    {
        judul: "Ekspedisi Gunung Rinjani 2026",
        deskripsi: "Dana dipakai untuk transportasi tim, sewa perlengkapan teknis, logistik makan 5 hari perjalanan, dan izin resmi jalur pendakian.",
        target: 15000000,
        terkumpul: 8750000,
        gambar: "images/galeri/ekspedisi_rinjani.jpg"
    },
    {
        judul: "Diksar Angkatan LITANIARAM",
        deskripsi: "Pendanaan untuk pendidikan dan latihan dasar anggota baru: pelatih tamu, sewa alat rock climbing, dan konsumsi selama 3 hari kegiatan.",
        target: 8000000,
        terkumpul: 3200000,
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
        varian: ["S", "M", "L", "XL", "XXL"]
    },
    {
        nama: "Hoodie Ekspedisi",
        kategori: "pakaian",
        harga: 175000,
        gambar: "",
        deskripsi: "Hoodie fleece tebal, hangat untuk aktivitas outdoor maupun santai. Bordir logo di dada kiri.",
        varian: ["M", "L", "XL"]
    },
    {
        nama: "Gantungan Kunci Logo",
        kategori: "aksesoris",
        harga: 20000,
        gambar: "",
        deskripsi: "Gantungan kunci akrilik dengan cetakan logo Mapatek, tahan lama dan ringan dibawa.",
        varian: []
    },
    {
        nama: "Buff / Masker Multifungsi",
        kategori: "aksesoris",
        harga: 35000,
        gambar: "",
        deskripsi: "Bahan scuba lembut, bisa dipakai sebagai masker, penutup kepala, atau syal saat pendakian.",
        varian: []
    },
    {
        nama: "Topi Trucker Mapatek",
        kategori: "aksesoris",
        harga: 65000,
        gambar: "",
        deskripsi: "Topi trucker dengan bordir logo, adjustable strap, nyaman untuk aktivitas luar ruangan.",
        varian: []
    },
    {
        nama: "Stiker Set Mapatek (5 pcs)",
        kategori: "aksesoris",
        harga: 15000,
        gambar: "",
        deskripsi: "Set 5 stiker vinyl anti air dengan berbagai desain logo & quote alam Mapatek.",
        varian: []
    }
];

const WA_ADMIN_NUMBER = "6282214428371";
