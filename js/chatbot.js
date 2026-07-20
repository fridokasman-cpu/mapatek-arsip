// ================================================================
// CHATBOT — Asisten Virtual MAPATEK Super Pintar (HYBRID: LOKAL + AI)
// ================================================================

// ================================================================
// Persona sistem untuk menjaga gaya bahasa chatbot tetap konsisten
// ================================================================
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
        await delay(400 + Math.random() * 300);
        appendBotMessage(messagesContainer, localResponse);
        return;
    }

    // 2) Tidak ada jawaban lokal yang cocok -> tampilkan indikator "sedang mengetik"
    const typingId = showTypingIndicator(messagesContainer);

    try {
        const aiResponse = await fetchAIResponse(message);
        removeTypingIndicator(typingId);
        appendBotMessage(messagesContainer, aiResponse);
    } catch (error) {
        console.error('Gagal memanggil API AI:', error);
        removeTypingIndicator(typingId);
        appendBotMessage(
            messagesContainer,
            'Maaf, koneksi ke otak AI saya sedang terganggu. Silakan coba lagi nanti, atau hubungi admin MAPATEK di 0822-1442-8371.'
        );
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function removeTypingIndicator(typingId) {
    const el = document.getElementById(typingId);
    if (el) el.remove();
}

/**
 * FALLBACK AI — Menggunakan Groq Cloud (GRATIS, SUPER CEPAT)
 */
/**
 * FALLBACK AI — Aman via serverless proxy (Vercel)
 */
/**
 * FALLBACK AI — Aman via serverless proxy (Vercel)
 */
async function fetchAIResponse(message) {
    try {
        // Panggil proxy serverless, bukan Groq langsung
        const response = await fetch('/api/groq-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Kirim body persis seperti yang diharapkan Groq
                model: "llama-3.3-70b-versatile",  // atau model lain yang Anda pakai
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
            console.error("🚨 Error Proxy:", errorData);
            throw new Error(`Proxy Error: ${response.status}`);
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
 * KNOWLEDGE BASE LOKAL (hanya contoh, silakan tambahkan sendiri)
 * ================================================================
 */
function getIntelligentResponse(message) {
    const msg = message.toLowerCase().trim();

    if (/(halo|hai|hello|hi|hey)/i.test(msg)) {
        return getRandomResponse([
            "👋 Halo! Senang bertemu dengan Anda. Saya Asisten MAPATEK Abhipraya. Ada yang bisa saya bantu?",
            "🌲 Hai! Selamat datang di MAPATEK. Saya siap menjawab pertanyaan seputar pecinta alam, pendakian, atau organisasi kami.",
            "🏔️ Halo! Apa yang ingin Anda ketahui tentang MAPATEK? Saya siap membantu."
        ]);
    }

    if (/(terima kasih|makasih|thanks)/i.test(msg)) {
        return getRandomResponse([
            "😊 Sama-sama! Senang bisa membantu.",
            "🙏 Terima kasih kembali! Selalu semangat berpetualang! 🏔️",
            "👍 Siap membantu kapan saja."
        ]);
    }

    if (/(bahasa inggris|english|speak english)/i.test(msg)) {
        return "Sure! I can speak English. 🌍 As the MAPATEK Abhipraya Virtual Assistant, I can help you with information about our organization, hiking, survival, rock climbing, and UST Yogyakarta. What would you like to know? 🏔️";
    }

    if (/(visi|misi)/i.test(msg)) {
        return `🎯 <strong>VISI & MISI MAPATEK ABHIPRAYA</strong>\n\n<strong>🌟 VISI:</strong>\n"Menjadi organisasi mahasiswa pecinta alam yang unggul, profesional, berkarakter, berjiwa konservasi, dan berlandaskan nilai-nilai Tamansiswa."\n\n<strong>📌 MISI:</strong>\n1. Mengembangkan SDM berkualitas\n2. Meningkatkan keterampilan teknis\n3. Melestarikan lingkungan\n4. Mempererat solidaritas\n5. Menjalin kerjasama\n6. Mengabdikan kegiatan\n7. Menanamkan kepemimpinan`;
    }

    if (/(mapatek|apa itu mapatek)/i.test(msg)) {
        return `🌲 <strong>MAPATEK ABHIPRAYA</strong>\n\n📌 MAPATEK = Mahasiswa Pencinta Alam Teknik\n📌 ABHIPRAYA = Harapan / Cita-cita (Sanskerta)\n📅 Berdiri: 19 Maret 2023 di UST Yogyakarta\n\n🏔️ Bidang Kegiatan: Ekspedisi, Rock Climbing, Konservasi, DIKSAR, Bakti Sosial`;
    }

    // Tambahkan lebih banyak logika lokal sesuai kebutuhan...

    // FALLBACK KE AI
    return null;
}

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
window.fetchAIResponse = fetchAIResponse;

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
