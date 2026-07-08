// ================================================================
// CHATBOT — Asisten Virtual MAPATEK Super Pintar
// ================================================================

/**
 * Toggle tampilan chatbot
 */
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.classList.toggle('active');
    if (container.classList.contains('active')) {
        setTimeout(() => document.getElementById('chatInput').focus(), 300);
    }
}

/**
 * Kirim pesan user ke chatbot
 */
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');

    // Tampilkan pesan user
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-user" style="font-size:0.7rem;"></i></div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(userDiv);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Proses balasan bot (delay untuk efek natural)
    setTimeout(() => {
        const response = getIntelligentResponse(message);
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot';
        botDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot" style="font-size:0.7rem;"></i></div>
            <div class="message-content">${response}</div>
        `;
        messagesContainer.appendChild(botDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400 + Math.random() * 300);
}

/**
 * Escape HTML untuk keamanan
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * ================================================================
 * KNOWLEDGE BASE — Sistem respons cerdas SUPER LENGKAP
 * ================================================================
 */
function getIntelligentResponse(message) {
    const msg = message.toLowerCase().trim();

    // ==================== VARIASI SAPAAN & GREETINGS ====================
    if (/(halo|hai|hello|hi|hey|selamat (pagi|siang|sore|malam)|assalamualaikum|hy|hallo|helo|pagi|siang|sore|malam|apa kabar|kabar|gimana kabar|how are you|good morning|good afternoon|good evening)/i.test(msg)) {
        return getRandomResponse([
            "👋 Halo! Senang bertemu dengan Anda. Saya Asisten MAPATEK Abhipraya. Ada yang bisa saya bantu?",
            "🌲 Hai! Selamat datang di MAPATEK. Saya siap menjawab pertanyaan seputar pecinta alam, pendakian, atau organisasi kami.",
            "🏔️ Halo! Apa yang ingin Anda ketahui tentang MAPATEK? Saya siap membantu.",
            "😊 Hai! Kabar baik? Silakan tanyakan apa saja tentang MAPATEK, gunung, atau UST."
        ]);
    }

    // ==================== TERIMA KASIH ====================
    if (/(terima kasih|makasih|thanks|thank you|terimakasih|thx|tq|ty|thank you very much|thanks a lot|maturnuwun|matur nuwun)/i.test(msg)) {
        return getRandomResponse([
            "😊 Sama-sama! Senang bisa membantu. Jangan ragu bertanya lagi ya.",
            "🙏 Terima kasih kembali! Selalu semangat berpetualang! 🏔️",
            "👍 Siap membantu kapan saja. Tetap jaga alam dan keselamatan!",
            "😄 Dengan senang hati! Hubungi saya lagi jika ada yang ingin ditanyakan."
        ]);
    }

    // ==================== PERTANYAAN DENGAN KATA TANYA ====================
    // Deteksi kata tanya untuk memberikan respons lebih spesifik
    const hasApa = /\b(apa|apakah|apasih)\b/i.test(msg);
    const hasSiapa = /\b(siapa|siapakah|siapa itu|siapa yang)\b/i.test(msg);
    const hasKapan = /\b(kapan|kapan sih|kapan ya|bilamana)\b/i.test(msg);
    const hasDimana = /\b(dimana|di mana|kemana|ke mana|dimanakah|di manakah)\b/i.test(msg);
    const hasBagaimana = /\b(bagaimana|gimana|gimana cara|bagaimana cara|cara|bagaimana sih)\b/i.test(msg);
    const hasKenapa = /\b(kenapa|mengapa|kenapakah|kenapa sih)\b/i.test(msg);

    // ==================== TOPIK: VISI & MISI ====================
    if (/(visi|misi|visi misi|tujuan|organisasi|mapatek tujuan|cita-cita mapatek|apa tujuan|apa visi|apa misi|visi dan misi|misi dan visi|tujuan mapatek)/i.test(msg) || (hasApa && /(visi|misi|tujuan|organisasi)/i.test(msg))) {
        return `🎯 <strong>VISI & MISI MAPATEK ABHIPRAYA</strong>

<strong>🌟 VISI:</strong>
"Menjadi organisasi mahasiswa pecinta alam yang unggul, profesional, berkarakter, berjiwa konservasi, dan berlandaskan nilai-nilai Tamansiswa."

<strong>📌 MISI:</strong>
1. Mengembangkan sumber daya manusia yang berkualitas di bidang kepencintaalaman
2. Meningkatkan keterampilan teknis anggota (navigasi, survival, panjat tebing)
3. Melestarikan lingkungan melalui aksi konservasi nyata
4. Mempererat solidaritas dan kekeluargaan antar anggota
5. Menjalin kerjasama dengan organisasi pecinta alam lainnya
6. Mengabdikan kegiatan melalui dokumentasi dan publikasi ilmiah
7. Menanamkan nilai-nilai kepemimpinan, kemandirian, dan cinta tanah air`;
    }

    // ==================== TOPIK: PROFIL MAPATEK ====================
    if (/(apa itu mapatek|mapatek abhipraya|mapatek itu|pengertian mapatek|mapatek adalah|tentang mapatek|info mapatek|mapatek organisasi|mapatek singkatan|mapatek kepanjangan|jelaskan mapatek|mapatek itu apa|mapatek apaan)/i.test(msg) || (hasApa && /(mapatek|organisasi ini)/i.test(msg))) {
        return `🌲 <strong>MAPATEK ABHIPRAYA</strong>

📌 <strong>Makna Nama:</strong>
• MAPATEK = Mahasiswa Pencinta Alam Teknik
• ABHIPRAYA = Harapan / Cita-cita (Sanskerta)

📅 <strong>Berdiri:</strong> 19 Maret 2023 di UST Yogyakarta

🏔️ <strong>Bidang Kegiatan:</strong>
• Ekspedisi Pendakian Gunung
• Rock Climbing & Panjat Tebing
• Konservasi Lingkungan
• Pendidikan & Latihan Dasar (DIKSAR)
• Bakti Sosial & Penanaman Pohon
• Penelitian & Dokumentasi Alam

🌟 Visi: Menjadi organisasi pecinta alam yang unggul, profesional, dan berkarakter.`;
    }

    // ==================== TOPIK: SEJARAH & ANGKATAN ====================
    if (/(sejarah|sejarah mapatek|sejarah berdirinya|kapan mapatek berdiri|tanggal berdiri|awal mula|mapatek didirikan|pendiri|siapa pendiri|founder|angkatan|pancatompak|tapakkaki|tedakdaivat|litaniaram|ada berapa angkatan|daftar angkatan)/i.test(msg) || (hasKapan && /(berdiri|didirikan|dibentuk)/i.test(msg)) || (hasSiapa && /(pendiri|pencetus|pembentuk|yang mendirikan)/i.test(msg))) {
        if (/(angkatan|pancatompak|tapakkaki|tedakdaivat|litaniaram|ada berapa angkatan|daftar angkatan|nama angkatan)/i.test(msg)) {
            return `🌟 <strong>ANGKATAN MAPATEK ABHIPRAYA</strong>

🥇 <strong>PANCATOMPAK (2023)</strong> — Angkatan Pendiri
"Lima Puncak Harapan" — 5 orang pemberani.

🥈 <strong>TAPAKKAKI (2024)</strong> — Angkatan Pengukir Jejak
"Mengukir Jejak Perjuangan"

🥉 <strong>TEDAKDAIVAT (2025)</strong> — Angkatan Penakluk Puncak
"Menapaki Puncak Tertinggi"

🏅 <strong>LITANIARAM (2026)</strong> — Angkatan Pelita Alam
"Pelita bagi Alam"

📌 Setiap angkatan memiliki ciri khas, motto, dan kontribusi unik.`;
        } else {
            return `📜 <strong>SEJARAH MAPATEK ABHIPRAYA</strong>

🗓️ <strong>Tanggal Berdiri:</strong> 19 Maret 2023
📍 <strong>Tempat:</strong> UST Yogyakarta

👥 <strong>Pendiri (Angkatan PancaTompak):</strong>
Awalnya 5 orang mahasiswa pecinta alam.

🌟 <strong>Perjalanan Angkatan:</strong>
• <strong>PancaTompak (2023)</strong> — Angkatan Pendiri
• <strong>TapakKaki (2024)</strong> — Angkatan Pengukir Jejak
• <strong>TedakDaivat (2025)</strong> — Angkatan Penakluk Puncak
• <strong>LitaniAram (2026)</strong> — Angkatan Pelita Alam

🏆 Hingga kini, MAPATEK telah melaksanakan puluhan ekspedisi dan kegiatan konservasi.`;
        }
    }

    // ==================== TOPIK: STRUKTUR PENGURUS ====================
    if (/(struktur|pengurus|kepengurusan|ketua|ketua mapatek|sekretaris|bendahara|koordinator|pengurus inti|siapa ketua|nama ketua|pengurus periode|ketua umum|pengurus mapatek|ada siapa aja)/i.test(msg) || (hasSiapa && /(ketua|sekretaris|bendahara|pengurus|koordinator)/i.test(msg))) {
        return `👥 <strong>STRUKTUR PENGURUS MAPATEK</strong>
Periode 2025-2026

🌟 <strong>PIMPINAN INTI:</strong>
• Ketua Umum: Machmud Chabibul Lathif (085-952-824-898)
• Sekretaris Jenderal: Putri Robet (0815-2272-3325)
• Sekretaris Wakil: Tsye Dayana Knyartutu
• Bendahara 1: Rosa Bandatia

🧗 <strong>KOORDINATOR LAPANGAN:</strong>
• Rock Climbing: Tresia Utami Sulensi
• Gunung Hutan: Muhammad Musfian Sutrawardi
• Tim Gunung Hutan: Muhamad Amrullah

📦 <strong>KOORDINATOR PENDUKUNG:</strong>
• Logistik: Gahar Albani Rasyid
• Dokumentasi: Fridolinus Jeri Kasman
• Tim PDD: Laura Mahatta Rismavi Hendra

📞 Kontak Admin: 0822-1442-8371 (Fridolinus)`;
    }

    // ==================== TOPIK: PENDAFTARAN ====================
    if (/(pendaftaran|daftar|bergabung|join|masuk mapatek|rekrutmen|oprec|open recruitment|calon anggota|ingin gabung|form pendaftaran|syarat pendaftaran|cara daftar|mendaftar|gabung mapatek|daftar anggota)/i.test(msg) || (hasBagaimana && /(daftar|bergabung|join|masuk)/i.test(msg))) {
        return `📝 <strong>PENDAFTARAN ANGGOTA MAPATEK</strong>

📌 <strong>CARA MENDAFTAR:</strong>
1. Cek bagian <strong>Pendaftaran</strong> di website ini (status real-time)
2. Hubungi WhatsApp Admin: <strong>0822-1442-8371</strong>
3. DM Instagram: <strong>@mapatek_abhipraya</strong>

✅ <strong>SYARAT:</strong>
• Mahasiswa aktif UST Yogyakarta
• Komitmen tinggi terhadap alam & konservasi
• Bersedia mengikuti DIKSAR
• Sehat jasmani & rohani (surat keterangan sehat)
• Mengisi formulir online & membayar biaya pendaftaran
• Lulus wawancara seleksi

📅 <strong>JADWAL:</strong>
• Semester Ganjil: September - Oktober
• Semester Genap: Februari - Maret

💰 <strong>BIAYA:</strong>
Rp 300.000 - Rp 500.000 (termasuk akomodasi DIKSAR, perlengkapan, & merchandise MAPATEK)`;
    }

    // ==================== TOPIK: DIKSAR ====================
    if (/(diksar|pendidikan dasar|latihan dasar|diklat|paldik|pendidikan dan latihan|apa itu diksar|materi diksar|pelaksanaan diksar|dikdar|diklat dasar|pendidikan dan latihan dasar)/i.test(msg) || (hasApa && /(diksar|pendidikan dasar|latihan dasar)/i.test(msg))) {
        return `🎓 <strong>DIKSAR (Pendidikan Dasar) MAPATEK</strong>

📌 <strong>APA ITU DIKSAR?</strong>
Kegiatan wajib bagi calon anggota selama <strong>3 hari 2 malam</strong> di alam terbuka (kaki Gunung Merapi / kawasan hutan UST).

📚 <strong>MATERI DIKSAR:</strong>
1. Pengenalan Organisasi & Kepemimpinan
2. Navigasi Darat (Kompas, Peta, GPS)
3. Teknik Pendakian & Manajemen Perjalanan
4. Survival & P3K di Alam Liar
5. Konservasi & Leave No Trace
6. Rock Climbing Dasar & Belaying
7. Simpul-Simpul (Knotting)
8. Manajemen Logistik & Pendirian Tenda
9. Etika Pecinta Alam
10. Pengetahuan Gunung & Flora-Fauna

🏆 <strong>SYARAT LULUS:</strong>
✓ Hadir 100%
✓ Mengerjakan semua tugas
✓ Lulus ujian teori & praktik
✓ Menunjukkan sikap kepemimpinan & kerja sama tim

Setelah lulus, peserta resmi dikukuhkan sebagai anggota MAPATEK!`;
    }

    // ==================== TOPIK: GUNUNG & PENDAKIAN ====================
    if (/(gunung|pendakian|naik gunung|mendaki|gunung apa|rekomendasi gunung|gunung untuk pemula|gunung tertinggi|puncak|seven summit|gunung populer|gunung terbaik|jalan pendakian|track pendakian)/i.test(msg) || (hasApa && /(gunung|pendakian|puncak)/i.test(msg)) || (hasDimana && /(gunung|pendakian|jalur)/i.test(msg))) {
        if (/(tertinggi|puncak tertinggi|seven summit|tujuh puncak|puncak tertinggi indonesia|gunung paling tinggi)/i.test(msg)) {
            return `🏔️ <strong>GUNUNG TERTINGGI DI INDONESIA</strong>

1. <strong>PUNCAK JAYA</strong> — 4.884 mdpl (Papua)
2. <strong>PUNCAK MANDALA</strong> — 4.760 mdpl (Papua)
3. <strong>PUNCAK TRIKORA</strong> — 4.750 mdpl (Papua)
4. <strong>GUNUNG KERINCI</strong> — 3.805 mdpl (Sumatera)
5. <strong>GUNUNG RINJANI</strong> — 3.726 mdpl (Lombok)
6. <strong>GUNUNG SEMERU</strong> — 3.676 mdpl (Jawa)
7. <strong>GUNUNG ARJUNA</strong> — 3.339 mdpl (Jawa)

🌟 <strong>SEVEN SUMMIT INDONESIA:</strong>
Puncak Jaya, Kerinci, Rinjani, Semeru, Latimojong, Bukit Raya, Agung.`;
        }

        if (/(rekomendasi|pemula|ramah pemula|untuk pemula|gunung pemula|gunung mudah|gunung ringan|pemula banget)/i.test(msg)) {
            return `⛰️ <strong>REKOMENDASI GUNUNG UNTUK PEMULA (JAWA):</strong>

🥇 <strong>GUNUNG PRAU (Dieng)</strong> — 2.565 mdpl
✓ Medan sedang, pemandian air panas
✓ Sunrise spectacular, cocok camping

🥈 <strong>GUNUNG ANDONG (Magelang)</strong> — 1.726 mdpl
✓ Jalur pendek (2-3 jam)
✓ Pemandangan Merbabu & Merapi

🥉 <strong>GUNUNG MERBABU</strong> — 3.145 mdpl
✓ Jalur Wekas, Selo, Cunthel
✓ Sabana luas, view 360°

🏅 <strong>GUNUNG SINDORO</strong> — 3.136 mdpl
✓ Jalur landai, banyak pos
✓ Embun es di puncak (suhu 0-5°C)

📌 Tips: Bawa perlengkapan lengkap, jangan sendiri, cek cuaca!`;
        }

        // Deteksi gunung spesifik yang disebut
        const gunungSpesifik = ['merapi', 'merbabu', 'prau', 'sindoro', 'sumbing', 'rinjani', 'semeru', 'kerinci', 'lawu', 'argo', 'guntur', 'galunggung', 'papandayan', 'ciremai', 'salak', 'gede', 'pangrango', 'bromo', 'ijen', 'tambora', 'batur', 'agung'];
        for (const gunung of gunungSpesifik) {
            if (msg.includes(gunung)) {
                return `🏔️ <strong>GUNUNG ${gunung.toUpperCase()}</strong>

Informasi tentang Gunung ${gunung.charAt(0).toUpperCase() + gunung.slice(1)} dapat Anda cek di:
• Website resmi Taman Nasional
• Aplikasi pendakian (e-ticketing)
• Atau hubungi admin MAPATEK untuk jalur pendakian, izin, dan kondisi terkini.

📌 Tips: Selalu cek cuaca dan bawa perlengkapan 10 Essentials.`;
            }
        }

        return `🏔️ <strong>INFO PENDAKIAN GUNUNG</strong>

📌 Persiapan fisik minimal 2 minggu sebelum pendakian.
📌 Selalu cek cuaca di BMKG atau website resmi gunung.
📌 Bawa perlengkapan 10 Essentials.
📌 Patuhi aturan pendakian setempat.
📌 Terapkan Leave No Trace!

🗺️ Gunung-gunung yang sering dikunjungi MAPATEK:
Merapi, Merbabu, Prau, Sindoro, Sumbing, Rinjani, Semeru.

💡 Butuh rekomendasi gunung pemula? Tanyakan "rekomendasi gunung pemula"!`;
    }

    // ==================== TOPIK: PERSIAPAN & PERLENGKAPAN ====================
    if (/(persiapan|tips|syarat|perlengkapan|10 essentials|essential gear|packing carrier|cara packing|barang bawaan|peralatan|perlengkapan pendakian|bawa apa aja)/i.test(msg) || (hasBagaimana && /(persiapan|packing|mengemas)/i.test(msg))) {
        if (/(10 essentials|perlengkapan wajib|essential gear|barang yang harus dibawa|wajib dibawa|wajib bawa)/i.test(msg)) {
            return `🎒 <strong>10 ESSENTIALS (Perlengkapan Wajib Pendakian)</strong>

1. <strong>NAVIGASI</strong> 🧭 — Peta, kompas, GPS, whistle
2. <strong>HEADLAMP/SENTER</strong> 🔦 + baterai cadangan
3. <strong>PERLINDUNGAN</strong> 🧥 — Jaket windproof, raincoat, sunscreen, topi
4. <strong>P3K + OBAT PRIBADI</strong> ⛑️ — Plester, betadine, perban, obat sakit kepala
5. <strong>PISAU SERBAGUNA</strong> 🔪 — Multitool
6. <strong>API</strong> 🔥 — Korek api waterproof, lighter, ferro rod
7. <strong>TEMPAT BERLINDUNG</strong> 🏕️ — Tenda darurat / bivy sack
8. <strong>PERALATAN MASAK</strong> 🍳 — Kompor portable, mess tin, sendok
9. <strong>MAKANAN CADANGAN</strong> 🍫 — Energy bar, coklat, kacang
10. <strong>AIR + FILTRASI</strong> 💧 — Minimal 3L, tablet pemurni air

⚠️ Untuk pendakian >1 hari: tambahkan sleeping bag, matras, tenda!`;
        }

        if (/(packing carrier|cara packing|mengemas carrier|menata carrier|packing tas|teknik packing|susun barang)/i.test(msg)) {
            return `🎒 <strong>CARA PACKING CARRIER YANG BENAR</strong>

📌 <strong>ATURAN DASAR:</strong>
• <strong>Barang berat</strong> (air, kompor, logistik) = <strong>DEKAT PUNGGUNG</strong> (tengah carrier) — jaga keseimbangan!
• <strong>Barang ringan</strong> (sleeping bag, pakaian) = <strong>BAWAH CARRIER</strong>
• <strong>Barang sering dipakai</strong> (raincoat, snack, P3K) = <strong>TOP LID / AKSES CEPAT</strong>
• <strong>Tenda</strong> = ikat di <strong>LUAR</strong> bagian bawah atau atas carrier
• <strong>Matras</strong> = gulung di <strong>SISI KIRI/KANAN</strong> carrier
• <strong>Air minum</strong> = kedua sisi carrier untuk keseimbangan

📏 <strong>TIPS:</strong>
✓ Berat total carrier ideal <strong>20-25% dari berat badan</strong>!
✓ Jangan melebihi 30% untuk pendakian panjang
✓ Simpan barang dalam kantong kedap air
✓ Pisahkan pakaian kering dan basah
✓ Gunakan kompresi bag untuk sleeping bag`;
        }

        return `🎒 <strong>TIPS PERSIAPAN PENDAKIAN (PEMULA)</strong>

📅 <strong>H-14 s.d H-7:</strong>
• Latihan fisik: jogging 3-4x/minggu, naik turun tangga dengan beban carrier 10-15kg
• Cek kondisi cuaca di BMKG
• Pelajari jalur pendakian (maps, elevasi, water source)

📅 <strong>H-7 s.d H-3:</strong>
• Urus izin pendakian (SIMAKSI/SIMAKS)
• Siapkan 10 Essentials
• Bawa P3K & obat pribadi
• Siapkan uang tunai & power bank

📅 <strong>H-1:</strong>
• Informasikan rencana ke keluarga/teman
• Cek ulang perlengkapan
• Istirahat cukup, jaga hidrasi

🏔️ <strong>SAAT PENDAKIAN:</strong>
• Jangan malu untuk TURNBACK jika kondisi tidak memungkinkan!
• Bawa turun SEMUA sampah!
• Patuhi Leave No Trace

⚠️ <strong>PRINSIP UTAMA:</strong>
"Puncak bukan segalanya, keselamatan adalah nomor satu!"`;
    }

    // ==================== TOPIK: NAVIGASI ====================
    if (/(navigasi|kompas|peta|orientasi|azimuth|back bearing|resection|baca peta|teknik navigasi|cara menggunakan kompas|kartografi|koordinat)/i.test(msg) || (hasBagaimana && /(navigasi|kompas|peta)/i.test(msg))) {
        return `🧭 <strong>TEKNIK NAVIGASI DASAR</strong>

📌 <strong>1. ORIENTASI PETA</strong>
Sejajarkan peta dengan arah utara kompas.

📌 <strong>2. BACK BEARING</strong>
• Jika Azimuth < 180°: Back Azimuth = Azimuth + 180°
• Jika Azimuth > 180°: Back Azimuth = Azimuth - 180°

📌 <strong>3. RESECTION</strong>
Tentukan posisi dengan minimal 2 titik referensi.

📌 <strong>4. AZIMUTH</strong>
• 0° = Utara, 90° = Timur
• 180° = Selatan, 270° = Barat

⚠️ <strong>CATATAN:</strong>
Kompas tidak berfungsi optimal di dekat besi/logam, kabel listrik tegangan tinggi, atau HP.

📌 Tips: Selalu kalibrasi kompas sebelum digunakan!`;
    }

    // ==================== TOPIK: SURVIVAL ====================
    if (/(survival|bertahan hidup|selamat di alam|survival mapala|tips survival|survival dasar|survival 3a|shelter|membuat api|menjernihkan air|air bersih|bertahan di hutan|hidup di alam|survival kit)/i.test(msg) || (hasBagaimana && /(survival|bertahan|api|shelter|air)/i.test(msg))) {
        if (/(membuat api|api|fire starter|ferro rod|bow drill|korek|menyalakan api|bikin api)/i.test(msg)) {
            return `🔥 <strong>CARA MEMBUAT API DI ALAM LIAR</strong>

📌 <strong>BAHAN BAKAR (3 LEVEL):</strong>
• <strong>Tinder</strong> — Serat kayu kering, lumut, kapas + vaselin (SUPER!)
• <strong>Kindling</strong> — Ranting kering ukuran pensil
• <strong>Fuel Wood</strong> — Kayu besar untuk menjaga api

📌 <strong>METODE:</strong>
1️⃣ <strong>Ferro Rod (Fire Steel)</strong> — PALING ANDAL
   Goreskan striker ke rod ke arah tinder. Percikan ~3000°C!

2️⃣ <strong>Korek Api/Lighter Tahan Air</strong>
   Simpan di tempat kedap air (ziplock)

3️⃣ <strong>Lensa/Kaca Pembesar</strong>
   Fokuskan sinar matahari ke tinder (hanya saat cerah)

4️⃣ <strong>Bow Drill (Manual)</strong>
   Butuh latihan! Gesekan kayu menghasilkan serbuk membara.

5️⃣ <strong>Baterai + Kertas Timah</strong>
   Sentuhkan kutub positif & negatif ke kertas timah/wol baja

💡 Selalu bawa ferro rod dan korek api anti air sebagai CADANGAN!`;
        }

        if (/(shelter|tempat berlindung|tenda darurat|berteduh|perlindungan dari hujan|membuat shelter)/i.test(msg)) {
            return `🏕️ <strong>JENIS SHELTER DARURAT:</strong>

<strong>1. LEAN TO (Satu Sisi)</strong>
Cari pohon besar, letakkan dahan miring 45°, tutup dengan daun kering/ponco.

<strong>2. DEBRIS HUT (Gundukan Daun)</strong>
Rangka lengkung dari dahan, timbun daun kering setebal 30-50cm. PALING HANGAT!

<strong>3. A-FRAME (Segitiga)</strong>
Dua sisi segitiga dengan tiang tengah. Praktis pakai ponco/tarp (5-10 menit).

<strong>4. NATURAL SHELTER</strong>
Gua kecil, bawah pohon rindang (beringin), celah batu besar.

📌 <strong>PRINSIP MEMILIH LOKASI:</strong>
• Jauh dari bahaya (tebing rapuh, pohon mati, banjir bandang)
• Dekat sumber air (tapi jangan terlalu dekat)
• Terlindung dari angin dominan
• Tanah relatif datar & kering`;
        }

        if (/(menjernihkan air|memurnikan air|filter air|air minum|sterilisasi air|water purification|air bersih|filter darurat)/i.test(msg)) {
            return `💧 <strong>METODE MEMURNIKAN AIR DI ALAM</strong>

<strong>1. MENDIDIHKAN (Paling Aman 99.9%)</strong>
Rebus air hingga mendidih 3-5 menit. Di atas 2000 mdpl, rebus 10 menit.

<strong>2. FILTER PORTABLE</strong>
Sawyer Mini, LifeStraw, Katadyn BeFree — saring partikel & bakteri.

<strong>3. TABLET PENJERNIH (Iodine/Chlorine)</strong>
Tunggu 30 menit (2 jam jika air dingin/keruh). ⚠️ Iodine tidak untuk ibu hamil.

<strong>4. SODIS (Solar Water Disinfection)</strong>
Botol plastik bening dijemur 6 jam — UV-A membunuh patogen.

<strong>5. FILTER DARURAT (Improvisasi)</strong>
Botol dipotong → lapisan: batu kerikil → pasir → arang → kain.
⚠️ HANYA memfilter partikel! TETAP rebus setelahnya!`;
        }

        return `🔥 <strong>SURVIVAL DASAR DI ALAM LIAR</strong>

📌 <strong>PRINSIP 3A + 1P:</strong>
• Alert (Kewaspadaan) — Tetap tenang
• Assessment (Analisa) — Nilai situasi
• Action (Tindakan) — Lakukan prioritas
• Persistence (Ketekunan) — Pantang menyerah

📌 <strong>PRIORITAS:</strong>
1️⃣ <strong>PERTOLONGAN</strong> — Atasi cedera serius
2️⃣ <strong>PERLINDUNGAN</strong> — Cari shelter dari cuaca
3️⃣ <strong>AIR</strong> — Cari sumber air (2 liter/hari)
4️⃣ <strong>API</strong> — Untuk hangat, masak, sinyal
5️⃣ <strong>MAKANAN</strong> — Terakhir (bisa bertahan berminggu)

📌 <strong>SINYAL DARURAT:</strong>
• Peluit: 3 tiupan pendek (ulangi)
• Asap: 3 kepulan
• Api: 3 api berjajar
• Cermin/HP: pantulkan ke arah pencari`;
    }

    // ==================== TOPIK: P3K & KESEHATAN ====================
    if (/(p3k|pertolongan pertama|obat|luka|hipotermia|kedinginan|gigitan ular|patah tulang|cpr|jantung|resusitasi|kecelakaan|cedera|demam|sakit|diare|mual|pusing)/i.test(msg) || (hasBagaimana && /(mengatasi|menangani|mengobati)/i.test(msg) && /(hipotermia|luka|ular|patah|cpr|sakit)/i.test(msg))) {
        if (/(hipotermia|kedinginan|suhu tubuh turun|menggigil|kedinginan parah)/i.test(msg)) {
            return `❄️ <strong>PENANGANAN HIPOTERMIA</strong>

📌 <strong>GEJALA:</strong>
• Menggigil hebat (tahap awal)
• Bicara pelo, gerakan kaku
• Kebingungan, denyut nadi lemah
⚠️ Tidak menggigil lagi = TANDA BAHAYA!

🆘 <strong>TINDAKAN:</strong>
1️⃣ Cari shelter dari angin & hujan
2️⃣ Ganti pakaian basah dengan KERING
3️⃣ Beri minuman HANGAT (air teh manis, susu) — JANGAN alkohol!
4️⃣ Hangatkan area INTI tubuh: leher, ketiak, selangkangan
5️⃣ Gunakan sleeping bag, emergency blanket, body contact
6️⃣ Jika tidak sadar, posisikan miring (recovery position)
7️⃣ Segera evakuasi ke bawah untuk pertolongan medis`;
        }

        if (/(gigitan ular|ular berbisa|digigit ular|ular kobra|ular weling|ular hijau|ular tanah|ular sendok)/i.test(msg)) {
            return `🐍 <strong>PENANGANAN GIGITAN ULAR</strong>

📌 <strong>GEJALA:</strong>
• Luka tusuk 1 atau 2 titik (taring)
• Nyeri hebat, bengkak, memar
• Mual, muntah, pusing, penglihatan kabur
• Kesulitan bernapas, kelemahan otot

✅ <strong>YANG HARUS DILAKUKAN:</strong>
✓ JANGAN PANIK! Panik mempercepat sirkulasi bisa
✓ Jangan bergerak terlalu banyak (immobilisasi)
✓ Lepaskan perhiasan/jam di sekitar gigitan
✓ Posisikan bagian tergigit LEBIH RENDAH dari jantung
✓ Bersihkan luka dengan air sabun
✓ Tutup dengan kain bersih
✓ Catat ciri-ciri ular (warna, bentuk kepala, pola)
✓ SEGERA KE FASILITAS KESEHATAN!

❌ <strong>YANG TIDAK BOLEH:</strong>
✗ Menghisap bisa dengan mulut
✗ Membalut terlalu ketat (tourniquet)
✗ Menggorok/menyayat luka
✗ Minum alkohol atau kafein
✗ Mengoleskan es langsung ke luka`;
        }

        if (/(patah tulang|fraktur|tulang patah|bidai|patah kaki|patah tangan|patah lengan|patah tulang belakang)/i.test(msg)) {
            return `🦴 <strong>PENANGANAN FRAKTUR (PATAH TULANG)</strong>

📌 <strong>GEJALA:</strong>
• Nyeri hebat, bengkak, memar
• Deformitas (bentuk tidak normal)
• Tidak bisa menggerakkan anggota

🆘 <strong>TINDAKAN:</strong>
1️⃣ Jangan memindahkan korban jika tidak perlu
2️⃣ Immobilisasi dengan BIDAI DARURAT:
   Tongkat, carrier frame, sleeping pad, koran/majalah
3️⃣ Pasang bidai dari sendi di atas ke sendi di bawah patahan
4️⃣ Beri BANTALAN antara bidai & kulit
5️⃣ Ikat dengan tali carrier (jangan terlalu kencang)
6️⃣ Untuk patah TERBUKA (tulang menonjol):
   ✓ Tutup dengan kain STERIL
   ✓ Jangan dorong tulang ke dalam!
7️⃣ Segera evakuasi ke fasilitas kesehatan

📌 <strong>BIDAI IMPROVISASI:</strong>
• Lengan: Kancing baju ke dada
• Kaki: Ikat ke kaki yang sehat
• Carrier frame: Untuk tulang punggung`;
        }

        if (/(cpr|henti jantung|resusitasi|napas buatan|kompresi dada|cardiac arrest|jantung berhenti)/i.test(msg)) {
            return `❤️ <strong>CPR (Cardiopulmonary Resuscitation)</strong>

📌 <strong>LANGKAH (30:2):</strong>

1️⃣ <strong>PASTIKAN KEAMANAN</strong> — Area aman.

2️⃣ <strong>CEK RESPON</strong> — Goyang bahu, tanya "Apakah Anda baik-baik saja?"

3️⃣ <strong>PANGGIL BANTUAN</strong> — Minta orang lain hubungi 118/119.

4️⃣ <strong>CEK NAPAS & NADI</strong> — Lihat dada, rasakan napas, cek nadi karotis (5-10 detik).

5️⃣ <strong>LAKUKAN KOMPRESI DADA:</strong>
✓ Telapak tangan di tengah dada (sternum)
✓ Tumpuk tangan, siku lurus
✓ Kedalaman: 5-6 cm (dewasa)
✓ Kecepatan: 100-120 kali per menit
✓ Lakukan 30 kompresi

6️⃣ <strong>BERI NAPAS BUATAN:</strong>
✓ Buka jalan napas (head tilt-chin lift)
✓ Tutup hidung korban
✓ Tiup napas 1 detik hingga dada mengembang
✓ Lakukan 2 kali

7️⃣ <strong>ULANGI SIKLUS 30:2</strong> — Terus hingga bantuan datang.

🎵 <strong>REFERENSI KECEPATAN:</strong>
• 'Stayin' Alive' (Bee Gees) — 103 bpm
• 'Baby Shark' — 115 bpm

📌 <strong>UNTUK ANAK (1-8 tahun):</strong> Gunakan 1 tangan, kedalaman 4-5cm.
📌 <strong>UNTUK BAYI (<1 tahun):</strong> Gunakan 2 jari, kedalaman 4cm.`;
        }

        return `⛑️ <strong>P3K DASAR UNTUK PENDAKIAN</strong>

📌 <strong>ISI P3K WAJIB:</strong>
• Plester & perban (berbagai ukuran)
• Betadine / antiseptik
• Obat sakit kepala & diare
• Obat alergi & masuk angin
• Minyak kayu putih / balsem
• Gunting kecil & pinset
• Kassa steril & kapas
• Plester luka (band aid)
• Obat pribadi (jika ada)

📌 <strong>PRINSIP P3K:</strong>
1. Jangan panik
2. Cek kesadaran korban
3. Hentikan perdarahan
4. Bersihkan luka
5. Balut dengan steril
6. Imobilisasi jika perlu
7. Rujuk ke tenaga medis

⚠️ Selalu bawa P3K saat pendakian!`;
    }

    // ==================== TOPIK: ROCK CLIMBING ====================
    if (/(rock climbing|panjat tebing|climbing|pemanjatan|tebing alam|wall climbing|harness|carabiner|simpul|anchor|prusik|figure eight|panjat|tebing|belay|rappelling|abseiling)/i.test(msg) || (hasApa && /(rock climbing|panjat tebing|climbing)/i.test(msg)) || (hasBagaimana && /(panjat|climbing)/i.test(msg))) {
        if (/(harness|sabuk pengaman|selempang panjat)/i.test(msg)) {
            return `🪢 <strong>HARNESS (SABUK PENGAMAN PANJAT)</strong>

📌 <strong>FUNGSI:</strong>
Menghubungkan tubuh pemanjat dengan sistem tali pengaman.

📌 <strong>BAGIAN:</strong>
1. <strong>WAIST BELT</strong> — Menahan beban utama jatuh
2. <strong>LEG LOOP</strong> — Stabilitas & kenyamanan
3. <strong>BELAY LOOP</strong> — Tempat ATC, Grigri, carabiner
4. <strong>GEAR LOOP</strong> — Tempat carabiner, quickdraw

📌 <strong>PEMERIKSAAN:</strong>
✓ Cek jahitan tidak putus
✓ Cek gesper berfungsi baik
✓ Cek webbing tidak sobek
✓ Pastikan ukuran PAS & tidak longgar
✓ Cek tanggal kedaluwarsa (5-10 tahun)`;
        }

        if (/(carabiner|gesper|kaitan pengaman)/i.test(msg)) {
            return `🔗 <strong>CARABINER — FUNGSI & JENIS</strong>

📌 <strong>JENIS BENTUK:</strong>
• <strong>OVAL</strong> — Serbaguna, beban merata
• <strong>D SHAPE</strong> — Lebih kuat, untuk belay & anchor
• <strong>HMS (Pear Shape)</strong> — Untuk belaying dengan munter hitch

📌 <strong>JENIS GATE:</strong>
• <strong>SCREW LOCK</strong> — Manual, paling umum
• <strong>AUTO LOCK</strong> — Otomatis mengunci, lebih aman
• <strong>WIRE GATE</strong> — Ringan & anti-beku, untuk quickdraw

⚠️ <strong>STANDAR KEAMANAN:</strong>
Carabiner harus memiliki sertifikasi UIAA/CE minimal 20kN!`;
        }

        if (/(simpul|figure eight|prusik|knot|simpul pengaman|simpul mati|simpul hidup)/i.test(msg)) {
            if (/(figure eight|angka delapan|simpul figure|simpul harness)/i.test(msg)) {
                return `🪢 <strong>SIMPUL FIGURE EIGHT FOLLOW THROUGH</strong>

📌 <strong>KEGUNAAN:</strong>
Simpul paling aman untuk mengikat tali ke harness.

📌 <strong>KELEBIHAN:</strong>
✓ Sangat kuat (hanya 20-30% penurunan kekuatan)
✓ Tidak mudah terlepas
✓ Mudah diperiksa kebenarannya
✓ Stabil & tidak berubah bentuk saat dibebani

📌 <strong>CARA:</strong>
1️⃣ Buat simpul figure eight di ujung tali
2️⃣ Masukkan ujung tali ke harness (belay loop)
3️⃣ Ikuti jalur tali kembali (follow through)
4️⃣ Pastikan simpul rapi & tidak terpuntir
5️⃣ Sisa tali (tail) minimal 5-10cm
6️⃣ Buat stopper knot (double overhand) untuk safety

⚠️ <strong>SAFETY CHECK:</strong>
✓ Tidak ada lipatan
✓ Tali tidak terpuntir
✓ Tail cukup panjang`;
            }

            if (/(prusik|simpul prusik)/i.test(msg)) {
                return `🪢 <strong>SIMPUL PRUSIK</strong>

📌 <strong>DEFINISI:</strong>
Simpul yang dapat bergerak satu arah (slide) dan mengunci saat diberikan beban.

📌 <strong>KEGUNAAN:</strong>
1. <strong>BACKUP</strong> saat rappelling
2. <strong>ASCENDING</strong> (naik di tali statis)
3. <strong>SELF-RESCUE</strong> jika terjebak
4. <strong>MEKANIKAL ADVANTAGE</strong> (3:1 atau 5:1)
5. <strong>MENGENCANGKAN</strong> tiang tenda

📌 <strong>CARA:</strong>
1. Gunakan cord (tali kecil) diameter 5-7mm
2. Lilitkan ke tali utama 3-4 putaran
3. Masukkan ujung cord ke dalam lilitan
4. Tarik hingga kencang

📌 <strong>KEUNGGULAN:</strong>
✓ Tidak merusak selubung tali
✓ Bisa dipasang & dilepas dengan mudah
✓ Bisa diaplikasikan di berbagai cuaca`;
            }
        }

        if (/(anchor|sistem anchor|sistem pengaman|serene)/i.test(msg)) {
            return `⚓ <strong>PRINSIP ANCHOR SERENE</strong>

📌 <strong>APA ITU ANCHOR?</strong>
Anchor adalah titik pengaman utama yang menghubungkan pemanjat ke tebing.

📌 <strong>PRINSIP SERENE:</strong>

<strong>S — STRONG (Kuat)</strong>
✓ Bahan anchor harus kuat menahan beban minimal 15kN (~1500kg)
✓ Gunakan baut Hilti, pohon besar hidup, batuan solid

<strong>E — EQUALIZED (Setara)</strong>
✓ Beban terdistribusi merata ke semua titik anchor
✓ Gunakan sling atau cordelette

<strong>R — REDUNDANT (Berlebih)</strong>
✓ Minimal 2 titik pengaman independen
✓ Jika satu titik gagal, titik lain masih bisa menahan

<strong>E — EFFICIENT (Efisien)</strong>
✓ Sistem tidak berbelit-belit
✓ Mudah diperiksa
✓ Tidak boros bahan/alat

<strong>N — NO EXTENSION (Tanpa Ekstensi)</strong>
✓ Jika satu titik anchor gagal, sistem tidak memanjang mendadak
✓ Mencegah shock loading

⚠️ <strong>INGAT:</strong>
Anchor adalah sistem yang menyatukan nyawa pemanjat. JANGAN PERNAH kompromi!`;
        }

        return `🧗 <strong>ROCK CLIMBING — DASAR</strong>

📌 <strong>JENIS:</strong>
• <strong>BOULDERING</strong> — Tinggi rendah (<4-5m), tanpa tali
• <strong>TOP ROPE</strong> — Tali dari atas, paling aman untuk pemula
• <strong>LEAD CLIMBING</strong> — Pemanjat membawa tali, clip ke quickdraw
• <strong>TRAD CLIMBING</strong> — Pasang perlengkapan sendiri di celah tebing
• <strong>SPORT CLIMBING</strong> — Bolt permanen, lebih aman

📌 <strong>PERLENGKAPAN:</strong>
✓ Harness (sabuk pengaman)
✓ Helmet (helm)
✓ Carabiner
✓ Belay device (ATC/Grigri)
✓ Dynamic rope
✓ Climbing shoes
✓ Chalk bag

📌 <strong>TEKNIK DASAR:</strong>
• Gunakan kaki lebih dari tangan
• Jaga 3 titik kontak (tripod)
• Bernapas dengan rileks
• Jangan panik saat jatuh`;
    }

    // ==================== TOPIK: LEAVE NO TRACE & KONSERVASI ====================
    if (/(leave no trace|lnt|etika pecinta alam|prinsip lnt|tidak meninggalkan jejak|konservasi|sampah|sampah gunung|bersih sampah|menjaga alam|pelestarian|lingkungan|hijau|reboisasi|penghijauan|baksos|bakti sosial)/i.test(msg) || (hasApa && /(lnt|konservasi|leave no trace)/i.test(msg))) {
        if (/(sampah|sampah gunung|bersih sampah|bawa turun|pengelolaan sampah|buang sampah)/i.test(msg)) {
            return `🗑️ <strong>PENGELOLAAN SAMPAH SAAT PENDAKIAN</strong>

📌 <strong>PRINSIP UTAMA:</strong>
<strong>BAWA TURUN SEMUA SAMPAH ANDA!</strong>

📌 <strong>TIPS:</strong>
• Pisahkan sampah basah & kering
• Bawa kantong sampah khusus (ziplock / trash bag)
• Jangan buang sampah di pos pendakian
• Sampah organik pun lebih baik dibawa turun
• Jika kuat, bawa turun sampah orang lain (trail magic!)

📌 <strong>LARANGAN:</strong>
✗ Membuang sampah di jalur pendakian
✗ Membakar sampah plastik (asap beracun)
✗ Mengubur sampah anorganik (hewan bisa menggali)

🌿 <strong>INGAT:</strong>
Gunung bukan tempat sampah! Jaga keindahan alam untuk generasi mendatang.`;
        }

        return `🌿 <strong>7 PRINSIP LEAVE NO TRACE</strong>

1️⃣ <strong>RENCANAKAN & PERSIAPKAN</strong>
Ketahui peraturan, siapkan perlengkapan sesuai medan.

2️⃣ <strong>BERADA DI PERMUKAAN TAHAN BANTING</strong>
Gunakan jalan setapak yang sudah ada, camping di area established.

3️⃣ <strong>KELOLA SAMPAH DENGAN BENAR</strong>
<strong>BAWA TURUN SEMUA SAMPAH!</strong>

4️⃣ <strong>TINGGALKAN APA YANG ANDA TEMUKAN</strong>
Jangan mengambil flora/fauna, batu, kristal.

5️⃣ <strong>MINIMALKAN DAMPAK API UNGGUN</strong>
Gunakan kompor, gunakan fire ring yang sudah ada, pastikan api PADAM!

6️⃣ <strong>HORMATI SATWA LIAR</strong>
Jangan memberi makan, jangan mendekati, jangan flash.

7️⃣ <strong>HORMATI PENGUNJUNG LAIN</strong>
Jaga ketenangan, beri jalan, sapa & ramah.

📌 <strong>MOTTO LNT:</strong>
"Take only pictures, leave only footprints, kill only time"`;
    }

    // ==================== TOPIK: UST & TAMANSISWA ====================
    if (/(ust|universitas sarjanawiyata|ust yogyakarta|kampus ust|tamansiswa|ki hajar|bapak pendidikan|ki hadjar|tut wuri handayani|ing ngarsa sung tuladha|perguruan tamansiswa|pendidikan tamansiswa)/i.test(msg) || (hasApa && /(ust|tamansiswa|ki hajar)/i.test(msg)) || (hasSiapa && /(ki hajar|pendiri ust)/i.test(msg))) {
        if (/(ki hajar|bapak pendidikan|ki hadjar|tut wuri handayani|ing ngarsa sung tuladha|ki hajar dewantara)/i.test(msg)) {
            return `📚 <strong>KI HAJAR DEWANTARA</strong>

📌 <strong>IDENTITAS:</strong>
• Nama: Raden Mas Soewardi Soerjaningrat
• Lahir: 2 Mei 1889, Yogyakarta
• Wafat: 26 April 1959
• Tanggal lahir = Hardiknas

📌 <strong>SEMBOYAN TAMANSISWA:</strong>
<strong>"ING NGARSA SUNG TULADHA"</strong> — Di depan, memberi teladan
<strong>"ING MADYA MANGUN KARSA"</strong> — Di tengah, membangun semangat
<strong>"TUT WURI HANDAYANI"</strong> — Di belakang, memberi dorongan

📌 <strong>PRINSIP TAMANSISWA (PANCA DHARMA):</strong>
1. Kodrat Alam
2. Kemerdekaan
3. Kebudayaan
4. Kebangsaan
5. Kemanusiaan

📌 <strong>JASA:</strong>
Pahlawan Nasional (1959), Menteri Pendidikan pertama Indonesia.`;
        }

        return `🏛️ <strong>UNIVERSITAS SARJANAWIYATA TAMANSISWA (UST)</strong>

📌 <strong>INFORMASI:</strong>
• Didirikan: <strong>15 Desember 1955</strong>
• Berada di bawah: Majelis Luhur Persatuan Tamansiswa
• Pendiri: Ki Hajar Dewantara
• Alamat: Jl. Batikan UH III/1043, Tuntungan, Umbulharjo, Yogyakarta
• Website: www.ustjogja.ac.id

📌 <strong>FAKULTAS:</strong>
• Fakultas Keguruan dan Ilmu Pendidikan (FKIP)
•Fakultas Ekonomi
•Fakultas Pertanian
•Fakultas Psikologi
•Fakultas Teknik

📌 <strong>ORGANISASI MAHASISWA:</strong>
✓ BEM UST, DPM
✓ UKM Olahraga, Seni, Penalaran
✓ <strong>MAPATEK ABHIPRAYA (Pecinta Alam)</strong> 🏔️

📌 <strong>VISI:</strong>
"Menjadi universitas unggul & berdaya saing berbasis kearifan lokal Tamansiswa tahun 2030"`;
    }

    // ==================== TOPIK: KEGIATAN & JADWAL ====================
    if (/(kegiatan|jadwal|latihan|event|acara|info kegiatan|latihan rutin|jadwal latihan|agenda|kegiatan mapatek|kegiatan apa|aktivitas|program|agenda mapatek|rencana kegiatan)/i.test(msg) || (hasKapan && /(kegiatan|latihan|event|acara)/i.test(msg))) {
        return `📅 <strong>KEGIATAN & JADWAL MAPATEK</strong>

📌 <strong>KEGIATAN RUTIN:</strong>
• Latihan rutin: Sabtu, 15.00-17.00 WIB
• Rock climbing: Minggu pagi (Tebing Gamping)
• Pendakian: 1x sebulan

📌 <strong>KEGIATAN TAHUNAN:</strong>
• DIKSAR — Maret & September
• Ekspedisi Besar — Juni/Agustus
• Bakti Sosial & Konservasi — Desember
• Halal Bihalal & Syukuran — Lebaran

📌 <strong>AKAN DATANG (2026):</strong>
• 15 Juni 2026: DIKSAR LitaniAram
• 22 Juni 2026: Ekspedisi Gunung Prau
• 5 Juli 2026: Bakti Sosial Pantai
• 12 Juli 2026: Latihan Rock Climbing
• 1 Agustus 2026: Pendakian Gunung Merbabu

📌 <strong>INFO LENGKAP:</strong>
Cek Instagram @mapatek_abhipraya atau bagian Kalender di website!`;
    }

    // ==================== TOPIK: KONTAK ====================
    if (/(kontak|hubungi|wa|instagram|email|telepon|basecamp|lokasi|sekretariat|nomor telepon|alamat|sosmed|media sosial|contact|telegram|line|whatsapp)/i.test(msg) || (hasBagaimana && /(kontak|hubungi|wa|instagram|email)/i.test(msg)) || (hasDimana && /(basecamp|sekretariat|kantor|markas)/i.test(msg))) {
        return `📞 <strong>KONTAK MAPATEK ABHIPRAYA</strong>

📌 <strong>MEDIA SOSIAL:</strong>
• <strong>WhatsApp Admin Utama:</strong> 0822-1442-8371 (Fridolinus)
• <strong>Instagram Resmi:</strong> @mapatek_abhipraya
• <strong>Email Resmi:</strong> mapatek.abhipraya@gmail.com
• <strong>Email Kampus:</strong> mapatek@ustjogja.ac.id

📌 <strong>BASECAMP (SEKRETARIAT):</strong>
📍 UST Yogyakarta — Jl. Batikan UH III/1043, Tuntungan, Umbulharjo

📌 <strong>JAM OPERASIONAL:</strong>
• Senin - Jumat: 15.00 - 18.00 WIB
• Sabtu: 09.00 - 12.00 WIB

📌 <strong>KERJA SAMA & DONASI:</strong>
Hubungi Ketua Umum (085-952-824-898) atau Sekretaris Jenderal (0815-2272-3325).`;
    }

    // ==================== TOPIK: CUACA ====================
    if (/(cuaca|hujan|panas|dingin|berawan|cerah|suhu|temperatur|prakiraan cuaca|info cuaca|cuaca gunung|angkasa|mendung|petir)/i.test(msg)) {
        return `🌤️ <strong>INFO CUACA GUNUNG</strong>

Untuk informasi cuaca terkini, Anda bisa cek:
• Website BMKG (www.bmkg.go.id)
• Aplikasi cuaca (Windy, Weather.com, AccuWeather)
• Atau lihat bagian "Info Cuaca" di website kami yang menampilkan data real-time dari OpenWeatherMap.

📌 Tips: Cuaca di gunung bisa berubah cepat. Selalu bawa jaket dan raincoat!`;
    }

    // ==================== TOPIK: DESTINASI / TEMPAT WISATA ====================
    if (/(destinasi|tempat wisata|rekomendasi tempat|liburan|pantai|air terjun|pemandian|wisata alam|objek wisata|tempat seru|tempat keren)/i.test(msg)) {
        return `🏞️ <strong>REKOMENDASI DESTINASI ALAM</strong>

Beberapa destinasi favorit MAPATEK:
1. Gunung Prau (Dieng) — Sunrise terbaik
2. Pantai Baros — Konservasi & bersih pantai
3. Air Terjun Kedung Kayang — Eksplorasi
4. Tebing Gamping — Rock climbing
5. Gunung Merbabu — Sabana luas
6. Desa Pentingsari — Edukasi & konservasi

📌 Untuk rekomendasi lebih detail, hubungi admin atau cek agenda kami.`;
    }

    // ==================== TOPIK: TENTANG DIRI SAYA (CHATBOT) ====================
    if (/(siapa kamu|kamu siapa|apa kamu|kamu itu apa|siapa anda|anda siapa|perkenalan|kenalan|halo siapa|kenalin dong|chatbot apa|bot apa|ini bot apa)/i.test(msg)) {
        return `🤖 <strong>Halo! Saya Asisten Virtual MAPATEK Abhipraya.</strong>

Saya adalah chatbot cerdas yang dibuat untuk membantu Anda mendapatkan informasi tentang:

✅ Organisasi MAPATEK (sejarah, visi misi, struktur)
✅ Pendaftaran anggota & DIKSAR
✅ Pendakian gunung & persiapan
✅ Rock climbing & teknik panjat
✅ Survival & P3K di alam
✅ Konservasi & Leave No Trace
✅ UST Yogyakarta & Tamansiswa
✅ Kegiatan & agenda terbaru

💡 Saya siap membantu 24/7! Cukup ketik pertanyaan Anda.`;
    }

    // ==================== TOPIK: TENTANG USER ====================
    if (/(kamu tau aku|tau aku|kenal aku|aku siapa|siapa saya|tahu saya|anda tahu saya|apakah kamu tahu saya)/i.test(msg)) {
        return `😊 Maaf, saya tidak memiliki data tentang Anda karena saya tidak menyimpan informasi pribadi. Tapi saya senang bisa membantu Anda hari ini! Ada yang bisa saya bantu?`;
    }

    // ==================== MENANGANI PERTANYAAN DENGAN "KENAPA" ====================
    if (hasKenapa) {
        if (/(kenapa|mengapa) (harus|perlu|wajib|sebaiknya)/i.test(msg)) {
            return `🤔 Pertanyaan bagus! 

Untuk menjawab "kenapa", jawabannya biasanya terkait dengan keamanan, efektivitas, atau nilai-nilai organisasi. 

Bisa Anda spesifikkan pertanyaannya? Misalnya:
• Kenapa harus mengikuti DIKSAR?
• Kenapa harus bawa 10 Essentials?
• Kenapa MAPATEK didirikan?

Saya akan jelaskan dengan detail! 😊`;
        }
        return `🤔 Hmm, pertanyaan "kenapa" yang bagus! 

Jika Anda bertanya tentang aturan atau prosedur, biasanya alasannya adalah untuk keselamatan dan kenyamanan bersama. 

Coba tanyakan lebih spesifik, misalnya:
• "Kenapa harus bawa sampah turun?"
• "Kenapa DIKSAR wajib diikuti?"
• "Kenapa MAPATEK didirikan?"

Saya akan jawab dengan lengkap!`;
    }

    // ==================== PERTANYAAN UMUM LAINNYA ====================
    // Jika pesan mengandung "tolong" atau "bantu"
    if (/(tolong|bantu|help|pls|please)/i.test(msg)) {
        return `🙏 Tentu! Saya siap membantu. 

Coba tanyakan salah satu topik ini:
• "Apa itu MAPATEK?"
• "Cara daftar anggota"
• "Rekomendasi gunung pemula"
• "10 Essentials pendakian"
• "Kontak MAPATEK"

Atau tanyakan langsung apa yang Anda ingin ketahui! 😊`;
    }

    // Jika pesan mengandung "makasih" atau terima kasih sudah ditangani di awal

    // ==================== DEFAULT / FALLBACK (RAMAH & INFORMATIF) ====================
    return `🌿 <strong>PERTANYAAN ANDA SANGAT BAGUS!</strong>

Maaf, saya belum memiliki jawaban spesifik untuk pertanyaan tersebut. Namun, saya bisa membantu dengan topik-topik berikut:

📌 <strong>COBA TANYAKAN TENTANG:</strong>

🏔️ <strong>MAPATEK & ORGANISASI</strong>
• Sejarah, Visi Misi, Struktur, Angkatan
• Pendaftaran & DIKSAR

⛰️ <strong>PENDAKIAN GUNUNG</strong>
• Persiapan pendakian & 10 Essentials
• Teknik packing carrier
• Rekomendasi gunung pemula

🧗 <strong>ROCK CLIMBING</strong>
• Harness, Carabiner, Simpul
• Anchor SERENE

🔥 <strong>SURVIVAL & P3K</strong>
• Membuat api, shelter, menjernihkan air
• Hipotermia, gigitan ular, patah tulang, CPR

🌱 <strong>KONSERVASI</strong>
• Leave No Trace (LNT)

🏫 <strong>UST & TAMANSISWA</strong>
• Informasi kampus, Ki Hajar Dewantara

📢 <strong>INFO KEGIATAN</strong>
• Jadwal, kontak, basecamp

📞 Atau hubungi admin di <strong>0822-1442-8371</strong> untuk info lebih lanjut!

Terima kasih sudah bertanya! 😊`;
}

// ================================================================
// FUNGSI PEMBANTU: Random Response untuk variasi
// ================================================================
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// ================================================================
// EKSPOSE FUNGSI KE GLOBAL
// ================================================================
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.escapeHtml = escapeHtml;
window.getIntelligentResponse = getIntelligentResponse;
window.getRandomResponse = getRandomResponse;
window.filterKategori = filterKategori;
window.filterArsip = filterArsip;
window.toggleMenu = toggleMenu;
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.escapeHtml = escapeHtml;
window.getIntelligentResponse = getIntelligentResponse;

window.updateCountdown = updateCountdown;
window.loadTestimoni = loadTestimoni;
window.updateTestimoni = updateTestimoni;
window.nextTestimoni = nextTestimoni;
window.prevTestimoni = prevTestimoni;
window.goToTestimoni = goToTestimoni;
window.loadLeaderboard = loadLeaderboard;
window.loadPolling = loadPolling;
window.votePolling = votePolling;
window.loadCuacaRealtime = loadCuacaRealtime;
window.loadPeta = loadPeta;
window.loadBerita = loadBerita;
window.loadKalender = loadKalender;
window.changeMonth = changeMonth;
window.filterKalender = filterKalender;
window.loadFAQ = loadFAQ;
window.toggleFAQ = toggleFAQ;
window.loadQuizQuestion = loadQuizQuestion;
window.answerQuiz = answerQuiz;
window.restartQuiz = restartQuiz;
window.copyToClipboard = copyToClipboard;
window.openGlobalSearch = openGlobalSearch;
window.closeGlobalSearch = closeGlobalSearch;
window.performGlobalSearch = performGlobalSearch;
window.navigateTo = navigateTo;
window.loadAgenda = loadAgenda;
window.loadGaleri = loadGaleri;
window.animateCounter = animateCounter;
window.toggleDarkMode = toggleDarkMode;
window.scrollToTop = scrollToTop;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.loadAgendaFromJSON = loadAgendaFromJSON;
// ================================================================
// CLOSE CHATBOT SAAT KLIK DI LUAR
// ================================================================
document.addEventListener('click', function(event) {
    const widget = document.querySelector('.chatbot-widget');
    const container = document.getElementById('chatbotContainer');
    if (container && container.classList.contains('active') && widget && !widget.contains(event.target)) {
        container.classList.remove('active');
    }
});