// ================================================================
// FEATURES — Semua fungsi utama untuk fitur interaktif
// ================================================================

// ==================== COUNTDOWN TIMER ====================
// === COUNTDOWN OTOMATIS DARI AGENDA ===
let currentEvent = null;

// Fungsi untuk mencari event terdekat yang belum lewat
function getNextEvent() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset ke awal hari
    
    // Filter event yang tanggalnya >= hari ini
    const upcomingEvents = agendas.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
    });
    
    // Sort berdasarkan tanggal terdekat
    upcomingEvents.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Return event pertama (terdekat)
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
}

// Fungsi update countdown
function updateCountdown() {
    const event = getNextEvent();
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const eventNameEl = document.getElementById('countdownEventName');
    
    if (!event) {
        // Tidak ada event terjadwal
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = '📅 Belum ada event terjadwal';
        return;
    }
    
    // Cek apakah event hari ini
    const eventDate = new Date(event.date + 'T08:00:00');
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate.toDateString() === today.toDateString()) {
        // Event hari ini
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = `🎉 Hari Ini: ${event.title}`;
        return;
    }
    
    // Hitung selisih waktu
    const distance = eventDate - now;
    
    if (distance < 0) {
        // Event sudah lewat
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        eventNameEl.textContent = `✅ ${event.title} - Selesai!`;
        return;
    }
    
    // Update display
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Update nama event dengan info lokasi
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

// Jalankan countdown
setInterval(updateCountdown, 1000);
updateCountdown(); // Panggil langsung saat load
// ==================== TESTIMONI ====================
let currentTestimoni = 0;

function loadTestimoni() {
    const track = document.getElementById('testimoniTrack');
    const dots = document.getElementById('testimoniDots');
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
    track.style.transform = `translateX(-${currentTestimoni * 100}%)`;
    document.querySelectorAll('.testimoni-dot').forEach((d, i) => d.classList.toggle('active', i === currentTestimoni));
}

function nextTestimoni() { currentTestimoni = (currentTestimoni + 1) % testimoniData.length; updateTestimoni(); }
function prevTestimoni() { currentTestimoni = (currentTestimoni - 1 + testimoniData.length) % testimoniData.length; updateTestimoni(); }
function goToTestimoni(i) { currentTestimoni = i; updateTestimoni(); }

