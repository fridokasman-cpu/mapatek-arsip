// ================================================================
// DATA STATIS — Semua konten dinamis diambil dari sini
// ================================================================

// -------------------- AGENDA --------------------
// Data Agenda dengan tanggal lengkap
const agendas = [
    { 
        date: "2026-07-18",
        day: "18",
        month: "JUL",
        title: "Pendakian Gunung Sumbing",
        location: "Wonosobo, Jawa Tengah",
        desc: "Ekspedisi puncak 3.371 mdpl via jalur Garung",
        status: "upcoming"
    },
    { 
        date: "2026-07-25",
        day: "25",
        month: "JUL",
        title: "Rock Climbing Tebing Gamping",
        location: "Gamping, Yogyakarta",
        desc: "Latihan panjat tebing alam dengan rute baru",
        status: "upcoming"
    },
    { 
        date: "2026-08-01",
        day: "01",
        month: "AGS",
        title: "Rafting Sungai Elo",
        location: "Magelang, Jawa Tengah",
        desc: "Arung jeram kelas II-III sepanjang 12 km",
        status: "upcoming"
    },
    { 
        date: "2026-08-08",
        day: "08",
        month: "AGS",
        title: "Pendakian Gunung Merbabu",
        location: "Boyolali, Jawa Tengah",
        desc: "Pendakian puncak 3.145 mdpl via jalur Selo",
        status: "upcoming"
    },
    { 
        date: "2026-08-15",
        day: "15",
        month: "AGS",
        title: "Rock Climbing Gunung Kidul",
        location: "Gunung Kidul, Yogyakarta",
        desc: "Panjat tebing karst di pantai selatan",
        status: "upcoming"
    },
    { 
        date: "2026-08-22",
        day: "22",
        month: "AGS",
        title: "Rafting Sungai Progo",
        location: "Kulon Progo, Yogyakarta",
        desc: "Arung jeram kelas III dengan pemandangan alam",
        status: "upcoming"
    },
    { 
        date: "2026-08-29",
        day: "29",
        month: "AGS",
        title: "Pendakian Gunung Rinjani",
        location: "Lombok, NTB",
        desc: "Ekspedisi puncak 3.726 mdpl & Danau Segara Anak",
        status: "upcoming"
    },
    { 
        date: "2026-09-05",
        day: "05",
        month: "SEP",
        title: "Rock Climbing Parangtritis",
        location: "Bantul, Yogyakarta",
        desc: "Panjat tebing tebing pasir dan karst",
        status: "upcoming"
    },
    { 
        date: "2026-09-12",
        day: "12",
        month: "SEP",
        title: "Rafting Sungai Citumang",
        location: "Ciamis, Jawa Barat",
        desc: "Arung jeram kelas II dengan air jernih",
        status: "upcoming"
    },
    { 
        date: "2026-09-19",
        day: "19",
        month: "SEP",
        title: "Pendakian Gunung Semeru",
        location: "Lumajang, Jawa Timur",
        desc: "Pendakian puncak Mahameru (3.676 mdpl) via Ranupane",
        status: "upcoming"
    }
];

// -------------------- GALERI --------------------
const galeriImages = [
    { src: "images/galeri/ekspedisi_rinjani.jpg", caption: "Pelantikan Angkatan Tedak Daivat" },
    { src: "images/galeri/diksar.jpg", caption: "Pelantikan Angkatan Tedak Daivat" },
    { src: "images/galeri/rock_climbing.jpg", caption: "Pendidikan Rock Climbing Angkatan Tedak Daivat" },
    { src: "images/galeri/baksos.jpg", caption: "Bakti Sosial Bersih Pantai Baros" },
    { src: "images/galeri/navigasi.jpg", caption: "Pelantikan Angkatan Tedak Daivat" },
    { src: "images/galeri/pendidikanrc.jpg", caption: "Pendidikan Rock Climbing Angkatan Litani Aram" },
    { src: "images/galeri/konservasi.jpg", caption: "Pelantikan Angkatan Tedak Daivat" },
    { src: "images/galeri/latihanascend.jpg", caption: "Latihan Ascending" },
    { src: "images/galeri/diksarlitaniaram.jpg", caption: "Diksar Angkatan Litani Aram" },
    { src: "images/galeri/keluargabesar.jpg", caption: "Wisuda Angkatan Pendiri" },
    { src: "images/galeri/Impk.jpg", caption: "Dikjut Gunung Hutan Angkatan Litani Aram" },
    { src: "images/galeri/Impk2.jpg", caption: "Dikjut Gunung Hutan Angkatan Litani Aram" },
    { src: "images/galeri/LatihanRC.jpg", caption: "Latihan RC" }
];

