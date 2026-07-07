// ==================== CHATBOT ====================
function toggleChatbot() {
    document.getElementById('chatbotContainer').classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user';
    userMessageDiv.innerHTML = `<div class="message-avatar"><i class="fas fa-user" style="font-size: 0.7rem;"></i></div><div class="message-content">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(userMessageDiv);
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    setTimeout(() => {
        const botResponse = getIntelligentResponse(message);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot';
        botMessageDiv.innerHTML = `<div class="message-avatar"><i class="fas fa-robot" style="font-size: 0.7rem;"></i></div><div class="message-content">${botResponse}</div>`;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getIntelligentResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // Knowledge base yang sangat lengkap
    const knowledgeBase = {
        greetings: {
            patterns: ['halo', 'hai', 'hello', 'hi', 'hey', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'assalamualaikum'],
            response: "👋 Halo! Saya Asisten MAPATEK yang SUPER PINTAR! 🧠 Silakan tanyakan APAPUN tentang: 🏔️ MAPATEK & Organisasi, ⛰️ Pendakian Gunung, 🧗 Rock Climbing, 🧭 Navigasi, 🔥 Survival, ⛑️ P3K, 🌱 Konservasi, 🏫 UST & Tamansiswa. Apa yang ingin Anda tanyakan hari ini?"
        },
        thanks: {
            patterns: ['terima kasih', 'makasih', 'thanks', 'thank you'],
            response: "😊 Sama-sama! Senang bisa membantu. Jangan ragu bertanya lagi ya!"
        },
        mapatekProfile: {
            patterns: ['apa itu mapatek', 'mapatek abhipraya', 'mapatek itu apa', 'pengertian mapatek'],
            response: "🌲 <strong>MAPATEK ABHIPRAYA</strong> adalah organisasi mahasiswa pecinta alam yang resmi berdiri pada <strong>19 Maret 2023</strong> di UST Yogyakarta. Bidang: ekspedisi, konservasi, rock climbing, DIKSAR, dan bakti sosial."
        },
        pendaftaran: {
            patterns: ['pendaftaran', 'daftar', 'bergabung', 'join'],
            response: " Untuk mendaftar, cek bagian <strong>Pendaftaran</strong> di website ini. Atau hubungi WA admin: <strong>0822-1442-8371</strong>."
        },
        diksar: {
            patterns: ['diksar', 'pendidikan dasar'],
            response: "🎓 DIKSAR adalah pendidikan dasar kepencintaalaman selama 3 hari 2 malam. Materi: navigasi, survival, rock climbing, konservasi, dan kepemimpinan."
        },
        kontak: {
            patterns: ['kontak', 'wa', 'instagram', 'email'],
            response: " WA: 0822-1442-8371, IG: @mapatek_abhipraya, Email: mapatek.abhipraya@gmail.com"
        }
    };
    
    for (const [category, data] of Object.entries(knowledgeBase)) {
        for (const pattern of data.patterns) {
            if (msg.includes(pattern)) {
                return data.response;
            }
        }
    }
    
    return "🌿 Pertanyaan bagus! Coba tanyakan tentang: MAPATEK, pendaftaran, DIKSAR, pendakian, konservasi, UST, kontak, P3K, atau Leave No Trace.";
}

window.getIntelligentResponse = getIntelligentResponse;

document.addEventListener('click', function(event) {
    const widget = document.querySelector('.chatbot-widget');
    const container = document.getElementById('chatbotContainer');
    if (container.classList.contains('active') && !widget.contains(event.target)) {
        container.classList.remove('active');
    }
});