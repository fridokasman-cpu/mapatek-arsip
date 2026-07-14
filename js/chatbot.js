// ================================================================
// CHATBOT — Asisten Virtual MAPATEK Super Pintar (HYBRID: LOKAL + AI)
// ================================================================

// ================================================================
// KONFIGURASI CHATBOT AI (GEMINI)
// ================================================================
// Gunakan nama variabel yang UNIK agar tidak bentrok dengan API_KEY cuaca
// ================================================================
// KONFIGURASI CHATBOT AI (GEMINI)
// ================================================================
// Ambil API Key dari file config.js (tidak di-commit)
// ================================================================
// KONFIGURASI CHATBOT AI (GEMINI) — Ambil dari config.js
// ================================================================
// ================================================================
// CONFIG — API Keys (JANGAN COMMIT FILE INI!)
// ================================================================
// File ini akan diabaikan oleh .gitignore

const GROQ_API_KEY = "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";

window.GROQ_API_KEY = GROQ_API_KEY;
// Persona sistem untuk menjaga gaya bahasa chatbot tetap konsisten
const SYSTEM_PROMPT = `Kamu adalah Asisten Virtual MAPATEK Abhipraya, sebuah organisasi mahasiswa pecinta alam di Universitas Sarjanawiyata Tamansiswa (UST) Yogyakarta.
Gaya bahasamu: ramah, profesional, suka menolong, dan sedikit bernuansa cinta alam (boleh menyisipkan istilah/analogi alam & petualangan secukupnya, jangan berlebihan).
Kamu bisa menjawab pertanyaan umum apa saja (sains, sejarah, matematika, teknologi, dll) dengan jelas dan ringkas.
Format jawabanmu boleh menggunakan HTML sederhana seperti <strong>, <ul>, <li>, <br> agar rapi saat ditampilkan di jendela chat, tapi JANGAN gunakan tag <script> atau atribut event (onclick, onerror, dsb).
Jika relevan, kamu boleh mengarahkan pengguna untuk bertanya lebih lanjut seputar MAPATEK, pendakian, atau alam terbuka.`;

/**
 * Toggle tampilan chatbot
 */
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    if (container) {
        container.classList.toggle('active');
        if (container.classList.contains('active')) {
            setTimeout(() => document.getElementById('chatInput').focus(), 300);
        }
    }
}

/**
 * Escape HTML untuk keamanan (dipakai untuk pesan USER)
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Kirim pesan user ke chatbot (ASYNC — mendukung fallback ke AI)
 */
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');

    // Tampilkan pesan user (selalu di-escape untuk mencegah XSS)
    const userDiv = document.createElement('div');
    userDiv.className = 'message user';
    userDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-user" style="font-size:0.7rem;"></i></div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(userDiv);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 1) Cek dulu apakah ada jawaban LOKAL (instan, sesuai branding MAPATEK)
    const localResponse = getIntelligentResponse(message);

    if (localResponse !== null) {
        // Ada jawaban lokal yang cocok -> tampilkan dengan delay natural
        await delay(400 + Math.random() * 300);
        appendBotMessage(messagesContainer, localResponse);
        return;
    }

    // 2) Tidak ada jawaban lokal yang cocok -> tampilkan indikator "sedang mengetik"
    const typingId = showTypingIndicator(messagesContainer);

    try {
        // 3) Panggil AI eksternal sebagai fallback
        const aiResponse = await fetchAIResponse(message);
        removeTypingIndicator(typingId);
        appendBotMessage(messagesContainer, aiResponse);
    } catch (error) {
        // 4) Jika API gagal (key salah, kuota habis, error jaringan, dll)
        console.error('Gagal memanggil API AI:', error);
        removeTypingIndicator(typingId);
        appendBotMessage(
            messagesContainer,
            'Maaf, koneksi ke otak AI saya sedang terganggu. Silakan coba lagi nanti, atau hubungi admin MAPATEK di 0822-1442-8371.'
        );
    }
}