// -------------------- TESTIMONI --------------------
const testimoniData = [
    { name: "Ndolo", angkatan: "Angkatan 2 Tedak Daivat (2025)", photo: "images/testimoni/ndolo.jpg", quote: "Mapatek bukan sekadar organisasi, tapi keluarga kedua. Di sini saya belajar arti kebersamaan, kepemimpinan, dan cinta alam yang sesungguhnya." },
    { name: "Ringin", angkatan: "Angkatan 2 TedakDaivat (2025)", photo: "images/testimoni/ringin.jpg", quote: "Pengalaman Diksar yang luar biasa! Meskipun berat, tapi itulah yang membentuk mental saya. Terima kasih Mapatek atas semua ilmunya." },
    { name: "Coil", angkatan: "Angkatan Pendiri PancaTompak (2023)", photo: "images/testimoni/coil.jpg", quote: "Sebagai angkatan pendiri, melihat Mapatek berkembang seperti ini adalah kebanggaan tersendiri. Semoga terus jaya dan bermanfaat!" },
    { name: "Lamen", angkatan: "Angkatan 1 Tapak Kaki (2024)", photo: "images/testimoni/lamen.jpg", quote: "Baru bergabung tapi sudah merasa seperti di rumah sendiri. Kakak-kakak senior sangat welcoming dan ilmu yang didapat sangat berharga." },
    { name: "Sam", angkatan: "Angkatan 2 Tedak Daivat (2025)", photo: "images/testimoni/sam.jpg", quote: "Ekspedisi bersama Mapatek adalah pengalaman tak terlupakan. Puncak gunung bukan tujuan utama, tapi proses perjalanannya yang paling berkesan." }
];

// -------------------- LEADERBOARD --------------------
const leaderboardData = [
    { name: "Coil", angkatan: "Panca Tompak", peaks: 15, points: 4500, photo: "images/leaderboard/coil.jpg" },
    { name: "Lamen", angkatan: "Tapak Kaki", peaks: 12, points: 3600, photo: "images/leaderboard/lamen.jpg" },
    { name: "Ringin", angkatan: "Tedak Daivat", peaks: 10, points: 3000, photo: "images/leaderboard/siti-aisyah.jpg" },
    { name: "Sanpas", angkatan: "Tapak Kaki", peaks: 8, points: 2400, photo: "images/leaderboard/budi-santoso.jpg" },
    { name: "Ranga", angkatan: "Litani Aram", peaks: 7, points: 2100, photo: "images/leaderboard/machmud-lathif.jpg" },
    { name: "Lowo", angkatan: "Litani Aram", peaks: 6, points: 1800, photo: "images/leaderboard/dewi-lestari.jpg" },
    { name: "Mauna", angkatan: "Tedak Daivat", peaks: 5, points: 1500, photo: "images/leaderboard/rangga-wijaya.jpg" },
    { name: "Lamase", angkatan: "Tedak Daivat", peaks: 4, points: 1200, photo: "images/leaderboard/putri-robet.jpg" }
];

// -------------------- POLLING --------------------
const pollingData = [
    { id: 1, text: "🏔️ Gunung Semeru (3.676 mdpl)", votes: 45 },
    { id: 2, text: "⛰️ Gunung Rinjani (3.726 mdpl)", votes: 38 },
    { id: 3, text: "🗻 Gunung Merbabu (3.145 mdpl)", votes: 29 },
    { id: 4, text: "🌋 Gunung Bromo (2.329 mdpl)", votes: 22 },
    { id: 5, text: "🏞️ Gunung Prau (2.590 mdpl)", votes: 18 }
];

// -------------------- CUACA (API & DAFTAR GUNUNG) --------------------
const API_KEY = '41cdf78032a3fc2031fcdc09192f0f19';

