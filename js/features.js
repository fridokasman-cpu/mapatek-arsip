// ================================================================
// FEATURES — Semua fungsi utama untuk fitur interaktif
// ================================================================

// ==================== COUNTDOWN TIMER ====================
let currentEvent = null;

function getNextEvent() {
    // Pastikan agendas tersedia
    if (typeof agendas === 'undefined' || !agendas || agendas.length === 0) {
        return null;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcomingEvents = agendas.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
    });
    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
}

function updateCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const eventNameEl = document.getElementById('countdownEventName');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !eventNameEl) {
        console.warn('⚠️ Elemen countdown tidak ditemukan');
        return;
    }
    const event = getNextEvent();
    if (!event) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = '📅 Belum ada event terjadwal';
        return;
    }
    const eventDate = new Date(event.date + 'T08:00:00');
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate.toDateString() === today.toDateString()) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = `🎉 Hari Ini: ${event.title}`;
        return;
    }
    const distance = eventDate - now;
    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = `✅ ${event.title} - Selesai!`;
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    const eventDateFormatted = new Date(event.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    eventNameEl.innerHTML = `
        <span style="font-size: 0.9rem; opacity: 0.8;">Event Berikutnya:</span><br>
        <strong>${event.title}</strong>
        <span style="font-size: 0.85rem; display: block; margin-top: 0.5rem;">
            📅 ${eventDateFormatted} | 📍 ${event.location}
        </span>
    `;
}

// Jalankan countdown setiap detik
setInterval(updateCountdown, 1000);
updateCountdown(); // panggil sekali saat load

// ==================== TESTIMONI ====================
let currentTestimoni = 0;

function loadTestimoni() {
    const track = document.getElementById('testimoniTrack');
    const dots = document.getElementById('testimoniDots');
    if (!track || !dots) {
        console.warn('⚠️ Elemen testimoni tidak ditemukan');
        return;
    }
    if (typeof testimoniData === 'undefined' || !testimoniData || testimoniData.length === 0) {
        track.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--gray-500);">Belum ada testimoni</div>`;
        return;
    }
    track.innerHTML = testimoniData.map(t => `
        <div class="testimoni-card">
            <img src="${t.photo}" alt="${t.name}" class="testimoni-photo" onerror="this.src='https://via.placeholder.com/100'">
            <div class="testimoni-quote">${t.quote}</div>
            <div class="testimoni-name">${t.name}</div>
            <div class="testimoni-angkatan">${t.angkatan}</div>
        </div>
    `).join('');
    dots.innerHTML = testimoniData.map((_, i) => `<div class="testimoni-dot ${i === 0 ? 'active' : ''}" onclick="goToTestimoni(${i})"></div>`).join('');
}

function updateTestimoni() {
    const track = document.getElementById('testimoniTrack');
    if (!track) return;
    track.style.transform = `translateX(-${currentTestimoni * 100}%)`;
    document.querySelectorAll('.testimoni-dot').forEach((d, i) => d.classList.toggle('active', i === currentTestimoni));
}

function nextTestimoni() {
    if (typeof testimoniData === 'undefined' || !testimoniData || testimoniData.length === 0) return;
    currentTestimoni = (currentTestimoni + 1) % testimoniData.length;
    updateTestimoni();
}
function prevTestimoni() {
    if (typeof testimoniData === 'undefined' || !testimoniData || testimoniData.length === 0) return;
    currentTestimoni = (currentTestimoni - 1 + testimoniData.length) % testimoniData.length;
    updateTestimoni();
}
function goToTestimoni(i) {
    currentTestimoni = i;
    updateTestimoni();
}

