// ================================================================
// DATA ALUMNI — Silakan edit/tambah sesuai data asli
// ----------------------------------------------------------------
// Setiap alumni adalah satu objek dengan field:
// - nama         : nama lengkap
// - angkatan     : nama angkatan (harus salah satu dari daftar ANGKATAN_LIST di bawah)
// - tahunLulus   : tahun kelulusan/keluar dari MAPATEK (isi null jika masih aktif)
// - foto         : path/URL foto (boleh dikosongkan "", nanti pakai inisial otomatis).
//                  Foto ini juga dipakai sebagai BACKGROUND kartu.
// - unggulan     : true/false — tampil di bagian "Alumni Pilihan" atas halaman
// - profesiSekarang : pekerjaan/kegiatan sekarang
// - lokasi       : kota/tempat kerja sekarang
// - testimoni    : kutipan singkat dari alumni tsb
// - noHp         : opsional, format "08xx..." — kalau diisi, muncul tombol
//                  "Sapa via WhatsApp" di kartu detail. Kosongkan "" jika tidak ada.
// - instagram / linkedin : opsional, kosongkan "" jika tidak ada.
//                  instagram cukup diisi username saja, contoh: "bagas.dwi"
// - album        : opsional, array URL foto aktivitas (dipakai di "Album Aktivitas 3D"
//                  dan galeri kartu ID). Kosongkan [] jika belum ada foto.
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
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
        unggulan: true,
        profesiSekarang: "Field Guide & Pemandu Ekspedisi Gunung",
        lokasi: "Yogyakarta",
        testimoni: "Mapatek ngajarin saya bukan cuma cara bertahan hidup di gunung, tapi juga cara mimpin tim di bawah tekanan. Sekarang skill itu jadi mata pencaharian saya sehari-hari.",
        noHp: "081234567801",
        instagram: "bagas.dwi",
        linkedin: "",
        album: [
            "https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=80",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80",
            "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=700&q=80"
        ]
    },
    {
        nama: "Ratna Kusuma Wardani",
        angkatan: "PANCATOMPAK",
        tahunLulus: 2024,
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
        unggulan: true,
        profesiSekarang: "Staff Konservasi, Balai Taman Nasional",
        lokasi: "Semarang",
        testimoni: "Pengalaman ikut aksi konservasi di Mapatek jadi alasan saya milih karir di bidang lingkungan. Rasanya seperti melanjutkan misi yang sama, cuma skalanya lebih besar.",
        noHp: "",
        instagram: "ratnakusuma",
        linkedin: "",
        album: [
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80",
            "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=700&q=80",
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=700&q=80"
        ]
    },
    {
        nama: "Fajar Nur Ihsan",
        angkatan: "TAPAKKAKI",
        tahunLulus: 2025,
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
        unggulan: false,
        profesiSekarang: "Software Engineer",
        lokasi: "Jakarta",
        testimoni: "Ekspedisi ngajarin saya problem-solving di kondisi serba terbatas — ternyata itu skill yang kepake banget waktu kerja jadi engineer. Gunung dan kode sama-sama butuh sabar.",
        noHp: "081234567802",
        instagram: "fajarnurihsan",
        linkedin: "",
        album: [
            "https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=700&q=80",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&q=80"
        ]
    },
    {
        nama: "Devina Ayu Lestari",
        angkatan: "TAPAKKAKI",
        tahunLulus: 2025,
        foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
        unggulan: false,
        profesiSekarang: "Guru & Relawan Pendidikan Lingkungan",
        lokasi: "Magelang",
        testimoni: "Sekarang saya sering bawa murid-murid saya untuk kegiatan alam terbuka. Semua terinspirasi dari kegiatan sosial dan penanaman pohon waktu masih aktif di Mapatek.",
        noHp: "",
        instagram: "devina.ayu",
        linkedin: "",
        album: [
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&q=80",
            "https://images.unsplash.com/photo-1472213984618-c79aaec00d1d?w=700&q=80",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&q=80"
        ]
    },
    {
        nama: "Yoga Pratama",
        angkatan: "TEDAKDAIVAT",
        tahunLulus: null,
        foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
        unggulan: false,
        profesiSekarang: "Masih aktif — Fokus riset jalur pendakian baru",
        lokasi: "Yogyakarta",
        testimoni: "Belum lulus, tapi sudah kebayang jejak yang mau saya tinggalkan buat angkatan setelah saya. Mapatek itu rumah kedua.",
        noHp: "",
        instagram: "",
        linkedin: "",
        album: [
            "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=700&q=80",
            "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=700&q=80"
        ]
    }
];