const gunungList = [
    { name: "Gunung Merapi", lat: -7.5435, lon: 110.4451, loc: "Yogyakarta" },
    { name: "Gunung Merbabu", lat: -7.4517, lon: 110.4328, loc: "Jawa Tengah" },
    { name: "Gunung Sindoro", lat: -7.3089, lon: 109.9056, loc: "Jawa Tengah" },
    { name: "Gunung Slamet", lat: -7.2500, lon: 109.2083, loc: "Jawa Tengah" },
    { name: "Gunung Semeru", lat: -8.1083, lon: 112.9222, loc: "Jawa Timur" },
    { name: "Gunung Rinjani", lat: -8.4200, lon: 116.4700, loc: "NTB" }
];

// -------------------- PETA LOKASI --------------------
const petaLocations = [
    { name: "Basecamp Mapatek Abhipraya", lat: -7.8005941, lng: 110.3878006, type: "basecamp", desc: "🏛️ Sekretariat di UST Yogyakarta<br>Fakultas Teknik - UST" },
    { name: "Gunung Sumbing", lat: -7.3408, lng: 110.0703, type: "gunung", desc: "⛰️ Puncak 3.371 mdpl<br>Wonosobo, Jawa Tengah" },
    { name: "Gunung Sindoro", lat: -7.3056, lng: 110.0028, type: "gunung", desc: "⛰️ Puncak 3.153 mdpl<br>Wonosobo, Jawa Tengah" },
    { name: "Gunung Merbabu", lat: -7.4500, lng: 110.4333, type: "gunung", desc: "⛰️ Puncak 3.145 mdpl<br>Boyolali/Magelang" },
    { name: "Gunung Prau", lat: -7.1458, lng: 109.9208, type: "gunung", desc: "⛰️ Puncak 2.590 mdpl<br>Dieng Plateau" },
    { name: "Gunung Lawu", lat: -7.6250, lng: 111.1917, type: "gunung", desc: "⛰️ Puncak 3.265 mdpl<br>Jawa Tengah/Jawa Timur" },
    { name: "Gunung Rinjani", lat: -8.4250, lng: 116.4583, type: "gunung", desc: "⛰️ Puncak 3.726 mdpl<br>Lombok, NTB" },
    { name: "Gunung Semeru", lat: -8.1083, lng: 112.9217, type: "gunung", desc: "⛰️ Puncak 3.676 mdpl<br>Jawa Timur" },
    { name: "Gunung Kerinci", lat: -1.6972, lng: 101.2639, type: "gunung", desc: "⛰️ Puncak 3.805 mdpl<br>Sumatera" },
    { name: "Gunung Raung", lat: -8.1250, lng: 114.0417, type: "gunung", desc: "⛰️ Puncak 3.332 mdpl<br>Jawa Timur/Bali" },
    { name: "Gunung Slamet", lat: -7.2458, lng: 109.2083, type: "gunung", desc: "⛰️ Puncak 3.428 mdpl<br>Jawa Tengah" },
    { name: "Lokasi Konservasi 1", lat: -7.7956, lng: 110.3692, type: "konservasi", desc: "🌱 Kegiatan konservasi lingkungan Mapatek" },
    { name: "Lokasi Konservasi 2", lat: -7.8500, lng: 110.4200, type: "konservasi", desc: "🌿 Program pelestarian alam" },
    { name: "Lokasi Konservasi 3", lat: -7.7800, lng: 110.4000, type: "konservasi", desc: "🌳 Aksi konservasi & edukasi" }
];