// ==================== LEADERBOARD ====================
function loadLeaderboard() {
    const body = document.getElementById('leaderboardBody');
    if (!body) {
        console.warn('⚠️ Elemen #leaderboardBody tidak ditemukan');
        return;
    }
    if (typeof leaderboardData === 'undefined' || !leaderboardData || leaderboardData.length === 0) {
        body.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">Belum ada data leaderboard</div>`;
        return;
    }
    body.innerHTML = leaderboardData.map((u, i) => {
        const rank = i + 1;
        let rankClass = '', medal = rank;
        if (rank === 1) { rankClass = 'top-1'; medal = '🥇'; }
        else if (rank === 2) { rankClass = 'top-2'; medal = '🥈'; }
        else if (rank === 3) { rankClass = 'top-3'; medal = '🥉'; }
        return `
            <div class="leaderboard-row ${rankClass}">
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-user">
                    <img src="${u.photo}" class="leaderboard-avatar" onerror="this.src='https://via.placeholder.com/40'">
                    <div>
                        <div class="leaderboard-name">${u.name}</div>
                        <div class="leaderboard-badge">${u.angkatan}</div>
                    </div>
                </div>
                <div class="leaderboard-peaks">${u.peaks} puncak</div>
                <div class="leaderboard-points">${u.points} pts</div>
            </div>
        `;
    }).join('');
}

// ==================== POLLING ====================
let hasVoted = localStorage.getItem('hasVotedPolling') === 'true';

function loadPolling() {
    const container = document.getElementById('pollingOptions');
    const totalEl = document.getElementById('pollingTotal');
    if (!container || !totalEl) {
        console.warn('⚠️ Elemen polling tidak ditemukan');
        return;
    }
    if (typeof pollingData === 'undefined' || !pollingData || pollingData.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--gray-500);">Belum ada data polling</div>`;
        totalEl.textContent = 'Total 0 suara';
        return;
    }
    const totalVotes = pollingData.reduce((sum, p) => sum + p.votes, 0);
    container.innerHTML = pollingData.map(p => {
        const percent = totalVotes > 0 ? ((p.votes / totalVotes) * 100).toFixed(1) : 0;
        return `
            <div class="polling-option ${hasVoted ? 'voted' : ''}" data-id="${p.id}" onclick="votePolling(${p.id})">
                <div class="polling-bar" style="width:${hasVoted ? percent : 0}%"></div>
                <div class="polling-option-content">
                    <div class="polling-option-text">${p.text}</div>
                    <div class="polling-option-percent">${hasVoted ? percent + '%' : ''} ${hasVoted ? '(' + p.votes + ' suara)' : ''}</div>
                </div>
            </div>
        `;
    }).join('');
    totalEl.textContent = `Total ${totalVotes} suara`;
}

function votePolling(id) {
    if (hasVoted) {
        showToast('⚠️ Anda sudah voting sebelumnya!');
        return;
    }
    const item = pollingData.find(p => p.id === id);
    if (!item) return;
    item.votes++;
    hasVoted = true;
    localStorage.setItem('hasVotedPolling', 'true');
    loadPolling();
    showToast('✅ Terima kasih atas votingmu!');
}

// ==================== CUACA REALTIME ====================
function getOpenWeatherIcon(code) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '🌨️', '13n': '🌨️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[code] || '🌡️';
}

