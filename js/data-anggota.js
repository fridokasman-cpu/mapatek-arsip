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
// - tanggalLahir    : format "YYYY-MM-DD" (dipakai widget ulang tahun,
//                      tahun boleh diisi asal-asalan kalau tidak ingin usia
//                      ditampilkan — hanya bulan & tanggal yang dipakai)
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

const DIVISI_LIST = [
    { key: 'all', label: 'Semua Divisi' },
    { key: 'INTI', label: '🏛️ Pengurus Harian' },
    { key: 'KONSERVASI', label: '🌱 Konservasi & Lingkungan' },
    { key: 'DIKLAT', label: '🎒 Diklat & SDM' },
    { key: 'HUMAS', label: '📣 Humas & Media' },
    { key: 'LOGISTIK', label: '🎒 Logistik & Perlengkapan' },
    { key: 'UMUM', label: '🧑\u200d🤝\u200d🧑 Anggota Umum' }
];

const STATUS_LIST = ['Aktif', 'Cuti', 'Purna Tugas'];

const anggotaDataFallback = [
    {
        namaLengkap: "Rangga Aditya Pramana",
        namaLapangan: "Elang",
        nim: "21/475001/TK/62345",
        angkatan: "TAPAKKAKI",
        divisi: "INTI",
        jabatan: "Ketua Umum",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
        noHp: "081234500001",
        tanggalBergabung: "2024-08-15",
        tanggalLahir: "2003-03-14",
        jumlahKegiatan: 12
    },
    {
        namaLengkap: "Siti Nur Azizah",
        namaLapangan: "Sereh",
        nim: "21/475002/TK/62346",
        angkatan: "TAPAKKAKI",
        divisi: "INTI",
        jabatan: "Wakil Ketua",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&q=80",
        noHp: "081234500002",
        tanggalBergabung: "2024-08-15",
        tanggalLahir: "2003-09-02",
        jumlahKegiatan: 11
    },
    {
        namaLengkap: "Melati Putri Handayani",
        namaLapangan: "Kabut",
        nim: "22/481003/TK/63012",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Sekretaris",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80",
        noHp: "081234500003",
        tanggalBergabung: "2025-08-20",
        tanggalLahir: "2004-01-22",
        jumlahKegiatan: 6
    },
    {
        namaLengkap: "Muhammad Rizky Firmansyah",
        namaLapangan: "Batu",
        nim: "22/481004/TK/63013",
        angkatan: "TEDAKDAIVAT",
        divisi: "INTI",
        jabatan: "Bendahara",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
        noHp: "081234500004",
        tanggalBergabung: "2025-08-20",
        tanggalLahir: "2004-08-30",
        jumlahKegiatan: 7
    },
    {
        namaLengkap: "Nadia Ayu Ramadhani",
        namaLapangan: "Rimba",
        nim: "21/475005/TK/62347",
        angkatan: "TAPAKKAKI",
        divisi: "KONSERVASI",
        jabatan: "Koordinator Divisi Konservasi & Lingkungan",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
        noHp: "081234500005",
        tanggalBergabung: "2024-09-01",
        tanggalLahir: "2003-08-25",
        jumlahKegiatan: 9
    },
    {
        namaLengkap: "Fikri Ahmad Maulana",
        namaLapangan: "Guntur",
        nim: "21/475006/TK/62348",
        angkatan: "TAPAKKAKI",
        divisi: "DIKLAT",
        jabatan: "Koordinator Divisi Diklat & SDM",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
        noHp: "081234500006",
        tanggalBergabung: "2024-09-01",
        tanggalLahir: "2003-05-11",
        jumlahKegiatan: 10
    },
    {
        namaLengkap: "Dewi Anggraini",
        namaLapangan: "Camar",
        nim: "22/481007/TK/63014",
        angkatan: "TEDAKDAIVAT",
        divisi: "HUMAS",
        jabatan: "Koordinator Divisi Humas & Media",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
        noHp: "081234500007",
        tanggalBergabung: "2025-09-05",
        tanggalLahir: "2004-11-03",
        jumlahKegiatan: 5
    },
    {
        namaLengkap: "Aditya Nugroho",
        namaLapangan: "Cakra",
        nim: "22/481008/TK/63015",
        angkatan: "TEDAKDAIVAT",
        divisi: "LOGISTIK",
        jabatan: "Koordinator Divisi Logistik & Perlengkapan",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
        noHp: "081234500008",
        tanggalBergabung: "2025-09-05",
        tanggalLahir: "2004-02-18",
        jumlahKegiatan: 6
    },
    {
        namaLengkap: "Zahra Kamila",
        namaLapangan: "Embun",
        nim: "23/492009/TK/64201",
        angkatan: "LITANIARAM",
        divisi: "UMUM",
        jabatan: "Anggota",
        status: "Aktif",
        foto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80",
        noHp: "081234500009",
        tanggalBergabung: "2026-08-10",
        tanggalLahir: "2005-07-30",
        jumlahKegiatan: 2
    },
    {
        namaLengkap: "Yusuf Firmansyah",
        namaLapangan: "Bara",
        nim: "23/492010/TK/64202",
        angkatan: "LITANIARAM",
        divisi: "UMUM",
        jabatan: "Anggota",
        status: "Cuti",
        foto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=80",
        noHp: "",
        tanggalBergabung: "2026-08-10",
        tanggalLahir: "2005-04-09",
        jumlahKegiatan: 1
    }
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