// -------------------- BERITA --------------------
const beritaData = [
    { category: "Pengumuman", title: "Berita Terbaru!", excerpt: "Berita Seputar UST", date: "5 Juni 2026", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop" },
];

// -------------------- KALENDER EVENT --------------------
const kalenderEvents = [
    { date: "2026-06-08", title: "Latihan Navigasi", type: "latihan" },
    { date: "2026-06-15", title: "Ekspedisi Prau", type: "ekspedisi" },
    { date: "2026-06-22", title: "Rock Climbing", type: "latihan" },
    { date: "2026-06-28", title: "Rapat Pengurus", type: "latihan" },
    { date: "2026-07-05", title: "Bakti Sosial", type: "konservasi" },
    { date: "2026-07-11", title: "Ekspedisi Gunung Rinjani", type: "ekspedisi" },
    { date: "2026-07-24", title: "Latihan Survival", type: "latihan" },
    { date: "2026-07-20", title: "Pendakian Merbabu", type: "ekspedisi" },
    { date: "2026-03-19", title: "Ulang Tahun Mapatek", type: "latihan" }
];

// -------------------- FAQ --------------------
const faqData = [
    { q: "Apa itu Mapatek Abhipraya?", a: "Mapatek Abhipraya adalah organisasi mahasiswa pencinta alam yang berdiri pada 19 Maret 2023 di Universitas Sarjanawiyata Tamansiswa (UST) Yogyakarta. Kami bergerak di bidang konservasi lingkungan, pendidikan alam bebas, kegiatan petualangan, dan kemanusiaan." },
    { q: "Bagaimana cara bergabung dengan Mapatek?", a: "Untuk bergabung, kamu harus mahasiswa aktif UST dan mengikuti rangkaian Diksar (Pendidikan Dasar) yang biasanya dibuka 2x setahun. Cek status pendaftaran di website ini atau hubungi admin via WhatsApp di 0822-1442-8371." },
    { q: "Apa saja kegiatan rutin Mapatek?", a: "Kegiatan rutin kami meliputi: Latihan rutin (navigasi, rock climbing, survival), ekspedisi pendakian gunung, bakti sosial & konservasi lingkungan, pendidikan dasar (Diksar), dan berbagai pelatihan skill kealaman lainnya." },
    { q: "Apakah ada biaya untuk bergabung?", a: "Terdapat biaya pendaftaran dan biaya Diksar yang bervariasi tergantung kebutuhan kegiatan. Biaya sudah termasuk akomodasi, konsumsi, perlengkapan, dan merchandise Mapatek. Informasi detail akan diberikan saat pendaftaran dibuka." },
    { q: "Apa syarat mengikuti Diksar?", a: "Syarat utama: (1) Mahasiswa aktif UST, (2) Sehat jasmani dan rohani, (3) Bersedia mengikuti seluruh rangkaian Diksar, (4) Mengisi formulir pendaftaran, (5) Lolos wawancara seleksi, dan (6) Membayar biaya pendaftaran." },
    { q: "Dimana lokasi basecamp Mapatek?", a: "Basecamp/sekretariat Mapatek Abhipraya berada di lingkungan Fakultas Teknik Universitas Sarjanawiyata Tamansiswa (UST), Muja Muju, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55165 Buka Senin-sabtu 08.00-22.00 WIB." },
    { q: "Apakah perempuan boleh bergabung?", a: "Tentu saja! Mapatek Abhipraya terbuka untuk semua mahasiswa UST tanpa membedakan gender. Banyak anggota perempuan kami yang aktif dan berprestasi di berbagai kegiatan." },
    { q: "Bagaimana jika saya pemula dan belum punya pengalaman?", a: "Tidak masalah! Diksar kami dirancang untuk semua level, dari pemula hingga berpengalaman. Kamu akan diajarkan semua skill dasar dari nol oleh senior yang sudah berpengalaman." }
];

// -------------------- QUIZ --------------------
const quizQuestions = [
    { q: "Apa yang paling kamu cari dari kegiatan pendakian?", options: [ { text: "Tantangan fisik dan adrenalin", type: "petualang" }, { text: "Ketenangan dan meditasi di alam", type: "kontemplatif" }, { text: "Menjaga kelestarian alam", type: "konservasionis" }, { text: "Bertemu dan belajar dari orang baru", type: "sosial" } ] },
    { q: "Saat berkemah, apa yang paling kamu nikmati?", options: [ { text: "Api unggun dan cerita petualangan", type: "sosial" }, { text: "Menatap bintang di malam hari", type: "kontemplatif" }, { text: "Memasak bersama di alam terbuka", type: "petualang" }, { text: "Mengamati flora dan fauna sekitar", type: "konservasionis" } ] },
    { q: "Perlengkapan mana yang paling penting menurutmu?", options: [ { text: "Peta dan kompas untuk navigasi", type: "petualang" }, { text: "Kantong sampah untuk bawa turun sampah", type: "konservasionis" }, { text: "Kamera untuk dokumentasi", type: "sosial" }, { text: "Buku catatan untuk jurnal perjalanan", type: "kontemplatif" } ] },
    { q: "Jika bertemu sampah di jalur pendakian, kamu akan?", options: [ { text: "Pungut dan bawa turun, meski bukan sampahku", type: "konservasionis" }, { text: "Laporkan ke pengelola gunung", type: "sosial" }, { text: "Terus mendaki, fokus ke tujuan", type: "petualang" }, { text: "Dokumentasikan untuk edukasi", type: "kontemplatif" } ] },
    { q: "Apa motivasi utamamu mengikuti kegiatan alam?", options: [ { text: "Menaklukkan puncak-puncak baru", type: "petualang" }, { text: "Melestarikan alam untuk generasi depan", type: "konservasionis" }, { text: "Membangun relasi dan persaudaraan", type: "sosial" }, { text: "Menemukan jati diri di alam", type: "kontemplatif" } ] }
];

const quizResults = {
    petualang: { icon: "🏔️", type: "The Adventurer — Si Petualang Sejati", desc: "Kamu adalah tipe pendaki yang selalu mencari tantangan dan adrenalin! Puncak-puncak tinggi dan jalur ekstrem adalah playground-mu. Kamu berani mengambil risiko dan selalu ingin mencoba hal baru. Semangat petualangmu menginspirasi orang di sekitarmu!" },
    konservasionis: { icon: "🌿", type: "The Guardian — Penjaga Alam", desc: "Kamu adalah tipe pendaki yang sangat peduli terhadap kelestarian alam! Bagimu, gunung bukan hanya tempat untuk ditaklukkan, tapi ekosistem yang harus dilindungi. Prinsip Leave No Trace adalah pedoman hidupmu. Kamu adalah pahlawan bagi alam!" },
    kontemplatif: { icon: "🌌", type: "The Philosopher — Sang Perenung", desc: "Kamu adalah tipe pendaki yang mencari makna dan kedamaian di alam! Setiap langkah pendakian adalah meditasi bagimu. Kamu suka mengamati keindahan alam, merenung di puncak, dan menulis jurnal perjalanan. Alam adalah guru terbesarmu!" },
    sosial: { icon: "🤝", type: "The Connector — Penghubung Hati", desc: "Kamu adalah tipe pendaki yang paling menikmati kebersamaan! Bagimu, siapa yang mendaki lebih penting daripada ke mana mendaki. Kamu selalu ceria, mudah bergaul, dan menjadi lem yang menyatukan tim. Energi positipmu menular ke semua orang!" }
};

// -------------------- SEARCH GLOBAL --------------------
const searchData = [
    { title: "Tentang Mapatek Abhipraya", category: "Informasi", icon: "fa-info-circle", section: "#tentang" },
    { title: "Struktur Pengurus", category: "Informasi", icon: "fa-users", section: "#pengurus" },
    { title: "Agenda Kegiatan", category: "Kegiatan", icon: "fa-calendar", section: "#agenda" },
    { title: "Galeri Foto", category: "Media", icon: "fa-images", section: "#galeri" },
    { title: "Quiz Kepribadian Pendaki", category: "Interaktif", icon: "fa-question-circle", section: "#quiz" },
    { title: "Berita & Pengumuman", category: "Informasi", icon: "fa-newspaper", section: "#berita" },
    { title: "Pendaftaran Anggota", category: "Pendaftaran", icon: "fa-user-plus", section: "#pendaftaran" },
    { title: "Arsip Dokumen", category: "Dokumen", icon: "fa-folder", section: "#arsip" },
    { title: "Kontak Kami", category: "Kontak", icon: "fa-phone", section: "#kontak" },
    { title: "Laporan Ekspedisi Gunung Rinjani", category: "Arsip", icon: "fa-file-pdf", section: "#arsip" },
    { title: "AD/ART Mapatek", category: "Arsip", icon: "fa-file-pdf", section: "#arsip" },
    { title: "WhatsApp Admin", category: "Kontak", icon: "fa-whatsapp", section: "#kontak" },
    { title: "Instagram Mapatek", category: "Kontak", icon: "fa-instagram", section: "#kontak" },
    { title: "FAQ Pertanyaan Umum", category: "Informasi", icon: "fa-question", section: ".faq-section" },
    { title: "Leaderboard Pendakian", category: "Interaktif", icon: "fa-trophy", section: ".leaderboard-section" },
    { title: "Info Cuaca Gunung", category: "Informasi", icon: "fa-cloud-sun", section: ".cuaca-section" },
    { title: "Peta Lokasi Kegiatan", category: "Informasi", icon: "fa-map", section: ".peta-section" },
    { title: "Kalender Kegiatan", category: "Kegiatan", icon: "fa-calendar-alt", section: ".kalender-section" }
];
// ==================== VIDEO TUTORIAL ====================
const tutorialVideos = [
    {
        id: 1,
        title: "Cara Membaca Peta Topografi untuk Pendaki Pemula",
        channel: "Wanadri Official",
        duration: "8:37",
        youtubeId: "a7cOCs4nfEA", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/a7cOCs4nfEA/mqdefault.jpg",
        category: "Navigasi",
        desc: "Pelajari dasar-dasar membaca peta topografi dan kontur untuk navigasi di gunung."
    },
    {
        id: 2,
        title: "Teknik Survival Dasar di Hutan: Membuat Shelter",
        channel: "Umar arf",
        duration: "8:20",
        youtubeId: "64-4YB8OqcU", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/64-4YB8OqcU/mqdefault.jpg",
        category: "Survival",
        desc: "Cara membuat shelter darurat dari bahan alami di hutan dengan cepat."
    },
    {
        id: 3,
        title: "8 Simpul Wajib untuk Pendaki dan Pemanjat Tebing",
        channel: "warnabamatv",
        duration: "15:45",
        youtubeId: "6b3DW4nmFvw", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/6b3DW4nmFvw/mqdefault.jpg",
        category: "Teknik",
        desc: "Simpul-simpul dasar yang harus dikuasai oleh setiap pecinta alam."
    },
    {
        id: 4,
        title: "P3K di Alam Liar: Mengatasi Hipotermia dan Cedera",
        channel: "PETUALANGAN EIGER",
        duration: "10:15",
        youtubeId: "aJ8aRGWuZ38", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/aJ8aRGWuZ38/mqdefault.jpg",
        category: "Kesehatan",
        desc: "Penanganan pertama pada kecelakaan di gunung dan cara mencegah hipotermia."
    },
    {
        id: 5,
        title: "Navigasi Gunung: Cara Menggunakan Kompas & Azimuth",
        channel: "PENGGEMAR NAVIGASI DARAT",
        duration: "18:00",
        youtubeId: "X_HVm9wIbh4", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/X_HVm9wIbh4/mqdefault.jpg",
        category: "Navigasi",
        desc: "Panduan praktis menggunakan kompas dan teknik azimuth untuk pendakian."
    },
    {
        id: 6,
        title: "Packing Carrier yang Benar untuk Pendakian 3 Hari",
        channel: "Mapatek Channel",
        duration: "9:50",
        youtubeId: "6fCzLsDOrnY", // ✅ ID VIDEO yang benar
        thumbnail: "https://img.youtube.com/vi/6fCzLsDOrnY/mqdefault.jpg",
        category: "Persiapan",
        desc: "Teknik packing carrier agar beban terasa ringan dan aman saat mendaki."
    }
];

// Ekspor ke global
window.tutorialVideos = tutorialVideos;
// Ekspor ke global
window.tutorialVideos = tutorialVideos;
// Ekspor variabel ke global (untuk digunakan di file lain)
(function() {
    window.agendas = agendas;
    window.galeriImages = galeriImages;
    window.testimoniData = testimoniData;
    window.leaderboardData = leaderboardData;
    window.pollingData = pollingData;
    window.API_KEY = API_KEY;
    window.gunungList = gunungList;
    window.petaLocations = petaLocations;
    window.beritaData = beritaData;
    window.kalenderEvents = kalenderEvents;
    window.faqData = faqData;
    window.quizQuestions = quizQuestions;
    window.quizResults = quizResults;
    window.searchData = searchData;
    window.statsData = {}; // <-- FIX: Ekspor langsung tanpa var di dalam
})();