async function loadCuacaRealtime() {
    const grid = document.getElementById('cuacaGrid');
    if (!grid) {
        console.warn('⚠️ Elemen #cuacaGrid tidak ditemukan');
        return;
    }
    if (typeof gunungList === 'undefined' || !gunungList || gunungList.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">Data gunung belum dikonfigurasi</div>`;
        return;
    }
    grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;">
            <div class="loading-spinner"></div>
            <p style="margin-top:1rem;color:var(--gray-600);">🔄 Memuat data cuaca real-time...</p>
        </div>
    `;
    try {
        const cuacaPromises = gunungList.map(async (gunung) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${gunung.lat}&lon=${gunung.lon}&appid=${API_KEY}&units=metric&lang=id`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const temp = Math.round(data.main.temp);
            const humidity = data.main.humidity;
            const wind = Math.round(data.wind.speed * 3.6);
            const visibility = Math.round(data.visibility / 1000);
            const desc = data.weather[0].description;
            const icon = getOpenWeatherIcon(data.weather[0].icon);
            let status = 'aman';
            if (data.weather[0].main === 'Rain' || data.weather[0].main === 'Thunderstorm') status = 'waspada';
            if (wind > 30 || temp < 5) status = 'waspada';
            if (wind > 50 || data.weather[0].main === 'Thunderstorm') status = 'bahaya';
            return {
                name: gunung.name,
                loc: gunung.loc || 'Indonesia',
                temp,
                desc: desc.charAt(0).toUpperCase() + desc.slice(1),
                icon,
                humidity,
                wind,
                visibility,
                status
            };
        });
        const cuacaData = await Promise.all(cuacaPromises);
        grid.innerHTML = cuacaData.map(c => `
            <div class="cuaca-card">
                <div class="cuaca-card-header">
                    <div>
                        <div class="cuaca-mountain-name">${c.name}</div>
                        <div class="cuaca-mountain-loc"><i class="fas fa-map-marker-alt"></i> ${c.loc}</div>
                    </div>
                    <div class="cuaca-icon">${c.icon}</div>
                </div>
                <div class="cuaca-temp">${c.temp}°C</div>
                <div class="cuaca-desc">${c.desc}</div>
                <div class="cuaca-details">
                    <div class="cuaca-detail-item"><i class="fas fa-tint"></i> ${c.humidity}%</div>
                    <div class="cuaca-detail-item"><i class="fas fa-wind"></i> ${c.wind} km/h</div>
                    <div class="cuaca-detail-item"><i class="fas fa-eye"></i> ${c.visibility} km</div>
                </div>
                <div class="cuaca-status ${c.status}">
                    ${c.status === 'aman' ? '✅ AMAN' : c.status === 'waspada' ? '⚠️ WASPADA' : '🚫 BAHAYA'}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('❌ Error fetching weather:', error);
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;display:block;"></i>
                <h3>Gagal Memuat Data Cuaca</h3>
                <p style="color:var(--gray-600);margin-bottom:1rem;">${error.message}</p>
                <button onclick="loadCuacaRealtime()" style="background:var(--gradient);color:white;border:none;padding:0.75rem 2rem;border-radius:40px;cursor:pointer;font-weight:600;">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
            </div>
        `;
    }
}

// ==================== PETA INTERAKTIF ====================
let petaMap;

function loadPeta() {
    const mapContainer = document.getElementById('petaMap');
    if (!mapContainer) {
        console.warn('⚠️ Elemen #petaMap tidak ditemukan');
        return;
    }
    if (typeof L === 'undefined') {
        mapContainer.innerHTML = `<div style="text-align:center;padding:2rem;color:red;">Peta tidak dapat dimuat: Leaflet tidak ditemukan. Periksa koneksi internet.</div>`;
        return;
    }
    if (typeof petaLocations === 'undefined' || !petaLocations || petaLocations.length === 0) {
        mapContainer.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--gray-500);">Data peta belum tersedia</div>`;
        return;
    }
    petaMap = L.map('petaMap').setView([-7.5, 110.4], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(petaMap);
    const colors = { basecamp: '#dc2626', gunung: '#2563eb', konservasi: '#16a34a', latihan: '#9333ea' };
    petaLocations.forEach(loc => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${colors[loc.type] || '#6c757d'};width:35px;height:35px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-${loc.type === 'basecamp' ? 'home' : loc.type === 'gunung' ? 'mountain' : loc.type === 'konservasi' ? 'tree' : 'location'}" style="color:white;font-size:16px;"></i>
            </div>`,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });
        L.marker([loc.lat, loc.lng], { icon })
            .addTo(petaMap)
            .bindPopup(`<div style="min-width:200px;"><b style="font-size:1.1rem;">${loc.name}</b><br><span style="color:#666;">${loc.desc}</span></div>`);
    });
}

// ==================== BERITA ====================
function loadBerita() {
    const grid = document.getElementById('beritaGrid');
    if (!grid) return;
    if (typeof beritaData === 'undefined' || !beritaData || beritaData.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">Belum ada berita</div>`;
        return;
    }
    grid.innerHTML = beritaData.map(b => `
        <a href="https://ustjogja.ac.id/id/berita/" target="_blank" class="berita-card">
            <img src="${b.image}" class="berita-image" onerror="this.src='https://via.placeholder.com/600x400?text=Mapatek'">
            <div class="berita-content">
                <span class="berita-category">${b.category}</span>
                <h3 class="berita-title">${b.title}</h3>
                <p class="berita-excerpt">${b.excerpt}</p>
                <div class="berita-meta">
                    <span><i class="far fa-calendar"></i> ${b.date}</span>
                    <span class="berita-read-more">Baca di UST <i class="fas fa-external-link-alt"></i></span>
                </div>
            </div>
        </a>
    `).join('');
}

