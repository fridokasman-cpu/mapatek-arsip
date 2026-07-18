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

// ==================== FILTER ARSIP (PENCARIAN TEKS) ====================
function filterArsip() {
    const input = document.getElementById('searchInput');
    const searchValue = input.value.toLowerCase().trim();
    const arsipSection = document.getElementById('arsip');
    const arsipItems = document.querySelectorAll('.arsip-item');
    let visibleCount = 0;
    let firstVisibleItem = null;
    
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });

    arsipItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        const match = text.includes(searchValue);
        
        if (match) {
            item.style.display = 'flex';
            visibleCount++;
            if (!firstVisibleItem) {
                firstVisibleItem = item;
            }
            if (searchValue.length > 0) {
                highlightText(item, searchValue);
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    if (searchValue.length > 0) {
        arsipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            if (firstVisibleItem) {
                firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstVisibleItem.style.transition = 'all 0.3s';
                firstVisibleItem.style.boxShadow = '0 0 0 3px var(--accent), 0 8px 32px rgba(52, 165, 120, 0.3)';
                setTimeout(() => {
                    firstVisibleItem.style.boxShadow = '';
                }, 2000);
            }
        }, 500);
        
        const existingMessage = document.querySelector('.search-no-results');
        if (existingMessage) existingMessage.remove();
        
        if (visibleCount === 0) {
            const message = document.createElement('div');
            message.className = 'search-no-results';
            message.style.cssText = `
                text-align: center;
                padding: 3rem 2rem;
                color: var(--gray-500);
                grid-column: 1 / -1;
            `;
            message.innerHTML = `
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 0.5rem;">Tidak ada hasil ditemukan</h3>
                <p>Coba kata kunci lain seperti "Rinjani", "2024", atau "Laporan"</p>
            `;
            const arsipList = document.getElementById('arsipList');
            if (arsipList) arsipList.appendChild(message);
        }
    } else {
        arsipItems.forEach(item => item.style.display = 'flex');
    }
}

function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
        const text = node.textContent.toLowerCase();
        const index = text.indexOf(searchTerm);
        if (index !== -1) {
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.style.cssText = `
                background: linear-gradient(120deg, rgba(52, 165, 120, 0.3) 0%, rgba(52, 165, 120, 0.1) 100%);
                padding: 0.1rem 0.3rem;
                border-radius: 3px;
                font-weight: 600;
                color: var(--primary);
            `;
            const before = node.textContent.substring(0, index);
            const match = node.textContent.substring(index, index + searchTerm.length);
            const after = node.textContent.substring(index + searchTerm.length);
            const fragment = document.createDocumentFragment();
            if (before) fragment.appendChild(document.createTextNode(before));
            span.textContent = match;
            fragment.appendChild(span);
            if (after) fragment.appendChild(document.createTextNode(after));
            node.parentNode.replaceChild(fragment, node);
        }
    });
}

// ==================== FILTER KATEGORI ARSIP ====================
function filterKategori(kategori, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const items = document.querySelectorAll('.arsip-item');
    let visibleCount = 0;

    items.forEach(item => {
        const itemKategori = item.getAttribute('data-kategori');
        if (kategori === 'all' || itemKategori === kategori) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    const info = document.getElementById('arsipInfo');
    if (info) {
        const label = (kategori === 'all') ? 'Semua' : kategori;
        info.textContent = `Menampilkan ${visibleCount} file untuk kategori: ${label}`;
    }

    let noResultMsg = document.querySelector('.no-result-msg');
    if (visibleCount === 0 && kategori !== 'all') {
        if (!noResultMsg) {
            noResultMsg = document.createElement('div');
            noResultMsg.className = 'no-result-msg';
            noResultMsg.style.cssText = `
                text-align: center;
                padding: 2rem;
                color: var(--gray-500);
                grid-column: 1 / -1;
                background: var(--gray-50);
                border-radius: var(--radius-md);
                margin-top: 1rem;
            `;
            document.getElementById('arsipList').appendChild(noResultMsg);
        }
        noResultMsg.innerHTML = `
            <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            <p>Belum ada dokumen untuk kategori "${kategori}"</p>
        `;
    } else if (noResultMsg) {
        noResultMsg.remove();
    }

    console.log(`📁 Filter: "${kategori}" | Tampil: ${visibleCount} file`);
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (typeof openGlobalSearch === 'function') openGlobalSearch();
    }
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

// ==================== SCROLL PROGRESS BAR ====================
(function() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    let ticking = false;
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    });
    updateProgress();
})();