/**
 * Helper: delay berbasis Promise (untuk efek balasan natural)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper: tampilkan bubble jawaban bot ke dalam chat
 */
function appendBotMessage(messagesContainer, response) {
    const botDiv = document.createElement('div');
    botDiv.className = 'message bot';
    botDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot" style="font-size:0.7rem;"></i></div>
        <div class="message-content">${response}</div>
    `;
    messagesContainer.appendChild(botDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Helper: tampilkan indikator "Sedang mengetik..." saat menunggu AI
 */
function showTypingIndicator(messagesContainer) {
    const typingDiv = document.createElement('div');
    const typingId = 'typing-' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot" style="font-size:0.7rem;"></i></div>
        <div class="message-content">
            <span class="typing-dots">
                <em>Sedang mengetik<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></em>
            </span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingId;
}

/**
 * Helper: hapus indikator "Sedang mengetik..."
 */
function removeTypingIndicator(typingId) {
    const el = document.getElementById(typingId);
    if (el) el.remove();
}

/**
 * FALLBACK AI — Dipanggil HANYA jika tidak ada jawaban lokal yang cocok
 */
async function fetchAIResponse(message) {
    try {
        const model = "llama3-8b-8192"; // Bisa ganti ke "mixtral-8x7b-32768" jika mau
        const url = "https://api.groq.com/openai/v1/chat/completions";

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah Asisten Virtual MAPATEK Abhipraya. Ramah, profesional, suka menolong, dan bernuansa cinta alam. Jawab dengan jelas dan ringkas."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("🚨 Detail Error Groq:", errorData);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiText = data?.choices?.[0]?.message?.content;

        if (!aiText) {
            throw new Error("Respons AI kosong");
        }

        return aiText.replace(/\n/g, '<br>');
    } catch (error) {
        console.error("Gagal AI:", error);
        return "Maaf, koneksi ke otak AI saya sedang terganggu. Silakan coba lagi nanti, atau hubungi admin MAPATEK di 0822-1442-8371.";
    }
}
/**
 * ================================================================
 * KNOWLEDGE BASE — Sistem respons cerdas SUPER LENGKAP (LOKAL)
 * ================================================================
 * PENTING: Fungsi ini mengembalikan `null` jika tidak ada aturan lokal yang cocok.
 * (Semua logika pencocokan regex yang sudah ada TETAP DIPERTAHANKAN sepenuhnya.
 *  Saya hanya menyertakan beberapa bagian sebagai contoh — panjangnya ribuan baris,
 *  jadi saya singkat di sini dengan asumsi kode lengkap Anda sudah ada.)
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

    // ==================== PERMINTAAN BAHASA INGGRIS ====================
    if (/(bahasa inggris|english|speak english|can you speak english)/i.test(msg)) {
        return "Sure! I can speak English. 🌍 As the MAPATEK Abhipraya Virtual Assistant, I can help you with information about our organization, hiking, survival, rock climbing, and UST Yogyakarta. What would you like to know? 🏔️";
    }

    // ==================== PERTANYAAN DENGAN KATA TANYA ====================
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

    // ==================== SISANYA (ribuan baris) ====================
    // ... (semua logika regex lain tetap sama seperti kode asli Anda) ...

    // ==================== FALLBACK KE AI ====================
    // Tidak ada aturan lokal yang cocok -> kembalikan null.
    return null;
}

// ================================================================
// FUNGSI PEMBANTU: Random Response untuk variasi
// ================================================================
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// ================================================================
// EKSPOSE FUNGSI KE GLOBAL (HANYA YANG DIPERLUKAN)
// ================================================================
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.escapeHtml = escapeHtml;
window.getIntelligentResponse = getIntelligentResponse;
window.getRandomResponse = getRandomResponse;
window.fetchAIResponse = fetchAIResponse;
// (Semua fungsi lain yang tidak terkait chatbot TIDAK diekspor di sini)

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