// ==================== KALENDER ====================
let kalenderDate = new Date();
let kalenderFilter = 'all';
let kalenderEvents = window.kalenderEvents || [];

async function loadKalenderData() {
    try {
        const response = await fetch('kalender.json?t=' + Date.now());
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (data.events && Array.isArray(data.events)) {
            kalenderEvents = data.events;
            console.log('✅ Kalender loaded from JSON:', kalenderEvents.length, 'events');
            return true;
        }
        throw new Error('Format JSON tidak sesuai');
    } catch (error) {
        console.warn('⚠️ Gagal memuat kalender.json, menggunakan data default');
        if (window.kalenderEvents && window.kalenderEvents.length > 0) {
            kalenderEvents = window.kalenderEvents;
        } else {
            kalenderEvents = [];
        }
        return false;
    }
}

function loadKalender() {
    const grid = document.getElementById('kalenderGrid');
    const title = document.getElementById('kalenderTitle');
    if (!grid || !title) {
        console.warn('⚠️ Elemen kalender tidak ditemukan');
        return;
    }
    const year = kalenderDate.getFullYear();
    const month = kalenderDate.getMonth();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    title.textContent = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    let html = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => `<div class="kalender-day-name">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="kalender-day other-month"><div class="kalender-day-number">${daysInPrevMonth - firstDay + i + 1}</div></div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        const dayEvents = (kalenderEvents || []).filter(e => e.date === dateStr && (kalenderFilter === 'all' || e.type === kalenderFilter));
        html += `<div class="kalender-day ${isToday ? 'today' : ''}"><div class="kalender-day-number">${d}</div>${dayEvents.map(e => `<div class="kalender-event ${e.type}" title="${e.title}">${e.title}</div>`).join('')}</div>`;
    }
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        html += `<div class="kalender-day other-month"><div class="kalender-day-number">${i}</div></div>`;
    }
    grid.innerHTML = html;
}

async function refreshKalender() {
    await loadKalenderData();
    loadKalender();
}

function changeMonth(delta) {
    kalenderDate.setMonth(kalenderDate.getMonth() + delta);
    loadKalender();
}

function filterKalender(type, btn) {
    kalenderFilter = type;
    document.querySelectorAll('.kalender-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    loadKalender();
}

// ==================== FAQ ====================
function loadFAQ() {
    const container = document.getElementById('faqContainer');
    if (!container) return;
    if (typeof faqData === 'undefined' || !faqData || faqData.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--gray-500);">Belum ada FAQ</div>`;
        return;
    }
    container.innerHTML = faqData.map((f, i) => `
        <div class="faq-item" onclick="toggleFAQ(${i})">
            <div class="faq-question">
                <span>${f.q}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <div class="faq-answer-content">${f.a}</div>
            </div>
        </div>
    `).join('');
}

function toggleFAQ(i) {
    const items = document.querySelectorAll('.faq-item');
    if (items[i]) items[i].classList.toggle('active');
}

// ==================== QUIZ ====================
let currentQuiz = 0;
let quizAnswers = [];

function loadQuizQuestion() {
    if (typeof quizQuestions === 'undefined' || !quizQuestions || quizQuestions.length === 0) {
        document.getElementById('quizContent').innerHTML = '<div style="text-align:center;padding:2rem;">Quiz tidak tersedia</div>';
        return;
    }
    const q = quizQuestions[currentQuiz];
    if (!q) { showQuizResult(); return; }
    document.getElementById('quizCounter').textContent = `Pertanyaan ${currentQuiz + 1} dari ${quizQuestions.length}`;
    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('quizProgressBar').style.width = `${((currentQuiz) / quizQuestions.length) * 100}%`;
    const letters = ['A', 'B', 'C', 'D'];
    document.getElementById('quizOptions').innerHTML = q.options.map((o, i) => `
        <div class="quiz-option" onclick="answerQuiz('${o.type}')">
            <div class="quiz-option-letter">${letters[i]}</div>
            <div>${o.text}</div>
        </div>
    `).join('');
}

