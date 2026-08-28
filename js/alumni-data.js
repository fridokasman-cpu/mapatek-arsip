// ================================================================
// DATA ALUMNI — Silakan edit/tambah sesuai data asli
// ----------------------------------------------------------------
// Setiap alumni adalah satu objek dengan field:
// - nama         : nama lengkap
// - angkatan     : nama angkatan (harus salah satu dari daftar ANGKATAN_LIST di bawah)
// - tahunLulus   : tahun kelulusan/keluar dari MAPATEK
// - foto         : path/URL foto (boleh dikosongkan "", nanti pakai foto default)
// - profesiSekarang : pekerjaan/kegiatan sekarang
// - lokasi       : kota/tempat kerja sekarang
// - testimoni    : kutipan singkat dari alumni tsb
// - instagram / linkedin : opsional, kosongkan "" kalau tidak ada
// ================================================================

const ANGKATAN_LIST = [
    { key: 'all', label: 'Semua Angkatan' },
    { key: 'PANCATOMPAK', label: '🌟 PANCATOMPAK (2023)' },
    { key: 'TAPAKKAKI', label: '👣 TAPAKKAKI (2024)' },
    { key: 'TEDAKDAIVAT', label: '⛰️ TEDAKDAIVAT (2025)' },
    { key: 'LITANIARAM', label: '🌿 LITANIARAM (2026)' }
];

const alumniData = [
    {
        nama: "Bagas Dwi Saputra",
        angkatan: "PANCATOMPAK",
        tahunLulus: 2024,
        foto: "",
        unggulan: true,
        profesiSekarang: "Field Guide & Pemandu Ekspedisi Gunung",
        lokasi: "Yogyakarta",
        testimoni: "Mapatek ngajarin saya bukan cuma cara bertahan hidup di gunung, tapi juga cara mimpin tim di bawah tekanan. Sekarang skill itu jadi mata pencaharian saya sehari-hari.",
        instagram: "",
        linkedin: ""
    },
    {
        nama: "Ratna Kusuma Wardani",
        angkatan: "PANCATOMPAK",
        tahunLulus: 2024,
        foto: "",
        unggulan: true,
        profesiSekarang: "Staff Konservasi, Balai Taman Nasional",
        lokasi: "Semarang",
        testimoni: "Pengalaman ikut aksi konservasi di Mapatek jadi alasan saya milih karir di bidang lingkungan. Rasanya seperti melanjutkan misi yang sama, cuma skalanya lebih besar.",
        instagram: "",
        linkedin: ""
    },
    {
        nama: "Fajar Nur Ihsan",
        angkatan: "TAPAKKAKI",
        tahunLulus: 2025,
        foto: "",
        profesiSekarang: "Software Engineer",
        lokasi: "Jakarta",
        testimoni: "Ekspedisi ngajarin saya problem-solving di kondisi serba terbatas — ternyata itu skill yang kepake banget waktu kerja jadi engineer. Gunung dan kode sama-sama butuh sabar.",
        instagram: "",
        linkedin: ""
    },
    {
        nama: "Devina Ayu Lestari",
        angkatan: "TAPAKKAKI",
        tahunLulus: 2025,
        foto: "",
        profesiSekarang: "Guru & Relawan Pendidikan Lingkungan",
        lokasi: "Magelang",
        testimoni: "Sekarang saya sering bawa murid-murid saya untuk kegiatan alam terbuka. Semua terinspirasi dari kegiatan sosial dan penanaman pohon waktu masih aktif di Mapatek.",
        instagram: "",
        linkedin: ""
    },
    {
        nama: "Yoga Pratama",
        angkatan: "TEDAKDAIVAT",
        tahunLulus: null,
        foto: "",
        profesiSekarang: "Masih aktif — Fokus riset jalur pendakian baru",
        lokasi: "Yogyakarta",
        testimoni: "Belum lulus, tapi sudah kebayang jejak yang mau saya tinggalkan buat angkatan setelah saya. Mapatek itu rumah kedua.",
        instagram: "",
        linkedin: ""
    }
];