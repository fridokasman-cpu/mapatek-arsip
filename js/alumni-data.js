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
//
// 🔌 SUMBER DATA DARI GOOGLE SHEETS (opsional)
// ----------------------------------------------------------------
// Supaya pengurus bisa update data alumni tanpa sentuh kode, halaman ini
// bisa mengambil data dari Google Sheets yang di-publish sebagai CSV.
//
// CARA SETUP:
// 1. Buat Google Sheet dengan baris header PERSIS:
//    nama, angkatan, tahunLulus, foto, unggulan, profesiSekarang, lokasi,
//    testimoni, noHp, instagram, linkedin, album
//    (kolom "album" diisi beberapa URL dipisah " | ", bukan koma)
// 2. File > Share > Publish to web > pilih sheet > format CSV > Publish
// 3. Tempel link CSV yang muncul ke SHEET_CSV_URL di bawah ini
// 4. Pastikan akses sheet minimal "Anyone with the link can view"
//
// Selama SHEET_CSV_URL masih kosong (""), website otomatis memakai data
// contoh (alumniDataFallback) di bawah — halaman TIDAK PERNAH kosong,
// bahkan kalau fetch ke Sheets gagal (offline, link salah, dsb).
// ================================================================

const SHEET_CSV_URL = ""; // <-- tempel link "Publish to web" (CSV) di sini

const ANGKATAN_LIST = [
    { key: 'all', label: 'Semua Angkatan' },
    { key: 'PANCATOMPAK', label: '🌟 PANCATOMPAK (2023)' },
    { key: 'TAPAKKAKI', label: '👣 TAPAKKAKI (2024)' },
    { key: 'TEDAKDAIVAT', label: '⛰️ TEDAKDAIVAT (2025)' },
    { key: 'LITANIARAM', label: '🌿 LITANIARAM (2026)' }
];

// Data contoh/fallback — dipakai kalau SHEET_CSV_URL kosong atau fetch gagal
const alumniDataFallback = [
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

// `alumniData` inilah yang dipakai oleh alumni.js. Awalnya diisi fallback
// supaya halaman langsung tampil, lalu ditimpa oleh data Google Sheets
// (kalau SHEET_CSV_URL diisi dan fetch berhasil) sebelum render() dipanggil.
let alumniData = alumniDataFallback.slice();

// ================================================================
// PARSER CSV RINGAN — cukup untuk kebutuhan Google Sheets publish-to-web
// (menangani field yang dibungkus tanda kutip karena mengandung koma)
// ================================================================
function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (char === '"' && next === '"') { field += '"'; i++; }
            else if (char === '"') { inQuotes = false; }
            else { field += char; }
        } else {
            if (char === '"') inQuotes = true;
            else if (char === ',') { row.push(field); field = ''; }
            else if (char === '\n' || char === '\r') {
                if (char === '\r' && next === '\n') i++;
                row.push(field); field = '';
                if (row.some(function (c) { return c.trim() !== ''; })) rows.push(row);
                row = [];
            } else { field += char; }
        }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
}

function csvRowsToAlumni(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map(function (h) { return h.trim(); });

    return rows.slice(1).filter(function (r) {
        return r.some(function (c) { return c.trim() !== ''; });
    }).map(function (r) {
        const obj = {};
        headers.forEach(function (h, i) { obj[h] = (r[i] || '').trim(); });

        return {
            nama: obj.nama || 'Tanpa Nama',
            angkatan: obj.angkatan || 'PANCATOMPAK',
            tahunLulus: obj.tahunLulus ? parseInt(obj.tahunLulus, 10) : null,
            foto: obj.foto || '',
            unggulan: String(obj.unggulan).toLowerCase() === 'true',
            profesiSekarang: obj.profesiSekarang || '',
            lokasi: obj.lokasi || '',
            testimoni: obj.testimoni || '',
            noHp: obj.noHp || '',
            instagram: obj.instagram || '',
            linkedin: obj.linkedin || '',
            album: obj.album ? obj.album.split('|').map(function (u) { return u.trim(); }).filter(Boolean) : []
        };
    });
}

// Promise yang ditunggu oleh alumni.js sebelum merender halaman.
// Selalu resolve (tidak pernah reject) supaya halaman tetap jalan walau
// Google Sheets gagal diakses.
const MAPATEK_DATA_READY = (async function loadAlumniFromSheet() {
    if (!SHEET_CSV_URL) return; // tetap pakai fallback

    try {
        const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const parsed = csvRowsToAlumni(parseCsv(text));
        if (parsed.length > 0) {
            alumniData = parsed;
            console.info('[Mapatek] Data alumni dimuat dari Google Sheets (' + parsed.length + ' alumni).');
        }
    } catch (err) {
        console.warn('[Mapatek] Gagal memuat data dari Google Sheets, memakai data fallback.', err);
    }
})();