// ==================== LEADERBOARD ====================
function loadLeaderboard() {
    const body = document.getElementById('leaderboardBody');
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
    const totalVotes = pollingData.reduce((sum, p) => sum + p.votes, 0);
    container.innerHTML = pollingData.map(p => {
        const percent = totalVotes > 0 ? ((p.votes / totalVotes) * 100).toFixed(1) : 0;
        return `
            <div class="polling-option ${hasVoted ? 'voted' : ''}" data-id="${p.id}" onclick="votePolling(${p.id})">
                <div class="polling-bar" style="width:${hasVoted ? percent : 0}%"></div>
                <div class="polling-option-content">
                    <div class="polling-option-text">${p.text}</div>
                    <div class="polling-option-percent">${percent}% (${p.votes})</div>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('pollingTotal').textContent = `Total ${totalVotes} suara`;
}

function votePolling(id) {
    if (hasVoted) return;
    const item = pollingData.find(p => p.id === id);
    item.votes++;
    hasVoted = true;
    localStorage.setItem('hasVotedPolling', 'true');
    loadPolling();
    document.querySelector(`[data-id="${id}"]`).classList.add('selected');
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
    grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;">
            <div class="loading-spinner"></div>
            <p style="margin-top:1rem;color:var(--gray-600);">🔄 Memuat data cuaca real-time...</p>
            <small>API Key: ${API_KEY.substring(0, 8)}...</small>
        </div>
    `;
    
    try {
        console.log('🌤️ Fetching weather data...');
        console.log('API Key:', API_KEY);
        
        const cuacaPromises = gunungList.map(async (gunung) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${gunung.lat}&lon=${gunung.lon}&appid=${API_KEY}&units=metric&lang=id`;
            console.log(`Fetching ${gunung.name}: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Error ${gunung.name}:`, errorData);
                throw new Error(`HTTP ${response.status}: ${errorData.message}`);
            }
            
            const data = await response.json();
            console.log(`${gunung.name} data:`, data);
            
            const temp = Math.round(data.main.temp);
            const humidity = data.main.humidity;
            const wind = Math.round(data.wind.speed * 3.6);
            const visibility = Math.round(data.visibility / 1000);
            const desc = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const icon = getOpenWeatherIcon(iconCode);
            
            let status = 'aman';
            if (data.weather[0].main === 'Rain' || data.weather[0].main === 'Thunderstorm') {
                status = 'waspada';
            }
            if (wind > 30 || temp < 5) {
                status = 'waspada';
            }
            if (wind > 50 || data.weather[0].main === 'Thunderstorm') {
                status = 'bahaya';
            }
            
            return {
                name: gunung.name,
                loc: gunung.loc,
                temp: temp,
                desc: desc.charAt(0).toUpperCase() + desc.slice(1),
                icon: icon,
                humidity: humidity,
                wind: wind,
                visibility: visibility,
                status: status
            };
        });
        
        const cuacaData = await Promise.all(cuacaPromises);
        console.log('✅ All weather data loaded:', cuacaData);
        
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
            <div style="grid-column:1/-1;text-align:center;padding:3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ef4444;margin-bottom:1rem;"></i>
                <h3 style="color:var(--primary);margin-bottom:0.5rem;">Gagal Memuat Data Cuaca</h3>
                <p style="color:var(--gray-600);margin-bottom:1rem;">${error.message}</p>
                <button onclick="loadCuacaRealtime()" style="background:var(--gradient);color:white;border:none;padding:0.75rem 2rem;border-radius:40px;cursor:pointer;font-weight:600;">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
                <div style="margin-top:2rem;text-align:left;max-width:600px;margin-left:auto;margin-right:auto;background:var(--gray-100);padding:1.5rem;border-radius:var(--radius-md);">
                    <h4 style="margin-bottom:0.5rem;">Kemungkinan Penyebab:</h4>
                    <ul style="color:var(--gray-600);line-height:1.8;">
                        <li>⏳ API key belum aktif (tunggu 10-60 menit)</li>
                        <li>🌐 Koneksi internet terganggu</li>
                        <li>🔑 API key tidak valid</li>
                        <li>📊 Limit API tercapai (1000 calls/hari)</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// ==================== PETA INTERAKTIF ====================
let petaMap;

function loadPeta() {
    petaMap = L.map('petaMap').setView([-7.5, 110.4], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(petaMap);
    
    const colors = { basecamp: '#dc2626', gunung: '#2563eb', konservasi: '#16a34a', latihan: '#9333ea' };
    
    petaLocations.forEach(loc => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${colors[loc.type]};width:35px;height:35px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-${loc.type === 'basecamp' ? 'home' : loc.type === 'gunung' ? 'mountain' : loc.type === 'konservasi' ? 'tree' : 'location'}" style="color:white;font-size:16px;"></i>
            </div>`,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });
        L.marker([loc.lat, loc.lng], { icon })
            .addTo(petaMap)
            .bindPopup(`
                <div style="min-width:200px;">
                    <b style="font-size:1.1rem;color:var(--primary);">${loc.name}</b><br>
                    <span style="color:#666;font-size:0.9rem;">${loc.desc}</span>
                </div>
            `);
    });
    
    const basecampLayer = L.layerGroup();
    const gunungLayer = L.layerGroup();
    const konservasiLayer = L.layerGroup();
    
    petaLocations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]);
        if (loc.type === 'basecamp') basecampLayer.addLayer(marker);
        else if (loc.type === 'gunung') gunungLayer.addLayer(marker);
        else if (loc.type === 'konservasi') konservasiLayer.addLayer(marker);
    });
    
    const overlayMaps = {
        "🏠 Basecamp": basecampLayer,
        "⛰️ Gunung": gunungLayer,
        "🌳 Konservasi": konservasiLayer
    };
    
    L.control.layers(null, overlayMaps, { collapsed: false }).addTo(petaMap);
    basecampLayer.addTo(petaMap);
    gunungLayer.addTo(petaMap);
    konservasiLayer.addTo(petaMap);
}

// === BERITA (Semua mengarah ke UST) ===
function loadBerita() {
    const grid = document.getElementById('beritaGrid');
    if (!grid) return;
    
    grid.innerHTML = beritaData.map(b => `
        <a href="https://ustjogja.ac.id/id/berita/" target="_blank" class="berita-card">
            <img src="${b.image}" class="berita-image" onerror="this.src='https://via.placeholder.com/600x400?text=Mapatek'">
            <div class="berita-content">
                <span class="berita-category">${b.category}</span>
                <h3 class="berita-title">${b.title}</h3>
                <p class="berita-excerpt">${b.excerpt}</p>
                <div class="berita-meta">
                    <span><i class="far fa-calendar"></i> ${b.date}</span>
                    <span class="berita-read-more">
                        Baca di UST <i class="fas fa-external-link-alt"></i>
                    </span>
                </div>
            </div>
        </a>
    `).join('');
}

// ==================== KALENDER ====================
let kalenderDate = new Date();
let kalenderFilter = 'all';

