// ==================== FUNGSI UTAMA ====================
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
            container.innerHTML = `<div class="status-box status-buka"><div class="status-icon"><i class="fas fa-door-open"></i></div><h2 style="color:#065f46; font-size:1.75rem;">PENDAFTARAN DIBUKA! 🎉</h2><div class="info-periode"><i class="fas fa-calendar-alt"></i> ${data.periode}</div><p style="margin-top:1rem;">Ayo bergabung bersama keluarga besar Mapatek Abhipraya!<br>Isi formulir pendaftaran dengan klik tombol di bawah ini.</p><a href="${data.link_form}" target="_blank" class="btn-daftar"><i class="fas fa-pen-to-square"></i> DAFTAR SEKARANG</a></div>`;
        } else {
            container.innerHTML = `<div class="status-box status-tutup"><div class="status-icon"><i class="fas fa-door-closed"></i></div><h2 style="color:#991b1b; font-size:1.75rem;">PENDAFTARAN DITUTUP</h2><p>${data.info_lanjutan}</p><div class="info-periode"><i class="fas fa-info-circle"></i> ${data.periode}</div><p style="margin-top:1rem;">Follow Instagram kami untuk info terbaru:<br><a href="https://instagram.com/mapatek_abhipraya" target="_blank" style="color:#e1306c;">@mapatek_abhipraya</a></p></div>`;
        }
    })
    .catch(() => {
        document.getElementById('statusContainer').innerHTML = `<div class="status-box status-tutup"><div class="status-icon"><i class="fas fa-info-circle"></i></div><h2 style="color:#991b1b;">INFORMASI PENDAFTARAN</h2><p>Untuk informasi pendaftaran anggota baru, hubungi admin kami.</p><div style="margin-top:1.5rem;"><a href="https://wa.me/6282214428371" target="_blank" class="btn-daftar" style="background:#25D366;"><i class="fab fa-whatsapp"></i> Chat Admin</a></div></div>`;
    });

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openGlobalSearch();
    }
    if (e.key === 'Escape') closeGlobalSearch();
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
    document.querySelector('.dark-mode-toggle i').classList.remove('fa-moon');
    document.querySelector('.dark-mode-toggle i').classList.add('fa-sun');
}

// ==================== LOAD ALL FEATURES ====================
window.addEventListener('load', () => {
    loadAgenda();
    loadGaleri();
    loadTestimoni();
    loadLeaderboard();
    loadPolling();
    loadCuacaRealtime();
    loadBerita();
    loadKalender();
    loadFAQ();
    loadQuizQuestion();
    setTimeout(loadPeta, 500);
    
    animateCounter(document.getElementById('memberCount'), 50);
    animateCounter(document.getElementById('expeditionCount'), 12);
    animateCounter(document.getElementById('trainingCount'), 8);
    animateCounter(document.getElementById('documentCount'), 25);
    
    setInterval(nextTestimoni, 6000);
    setInterval(updateCountdown, 1000);
    setInterval(loadCuacaRealtime, 1800000);
    
    showToast('✨ Selamat datang di Portal Kearsipan Mapatek Abhipraya!');
});

// ==================== FIX VIEWPORT MOBILE ====================
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

function fixViewport() {
    if (window.innerWidth < 480) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5');
    }
}

window.addEventListener('load', fixViewport);
window.addEventListener('resize', fixViewport);

// ==================== EKSPOSE FUNGSI KE GLOBAL ====================
window.toggleMenu = toggleMenu;
window.toggleDarkMode = toggleDarkMode;
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.openGlobalSearch = openGlobalSearch;
window.closeGlobalSearch = closeGlobalSearch;
window.performGlobalSearch = performGlobalSearch;
window.navigateTo = navigateTo;
window.filterArsip = filterArsip;
window.filterKategori = filterKategori;
window.scrollToTop = scrollToTop;
window.openModal = openModal;
window.closeModal = closeModal;
window.nextTestimoni = nextTestimoni;
window.prevTestimoni = prevTestimoni;
window.goToTestimoni = goToTestimoni;
window.votePolling = votePolling;
window.loadCuacaRealtime = loadCuacaRealtime;
window.changeMonth = changeMonth;
window.filterKalender = filterKalender;
window.toggleFAQ = toggleFAQ;
window.answerQuiz = answerQuiz;
window.restartQuiz = restartQuiz;
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;