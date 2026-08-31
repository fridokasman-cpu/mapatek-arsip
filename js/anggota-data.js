// ================================================================
// DATA ANGGOTA — Silakan edit/tambah sesuai data asli
// ----------------------------------------------------------------
// Setiap anggota adalah satu objek dengan field:
// - namaLengkap    : nama lengkap resmi
// - namaLapangan   : nama panggilan/nama lapangan saat ekspedisi
// - nim             : NIM/NIK (otomatis disamarkan sebagian di tampilan publik)
// - angkatan        : harus salah satu key di ANGKATAN_LIST_DA
// - divisi          : harus salah satu key di DIVISI_LIST
// - jabatan         : jabatan struktural, contoh "Ketua Umum", "Anggota"
// - status          : "Aktif" | "Cuti" | "Purna Tugas"
// - foto            : URL foto (boleh "", nanti pakai inisial otomatis)
// - noHp            : dipakai untuk tombol WhatsApp (nomor TIDAK pernah
//                      ditampilkan mentah ke publik, hanya jadi link)
// - tanggalBergabung: format "YYYY-MM-DD"
// - tanggalLahir    : format "YYYY-MM-DD", kosongkan "" kalau belum ada
//                      datanya (widget ulang tahun otomatis melewati
//                      anggota yang field ini kosong)
// - jumlahKegiatan  : jumlah ekspedisi/kegiatan yang pernah diikuti
// ================================================================
//
// 🔌 SUMBER DATA DARI GOOGLE SHEETS (opsional) — pola sama seperti
// alumni-data.js. Kosongkan SHEET_CSV_URL untuk pakai data contoh di bawah.
// Header kolom yang wajib ada di Sheet:
// namaLengkap, namaLapangan, nim, angkatan, divisi, jabatan, status, foto,
// noHp, tanggalBergabung, tanggalLahir, jumlahKegiatan
// ================================================================

const SHEET_CSV_URL_DA = ""; // <-- tempel link "Publish to web" (CSV) di sini

const ANGKATAN_LIST_DA = [
    { key: 'all', label: 'Semua Angkatan' },
    { key: 'PANCATOMPAK', label: '🌟 PANCATOMPAK (2023)' },
    { key: 'TAPAKKAKI', label: '👣 TAPAKKAKI (2024)' },
    { key: 'TEDAKDAIVAT', label: '⛰️ TEDAKDAIVAT (2025)' },
    { key: 'LITANIARAM', label: '🌿 LITANIARAM (2026)' }
];

// Catatan: "LAPANGAN" ditambahkan khusus untuk koordinator/tim
// Rock Climbing & Gunung Hutan — kategori teknis lapangan yang
// sebelumnya belum punya wadah divisi tersendiri.
const DIVISI_LIST = [
    { key: 'all', label: 'Semua Divisi' },
    { key: 'INTI', label: '🏛️ Pengurus Harian' },
    { key: 'LAPANGAN', label: '🧗 Lapangan (Gunung & Rock Climbing)' },
    { key: 'KONSERVASI', label: '🌱 Konservasi & Lingkungan' },
    { key: 'DIKLAT', label: '🎒 Diklat & SDM' },
    { key: 'HUMAS', label: '📣 Humas & Media' },
    { key: 'LOGISTIK', label: '🎒 Logistik & Perlengkapan' },
    { key: 'UMUM', label: '🧑\u200d🤝\u200d🧑 Anggota Umum' }
];

const STATUS_LIST = ['Aktif', 'Cuti', 'Purna Tugas'];