function answerQuiz(type) {
    quizAnswers.push(type);
    currentQuiz++;
    if (currentQuiz < quizQuestions.length) {
        loadQuizQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    if (typeof quizResults === 'undefined' || !quizResults) return;
    const counts = {};
    quizAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const r = quizResults[result];
    if (!r) return;
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('quizResultIcon').textContent = r.icon;
    document.getElementById('quizResultType').textContent = r.type;
    document.getElementById('quizResultDesc').textContent = r.desc;
    document.getElementById('quizProgressBar').style.width = '100%';
    const shareText = `🎯 Hasil Quiz Kepribadian Pendaki: ${r.type} ${r.icon}%0A%0A${r.desc}%0A%0ACoba quiz-nya di Portal Mapatek Abhipraya!`;
    document.getElementById('shareWA').href = `https://wa.me/?text=${shareText}`;
    document.getElementById('shareTW').href = `https://twitter.com/intent/tweet?text=${shareText}`;
    window.quizShareText = `Hasil Quiz Kepribadian Pendaki: ${r.type} ${r.icon}\n\n${r.desc}\n\nCoba quiz-nya di Portal Mapatek Abhipraya!`;
}

function restartQuiz() {
    currentQuiz = 0;
    quizAnswers = [];
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    loadQuizQuestion();
}

function copyToClipboard() {
    navigator.clipboard.writeText(window.quizShareText || 'Coba Quiz Kepribadian Pendaki di Portal Mapatek Abhipraya!');
    showToast('📋 Teks berhasil disalin! Paste di Instagram');
}

// ==================== SEARCH GLOBAL ====================
function openGlobalSearch() {
    const overlay = document.getElementById('searchGlobalOverlay');
    if (!overlay) return;
    overlay.classList.add('active');
    setTimeout(() => {
        const input = document.getElementById('globalSearchInput');
        if (input) input.focus();
    }, 100);
}

function closeGlobalSearch() {
    const overlay = document.getElementById('searchGlobalOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    const input = document.getElementById('globalSearchInput');
    if (input) input.value = '';
    const results = document.getElementById('globalSearchResults');
    if (results) {
        results.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--gray-500);">Ketik untuk mencari di seluruh website...</div>`;
    }
}

function performGlobalSearch() {
    const input = document.getElementById('globalSearchInput');
    const results = document.getElementById('globalSearchResults');
    if (!input || !results) return;
    const query = input.value.toLowerCase().trim();
    if (!query) {
        results.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--gray-500);">Ketik untuk mencari...</div>';
        return;
    }
    if (typeof searchData === 'undefined' || !searchData) {
        results.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--gray-500);">Data pencarian tidak tersedia</div>';
        return;
    }
    const filtered = searchData.filter(d => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query));
    if (filtered.length === 0) {
        results.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--gray-500);">Tidak ada hasil ditemukan</div>';
        return;
    }
    results.innerHTML = filtered.map(d => `
        <div class="search-result-item" onclick="navigateTo('${d.section}')">
            <div class="search-result-icon"><i class="fas ${d.icon}"></i></div>
            <div class="search-result-text">
                <div class="search-result-title">${d.title}</div>
                <div class="search-result-category">${d.category}</div>
            </div>
            <i class="fas fa-arrow-right" style="color:var(--gray-400);"></i>
        </div>
    `).join('');
}

