// ================================================================
// DATA SELURUH ANGGOTA — Silakan lengkapi/edit sesuai data asli
// ----------------------------------------------------------------
// Setiap anggota adalah satu objek dengan field:
// - angkatan      : salah satu dari ANGKATAN_LIST_DA di bawah
// - namaLengkap   : nama lengkap sesuai KTM
// - namaLapangan  : nama panggilan/nama lapangan (isi "-" jika belum ada)
// - nim           : NIM
// - bidang        : jabatan/bidang penugasan
// - noHp          : nomor HP/WA (format 08xx..., akan dikonversi otomatis ke wa.me)
//
// CATATAN: Kolom "angkatan" pada 10 baris pertama (data pengurus) di
// bawah ini masih HASIL PERKIRAAN dari 2 digit awal NIM (2023->PANCATOMPAK,
// 2024->TAPAKKAKI, dst mengikuti pola di halaman "Tentang Kami"). Mohon
// dicek ulang & dikoreksi jika ada yang tidak sesuai kenyataan.
// Silakan tambahkan anggota lain (non-pengurus) di bawahnya dengan
// format objek yang sama.
// ================================================================

const ANGKATAN_LIST_DA = [
    { key: 'all', label: 'Semua Angkatan' },
    { key: 'PANCATOMPAK', label: '🌟 PANCATOMPAK (2023)' },
    { key: 'TAPAKKAKI', label: '👣 TAPAKKAKI (2024)' },
    { key: 'TEDAKDAIVAT', label: '⛰️ TEDAKDAIVAT (2025)' },
    { key: 'LITANIARAM', label: '🌿 LITANIARAM (2026)' }
];

const anggotaData = [
    { angkatan: "TAPAKKAKI",    namaLengkap: "Machmud Chabibul Lathif",        namaLapangan: "-", nim: "2024018064", bidang: "Ketua Umum",                 noHp: "085952824898" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Putri Robet",                    namaLapangan: "-", nim: "2024018007", bidang: "Sekretaris Jenderal",         noHp: "081522723325" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Tsye Dayana Knyartutu",          namaLapangan: "-", nim: "2024018006", bidang: "Sekretaris Wakil",            noHp: "085343835369" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Rosa Bandatia",                  namaLapangan: "-", nim: "2024018028", bidang: "Bendahara 1",                 noHp: "082249858268" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Tresia Utami Sulensi",           namaLapangan: "-", nim: "2024013058", bidang: "Koordinator Rock Climbing",   noHp: "085822450087" },
    { angkatan: "PANCATOMPAK",  namaLengkap: "Muhammad Musfian Sutrawardi",    namaLapangan: "-", nim: "2023013044", bidang: "Koordinator Gunung Hutan",    noHp: "085398717626" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Muhamad Amrullah",               namaLapangan: "-", nim: "2024012021", bidang: "Tim Gunung Hutan",            noHp: "085659543192" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Gahar Albani Rasyid",            namaLapangan: "-", nim: "2024019012", bidang: "Koordinator Logistik",        noHp: "082338021599" },
    { angkatan: "PANCATOMPAK",  namaLengkap: "Fridolinus Jeri Kasman",         namaLapangan: "-", nim: "2023018008", bidang: "Koordinator Dokumentasi",     noHp: "082214428371" },
    { angkatan: "TAPAKKAKI",    namaLengkap: "Laura Mahatta Rismavi Hendra",   namaLapangan: "-", nim: "2024012037", bidang: "Tim PDD",                     noHp: "089539279 3379".replace(/\s/g,'') }

    // Tambahkan anggota lain di sini dengan format yang sama:
    // { angkatan: "LITANIARAM", namaLengkap: "...", namaLapangan: "...", nim: "...", bidang: "Anggota", noHp: "08..." },
];