// ================================================================
// DATA ASLI PENGURUS — hasil update dari data resmi organisasi.
// Field tanggalBergabung, tanggalLahir, dan jumlahKegiatan BELUM ada
// datanya yang pasti — masih diisi nilai sementara (placeholder),
// tolong disesuaikan dengan data sebenarnya kalau sudah tersedia.
// ================================================================
const anggotaDataFallback = [
    {
        namaLengkap: "Machmud Chabibul Lathif",
        namaLapangan: "Ndolo",
        nim: "2024018064",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Ketua Umum",
        status: "Aktif",
        foto: "images/pengurus/ketua.jpg",
        noHp: "085952824898",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Putri Robet",
        namaLapangan: "Mauna",
        nim: "2024018007",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Sekretaris Jenderal",
        status: "Aktif",
        foto: "images/pengurus/sekretaris.jpg",
        noHp: "081522723325",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Tsye Dayana Knyartutu",
        namaLapangan: "Ceci",
        nim: "2024018006",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Sekretaris Wakil",
        status: "Aktif",
        foto: "images/pengurus/sekretariswakil.jpg",
        noHp: "085343835369",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Rosa Bandatia",
        namaLapangan: "Gale",
        nim: "2024018028",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Bendahara 1",
        status: "Aktif",
        foto: "images/pengurus/bendahara.jpg",
        noHp: "082249858268",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Tresia Utami Sulensi",
        namaLapangan: "Taras",
        nim: "2024013058",
        angkatan: "TEDAKDAIVAT",
        divisi: "LAPANGAN",
        jabatan: "Koordinator Rock Climbing",
        status: "Aktif",
        foto: "images/pengurus/rockclimbing.jpg",
        noHp: "085822450087",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Muhammad Musfian Sutrawardi",
        namaLapangan: "Ringin",
        nim: "2023013044",
        angkatan: "TEDAKDAIVAT",
        divisi: "LAPANGAN",
        jabatan: "Koordinator Gunung Hutan",
        status: "Aktif",
        foto: "images/pengurus/gununghutan.jpg",
        noHp: "085398717626",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Muhamad Amrullah",
        namaLapangan: "Sero",
        nim: "2024012021",
        angkatan: "TEDAKDAIVAT",
        divisi: "LAPANGAN",
        jabatan: "Tim Gunung Hutan",
        status: "Aktif",
        foto: "images/pengurus/timgununghutan.jpg",
        noHp: "085659543192",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Gahar Albani Rasyid",
        namaLapangan: "Ringgas",
        nim: "2024019012",
        angkatan: "TEDAKDAIVAT",
        divisi: "LOGISTIK",
        jabatan: "Koordinator Logistik",
        status: "Aktif",
        foto: "images/pengurus/logistik.jpg",
        noHp: "082338021599",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Fridolinus Jeri Kasman",
        namaLapangan: "Sam",
        nim: "2023018008",
        angkatan: "TEDAKDAIVAT",
        divisi: "HUMAS",
        jabatan: "Koordinator Dokumentasi",
        status: "Aktif",
        foto: "images/pengurus/dokumentasi.jpg",
        noHp: "082214428371",
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    },
    {
        namaLengkap: "Laura Mahatta Rismavi Hendra",
        namaLapangan: "Lamase",
        nim: "2024012037",
        angkatan: "TEDAKDAIVAT",
        divisi: "HUMAS",
        jabatan: "Tim PDD",
        status: "Aktif",
        foto: "images/pengurus/dokumentasiwakil.jpg",
        noHp: "089539279 3379".replace(/\s/g, ''),
        tanggalBergabung: "2025-08-15",
        tanggalLahir: "",
        jumlahKegiatan: 0
    }

    // Tambahkan anggota lain (non-pengurus) di sini dengan format sama:
    // {
    //     namaLengkap: "...", namaLapangan: "...", nim: "...",
    //     angkatan: "LITANIARAM", divisi: "UMUM", jabatan: "Anggota",
    //     status: "Aktif", foto: "", noHp: "08...",
    //     tanggalBergabung: "2026-08-10", tanggalLahir: "", jumlahKegiatan: 0
    // },
];

// `anggotaData` inilah yang dipakai oleh data-anggota.js
let anggotaData = anggotaDataFallback.slice();

// ================================================================
// PARSER CSV RINGAN (sama seperti alumni-data.js)
// ================================================================
function parseCsvDA(text) {
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

function csvRowsToAnggota(rows) {
    if (!rows.length) return [];
    const headers = rows[0].map(function (h) { return h.trim(); });

    return rows.slice(1).filter(function (r) {
        return r.some(function (c) { return c.trim() !== ''; });
    }).map(function (r) {
        const obj = {};
        headers.forEach(function (h, i) { obj[h] = (r[i] || '').trim(); });

        return {
            namaLengkap: obj.namaLengkap || 'Tanpa Nama',
            namaLapangan: obj.namaLapangan || '-',
            nim: obj.nim || '-',
            angkatan: obj.angkatan || 'PANCATOMPAK',
            divisi: obj.divisi || 'UMUM',
            jabatan: obj.jabatan || 'Anggota',
            status: STATUS_LIST.includes(obj.status) ? obj.status : 'Aktif',
            foto: obj.foto || '',
            noHp: obj.noHp || '',
            tanggalBergabung: obj.tanggalBergabung || '',
            tanggalLahir: obj.tanggalLahir || '',
            jumlahKegiatan: obj.jumlahKegiatan ? parseInt(obj.jumlahKegiatan, 10) : 0
        };
    });
}

// Promise yang ditunggu data-anggota.js sebelum merender halaman.
// Selalu resolve (tidak pernah reject) supaya halaman tetap jalan walau
// Google Sheets gagal diakses.
const MAPATEK_ANGGOTA_READY = (async function loadAnggotaFromSheet() {
    if (!SHEET_CSV_URL_DA) return; // tetap pakai fallback

    try {
        const res = await fetch(SHEET_CSV_URL_DA, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const parsed = csvRowsToAnggota(parseCsvDA(text));
        if (parsed.length > 0) {
            anggotaData = parsed;
            console.info('[Mapatek] Data anggota dimuat dari Google Sheets (' + parsed.length + ' anggota).');
        }
    } catch (err) {
        console.warn('[Mapatek] Gagal memuat data anggota dari Google Sheets, memakai data fallback.', err);
    }
})();