// ==================== COUNT-UP ANGKA STATISTIK ====================
(function() {
    const statEls = document.querySelectorAll('.stat-number');
    if (!statEls.length) return;

    function animateCountUp(el) {
        const target = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statEls.forEach(el => observer.observe(el));
    }
})();

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

    // Peta (dipanggil dengan delay agar map container siap)
    if (typeof loadPeta === 'function') {
        setTimeout(loadPeta, 500);
    }

    // Tutorial — DIPANGGIL SELALU
    if (typeof loadTutorials === 'function') {
        loadTutorials();
    }

    // Counter animasi
    if (typeof animateCounter === 'function') {
        const memberEl = document.getElementById('memberCount');
        const expeditionEl = document.getElementById('expeditionCount');
        const trainingEl = document.getElementById('trainingCount');
        const documentEl = document.getElementById('documentCount');
        if (memberEl) animateCounter(memberEl, 49);
        if (expeditionEl) animateCounter(expeditionEl, 12);
        if (trainingEl) animateCounter(trainingEl, 8);
        if (documentEl) animateCounter(documentEl, 25);
    }

    // Testimoni otomatis
    if (typeof nextTestimoni === 'function') {
        setInterval(nextTestimoni, 6000);
    }

    // Countdown
    if (typeof updateCountdown === 'function') {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Cuaca & Pengumuman (refresh periodik)
    if (typeof loadCuacaRealtime === 'function') {
        setInterval(loadCuacaRealtime, 1800000);
    }
    if (typeof loadPengumuman === 'function') {
        loadPengumuman();
        setInterval(loadPengumuman, 600000);
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
    if (window.innerWidth < 480) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5');
    }
}
window.addEventListener('load', fixViewport);
window.addEventListener('resize', fixViewport);

// ==================== PENGUMUMAN ====================
async function loadPengumuman() {
    const grid = document.getElementById('pengumumanGrid');
    if (!grid) return;
    
    try {
        const response = await fetch('pengumuman.json?t=' + Date.now());
        if (!response.ok) throw new Error('Gagal memuat pengumuman');
        const data = await response.json();
        if (!data.pengumuman || !Array.isArray(data.pengumuman)) {
            throw new Error('Format JSON tidak valid');
        }
        const pengumumanAktif = data.pengumuman.filter(p => p.status === 'aktif');
        if (pengumumanAktif.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    Belum ada pengumuman saat ini
                </div>
            `;
            return;
        }
        const prioritasOrder = { tinggi: 1, sedang: 2, rendah: 3 };
        pengumumanAktif.sort((a, b) => {
            return (prioritasOrder[a.prioritas] || 3) - (prioritasOrder[b.prioritas] || 3);
        });
        grid.innerHTML = pengumumanAktif.map(p => `
            <a href="${p.link || 'https://ustjogja.ac.id/id/berita/'}" target="_blank" class="pengumuman-card prioritas-${p.prioritas || 'sedang'}">
                <div class="pengumuman-header">
                    <span class="pengumuman-kategori">${p.kategori || 'Pengumuman'}</span>
                    <span class="pengumuman-tanggal">
                        <i class="far fa-calendar"></i> ${p.tanggal}
                    </span>
                </div>
                <h3 class="pengumuman-judul">${p.judul}</h3>
                <p class="pengumuman-deskripsi">${p.deskripsi}</p>
                <div class="pengumuman-footer">
                    <span class="pengumuman-baca">
                        Baca Selengkapnya <i class="fas fa-arrow-right"></i>
                    </span>
                    <span class="pengumuman-status status-${p.status}">${p.status}</span>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading pengumuman:', error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--gray-500);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 0.5rem; display: block;"></i>
                <p>Gagal memuat pengumuman</p>
                <button onclick="loadPengumuman()" style="background: var(--gradient-accent); color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 40px; cursor: pointer; font-weight: 600; margin-top: 0.5rem;">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
            </div>
        `;
    }
}

// ==================== SIDEBAR TOGGLE ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }
});
    
// ==================== EKSPOSE FUNGSI KE GLOBAL ====================
window.toggleMenu = toggleMenu;
window.filterArsip = filterArsip;
window.filterKategori = filterKategori;
window.fixViewport = fixViewport;
window.loadPengumuman = loadPengumuman;
window.loadAgendaFromJSON = loadAgendaFromJSON;
window.toggleSidebar = toggleSidebar;

// ==================== TIDAK ADA EKSPOR DUPLIKAT CHATBOT ====================
// Fungsi chatbot sudah diekspor di chatbot.js, tidak perlu di sini.

console.log('✅ Mapatek Portal — Main initialized successfully!');