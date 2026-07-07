// ================================================================
// MAIN — Inisialisasi & Event Controller
// ================================================================

// ==================== NAVBAR TOGGLE ====================
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navLinks').classList.remove('active'));
});

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ==================== REVEAL ANIMATION ====================
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 100) el.classList.add('active');
    });
}

window.addEventListener('scroll', checkReveal);
checkReveal();

// ==================== FILTER ARSIP ====================
function filterArsip() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.arsip-item').forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(input) ? 'flex' : 'none';
    });
}

function filterKategori(kategori, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.arsip-item').forEach(item => {
        item.style.display = (kategori === 'all' || item.dataset.kategori === kategori) ? 'flex' : 'none';
    });
}

// ==================== STATUS PENDAFTARAN ====================
fetch('status.json?t=' + Date.now())
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('statusContainer');
        if (data.status === 'buka') {
            container.innerHTML = `
                <div class="status-box status-buka">
                    <div class="status-icon"><i class="fas fa-door-open"></i></div>
                    <h2 style="color:#065f46; font-size:1.75rem;">PENDAFTARAN DIBUKA! 🎉</h2>
                    <div class="info-periode"><i class="fas fa-calendar-alt"></i> ${data.periode}</div>
                    <p style="margin-top:1rem;">Ayo bergabung bersama keluarga besar Mapatek Abhipraya!<br>Isi formulir pendaftaran dengan klik tombol di bawah ini.</p>
                    <a href="${data.link_form}" target="_blank" class="btn-daftar"><i class="fas fa-pen-to-square"></i> DAFTAR SEKARANG</a>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="status-box status-tutup">
                    <div class="status-icon"><i class="fas fa-door-closed"></i></div>
                    <h2 style="color:#991b1b; font-size:1.75rem;">PENDAFTARAN DITUTUP</h2>
                    <p>${data.info_lanjutan}</p>
                    <div class="info-periode"><i class="fas fa-info-circle"></i> ${data.periode}</div>
                    <p style="margin-top:1rem;">Follow Instagram kami untuk info terbaru:<br><a href="https://instagram.com/mapatek_abhipraya" target="_blank" style="color:#e1306c;">@mapatek_abhipraya</a></p>
                </div>
            `;
        }
    })
    .catch(() => {
        document.getElementById('statusContainer').innerHTML = `
            <div class="status-box status-tutup">
                <div class="status-icon"><i class="fas fa-info-circle"></i></div>
                <h2 style="color:#991b1b;">INFORMASI PENDAFTARAN</h2>
                <p>Untuk informasi pendaftaran anggota baru, hubungi admin kami.</p>
                <div style="margin-top:1.5rem;">
                    <a href="https://wa.me/6282214428371" target="_blank" class="btn-daftar" style="background:#25D366;">
                        <i class="fab fa-whatsapp"></i> Chat Admin
                    </a>
                </div>
            </div>
        `;
    });

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    // Ctrl+K atau Cmd+K untuk membuka pencarian global
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (typeof openGlobalSearch === 'function') openGlobalSearch();
    }
    // ESC untuk menutup pencarian global
    if (e.key === 'Escape') {
        if (typeof closeGlobalSearch === 'function') closeGlobalSearch();
    }
});

// ==================== SCROLL EVENTS ====================
window.addEventListener('scroll', () => {
    const backBtn = document.getElementById('backToTop');
    if (window.scrollY > 300) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
});

// ==================== INIT DARK MODE ====================
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// ==================== LOAD ALL FEATURES ====================
window.addEventListener('load', () => {
    // Load semua konten
    if (typeof loadAgenda === 'function') loadAgenda();
    if (typeof loadGaleri === 'function') loadGaleri();
    if (typeof loadTestimoni === 'function') loadTestimoni();
    if (typeof loadLeaderboard === 'function') loadLeaderboard();
    if (typeof loadPolling === 'function') loadPolling();
    if (typeof loadCuacaRealtime === 'function') loadCuacaRealtime();
    if (typeof loadBerita === 'function') loadBerita();
    if (typeof loadKalender === 'function') loadKalender();
    if (typeof loadFAQ === 'function') loadFAQ();
    if (typeof loadQuizQuestion === 'function') loadQuizQuestion();
    
    // Load peta dengan delay (pastikan DOM sudah siap)
    if (typeof loadPeta === 'function') {
        setTimeout(loadPeta, 500);
    }
    
    // Animasi counter
    if (typeof animateCounter === 'function') {
        const memberEl = document.getElementById('memberCount');
        const expeditionEl = document.getElementById('expeditionCount');
        const trainingEl = document.getElementById('trainingCount');
        const documentEl = document.getElementById('documentCount');
        if (memberEl) animateCounter(memberEl, 50);
        if (expeditionEl) animateCounter(expeditionEl, 12);
        if (trainingEl) animateCounter(trainingEl, 8);
        if (documentEl) animateCounter(documentEl, 25);
    }
    
    // Auto-slide testimoni setiap 6 detik
    if (typeof nextTestimoni === 'function') {
        setInterval(nextTestimoni, 6000);
    }
    
    // Update countdown setiap detik
    if (typeof updateCountdown === 'function') {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Refresh cuaca setiap 30 menit
    if (typeof loadCuacaRealtime === 'function') {
        setInterval(loadCuacaRealtime, 1800000);
    }
    
    // Toast sambutan
    if (typeof showToast === 'function') {
        setTimeout(() => {
            showToast('✨ Selamat datang di Portal Kearsipan Mapatek Abhipraya!');
        }, 800);
    }
});

// ==================== FIX VIEWPORT MOBILE ====================
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

function fixViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && window.innerWidth < 480) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5');
    }
}

window.addEventListener('load', fixViewport);
window.addEventListener('resize', fixViewport);

// ================================================================
// EKSPOSE FUNGSI KE GLOBAL (agar bisa dipanggil dari HTML onclick)
// ================================================================
window.toggleMenu = toggleMenu;
window.filterArsip = filterArsip;
window.filterKategori = filterKategori;
window.fixViewport = fixViewport;

// Fungsi dari features.js (diekpose ulang untuk memastikan tersedia)
// Catatan: semua fungsi di features.js sudah diekspose di file tersebut,
// tapi kita pastikan kembali untuk menghindari error jika pemanggilan tidak berurutan.
(function ensureFunctionsExposed() {
    const functionsToExpose = [
        'toggleDarkMode', 'scrollToTop', 'showToast', 'openModal', 'closeModal',
        'nextTestimoni', 'prevTestimoni', 'goToTestimoni', 'votePolling',
        'loadCuacaRealtime', 'changeMonth', 'filterKalender', 'toggleFAQ',
        'answerQuiz', 'restartQuiz', 'copyToClipboard',
        'openGlobalSearch', 'closeGlobalSearch', 'performGlobalSearch', 'navigateTo',
        'updateCountdown', 'loadTestimoni', 'loadLeaderboard', 'loadPolling',
        'loadBerita', 'loadKalender', 'loadFAQ', 'loadQuizQuestion',
        'loadAgenda', 'loadGaleri', 'animateCounter', 'loadPeta'
    ];
    
    functionsToExpose.forEach(fnName => {
        if (typeof window[fnName] === 'undefined' && typeof eval(fnName) === 'function') {
            window[fnName] = eval(fnName);
        }
    });
})();

console.log('✅ Mapatek Portal — Main initialized successfully!');