function loadKalender() {
    const grid = document.getElementById('kalenderGrid');
    const year = kalenderDate.getFullYear();
    const month = kalenderDate.getMonth();
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    document.getElementById('kalenderTitle').textContent = `${monthNames[month]} ${year}`;
    
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
        const dayEvents = kalenderEvents.filter(e => e.date === dateStr && (kalenderFilter === 'all' || e.type === kalenderFilter));
        html += `<div class="kalender-day ${isToday ? 'today' : ''}"><div class="kalender-day-number">${d}</div>${dayEvents.map(e => `<div class="kalender-event ${e.type}" title="${e.title}">${e.title}</div>`).join('')}</div>`;
    }
    
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        html += `<div class="kalender-day other-month"><div class="kalender-day-number">${i}</div></div>`;
    }
    
    grid.innerHTML = html;
}

function changeMonth(delta) {
    kalenderDate.setMonth(kalenderDate.getMonth() + delta);
    loadKalender();
}

function filterKalender(type, btn) {
    kalenderFilter = type;
    document.querySelectorAll('.kalender-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadKalender();
}

// ==================== FAQ ====================
function loadFAQ() {
    const container = document.getElementById('faqContainer');
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
    document.querySelectorAll('.faq-item')[i].classList.toggle('active');
}

// ==================== QUIZ ====================
let currentQuiz = 0;
let quizAnswers = [];

function loadQuizQuestion() {
    const q = quizQuestions[currentQuiz];
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
    const counts = {};
    quizAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    const result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const r = quizResults[result];
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
    document.getElementById('searchGlobalOverlay').classList.add('active');
    setTimeout(() => document.getElementById('globalSearchInput').focus(), 100);
}

function closeGlobalSearch() {
    document.getElementById('searchGlobalOverlay').classList.remove('active');
    document.getElementById('globalSearchInput').value = '';
    document.getElementById('globalSearchResults').innerHTML = `
        <div style="padding:2rem;text-align:center;color:var(--gray-500);">
            <i class="fas fa-search" style="font-size:2rem;margin-bottom:0.5rem;display:block;"></i>
            Ketik untuk mencari di seluruh website...
        </div>
    `;
}

function performGlobalSearch() {
    const query = document.getElementById('globalSearchInput').value.toLowerCase();
    const results = document.getElementById('globalSearchResults');
    if (!query) {
        results.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--gray-500);"><i class="fas fa-search" style="font-size:2rem;margin-bottom:0.5rem;display:block;"></i>Ketik untuk mencari...</div>';
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
    container.innerHTML = agendas.map(a => `
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
    container.innerHTML = galeriImages.map(img => `
        <div class="galeri-item" onclick="openModal('${img.src}')">
            <img src="${img.src}" alt="${img.caption}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <div class="galeri-overlay"><p><i class="fas fa-camera"></i> ${img.caption}</p></div>
        </div>
    `).join('');
}

// ==================== UTILITY FUNCTIONS ====================
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { element.textContent = target; clearInterval(timer); }
        else { element.textContent = Math.floor(current); }
    }, 30);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    const icon = document.querySelector('.dark-mode-toggle i');
    if (document.body.classList.contains('dark-mode')) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    showToast(document.body.classList.contains('dark-mode') ? '🌙 Mode Gelap Aktif' : '☀️ Mode Terang Aktif');
    if (petaMap) setTimeout(() => petaMap.invalidateSize(), 300);
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function openModal(src) {
    const modal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = src;
    modal.classList.add('active');
}

function closeModal() { document.getElementById('imageModal').classList.remove('active'); }
// === LOAD AGENDA DARI JSON (OPSIONAL) ===
async function loadAgendaFromJSON() {
    try {
        const response = await fetch('agenda.json?t=' + Date.now());
        const data = await response.json();
        
        if (data.agendas && Array.isArray(data.agendas)) {
            agendas.length = 0; // Kosongkan array
            agendas.push(...data.agendas);
            
            // Reload agenda grid
            loadAgenda();
            
            // Update countdown dengan data baru
            updateCountdown();
            
            console.log('✅ Agenda updated from JSON');
        }
    } catch (error) {
        console.log('ℹ️ Using default agenda data (no agenda.json found)');
    }
}
// ==================== EXPOSE FUNCTIONS TO GLOBAL ====================
// Semua fungsi yang dipanggil dari HTML (onclick, dll) harus tersedia di window.
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
window.filterKategori = filterKategori;
window.filterArsip = filterArsip;
// Ekspos fungsi ke global scope
window.filterKategori = filterKategori;
window.filterArsip = filterArsip;
window.toggleMenu = toggleMenu;
window.toggleDarkMode = toggleDarkMode;
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.openGlobalSearch = openGlobalSearch;
window.closeGlobalSearch = closeGlobalSearch;
window.performGlobalSearch = performGlobalSearch;
window.navigateTo = navigateTo;
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