function navigateTo(section) {
    closeGlobalSearch();
    const el = document.querySelector(section);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==================== AGENDA & GALERI ====================
function loadAgenda() {
    const container = document.getElementById('agendaGrid');
    if (!container) return;
    const data = window.agendas || agendas;
    if (!data || data.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">Belum ada agenda</div>`;
        return;
    }
    container.innerHTML = data.map(a => `
        <div class="agenda-card">
            <div class="agenda-date"><div class="day">${a.day}</div><div class="month">${a.month}</div></div>
            <div class="agenda-content">
                <h3 class="agenda-title">${a.title}</h3>
                <div class="agenda-location"><i class="fas fa-map-marker-alt"></i> ${a.location}</div>
                <p class="agenda-desc">${a.desc}</p>
                <span class="agenda-status status-${a.status}">${a.status === 'upcoming' ? '📅 Akan Datang' : a.status === 'ongoing' ? '🔴 Berlangsung' : '✅ Selesai'}</span>
            </div>
        </div>
    `).join('');
}

function loadGaleri() {
    const container = document.getElementById('galeriGrid');
    if (!container) return;
    if (typeof galeriImages === 'undefined' || !galeriImages || galeriImages.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--gray-500);">Belum ada galeri</div>`;
        return;
    }
    container.innerHTML = galeriImages.map(img => `
        <div class="galeri-item" onclick="openModal('${img.src}')">
            <img src="${img.src}" alt="${img.caption}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="galeri-overlay"><p><i class="fas fa-camera"></i> ${img.caption}</p></div>
        </div>
    `).join('');
}

// ==================== UTILITY FUNCTIONS ====================
function animateCounter(element, target) {
    if (!element) return;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    const icon = document.querySelector('.dark-mode-toggle i');
    if (icon) {
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    showToast(document.body.classList.contains('dark-mode') ? '🌙 Mode Gelap Aktif' : '☀️ Mode Terang Aktif');
    if (petaMap) setTimeout(() => petaMap.invalidateSize(), 300);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function openModal(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    if (!modal || !img) return;
    img.src = src;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.classList.remove('active');
}

// ==================== LOAD AGENDA DARI JSON ====================
async function loadAgendaFromJSON() {
    try {
        const response = await fetch('agenda.json?t=' + Date.now());
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (data.agendas && Array.isArray(data.agendas) && data.agendas.length > 0) {
            if (window.agendas) {
                window.agendas.splice(0, window.agendas.length, ...data.agendas);
            } else {
                agendas = data.agendas;
            }
            loadAgenda();
            updateCountdown();
            console.log('✅ Agenda updated from JSON:', data.agendas.length, 'events');
        } else {
            console.warn('⚠️ agenda.json tidak memiliki data agendas yang valid');
            // Jika kosong, tetap load default
            if (typeof loadAgenda === 'function') loadAgenda();
        }
    } catch (error) {
        console.log('ℹ️ Gagal memuat agenda.json, menggunakan data default:', error.message);
        if (typeof loadAgenda === 'function') loadAgenda();
    }
}

// ==================== FILTER KATEGORI & ARSIP ====================
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
            noResultMsg.style.cssText = `text-align:center;padding:2rem;color:var(--gray-500);grid-column:1/-1;`;
            document.getElementById('arsipList').appendChild(noResultMsg);
        }
        noResultMsg.innerHTML = `<i class="fas fa-folder-open" style="font-size:2rem;display:block;margin-bottom:0.5rem;"></i><p>Belum ada dokumen untuk kategori "${kategori}"</p>`;
    } else if (noResultMsg) {
        noResultMsg.remove();
    }
    console.log(`📁 Filter: "${kategori}" | Tampil: ${visibleCount} file`);
}

function filterArsip() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    const searchValue = input.value.toLowerCase().trim();
    const items = document.querySelectorAll('.arsip-item');
    let visibleCount = 0;
    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(searchValue)) {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    const info = document.getElementById('arsipInfo');
    if (info) {
        info.textContent = searchValue ? `Menampilkan ${visibleCount} hasil untuk "${searchValue}"` : 'Menampilkan semua file';
    }
}

// ==================== EXPOSE FUNCTIONS TO GLOBAL ====================
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
window.refreshKalender = refreshKalender;
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
window.filterKategori = filterKategori;
window.filterArsip = filterArsip;
window.loadKalenderData = loadKalenderData;

console.log('✅ features.js functions exposed to global scope');