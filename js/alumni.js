(function () {
    'use strict';

    const grid = document.getElementById('alumniGrid');
    const timelineWrap = document.getElementById('alumniTimeline');
    const emptyMsg = document.getElementById('alumniEmpty');
    const searchInput = document.getElementById('alumniSearch');
    const chipsWrap = document.getElementById('alumniFilterChips');
    const sortSelect = document.getElementById('apSortSelect');
    const statsBlock = document.getElementById('apStatsBlock');
    const spotlightWrap = document.getElementById('apSpotlightWrap');

    let activeFilter = 'all';
    let searchTerm = '';
    let sortMode = 'terbaru';
    let viewMode = 'grid'; // 'grid' | 'timeline'

    // ============================================================
    // UTIL
    // ============================================================
    function initials(name) {
        return name.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    function angkatanLabel(key, short) {
        const found = ANGKATAN_LIST.find(function (a) { return a.key === key; });
        if (!found) return key;
        return short ? found.label.replace(/^[^ ]+\s/, '') : found.label;
    }

    function photoOrInitials(a, className) {
        return a.foto
            ? '<img src="' + a.foto + '" alt="' + a.nama + '" class="' + className + '">'
            : '<div class="' + className + ' ap-card-initials">' + initials(a.nama) + '</div>';
    }

    function toWaLink(noHp) {
        const digits = noHp.replace(/\D/g, '');
        const wa = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
        return 'https://wa.me/' + wa;
    }

    // ============================================================
    // FITUR 2: STATISTIK DENGAN ANIMASI COUNT-UP
    // ============================================================
    function animateCount(el, target, duration) {
        const start = 0;
        const startTime = performance.now();
        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + (target - start) * eased);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function buildStats() {
        const total = alumniData.length;
        const bekerja = alumniData.filter(function (a) { return a.tahunLulus; }).length;

        statsBlock.innerHTML =
            '<div class="ap-stat-mini"><strong data-target="' + total + '">0</strong><span>Total Alumni</span></div>' +
            '<div class="ap-stat-mini"><strong data-target="' + bekerja + '">0</strong><span>Sudah Lulus</span></div>';

        statsBlock.querySelectorAll('strong').forEach(function (el) {
            animateCount(el, parseInt(el.dataset.target, 10), 900);
        });
    }

    // ============================================================
    // SPOTLIGHT (ALUMNI UNGGULAN)
    // ============================================================
    function buildSpotlight() {
        const featured = alumniData.filter(function (a) { return a.unggulan; });
        if (featured.length === 0) { spotlightWrap.remove(); return; }

        spotlightWrap.innerHTML =
            '<div class="ap-spotlight-grid">' +
            featured.map(function (a) {
                return (
                    '<div class="ap-spotlight-card">' +
                        photoOrInitials(a, 'ap-spotlight-photo') +
                        '<div>' +
                            '<h4>' + a.nama + '</h4>' +
                            '<span>' + a.profesiSekarang + '</span>' +
                        '</div>' +
                    '</div>'
                );
            }).join('') +
            '</div>';

        applyTilt(spotlightWrap.querySelectorAll('.ap-spotlight-card'));
    }

    // ============================================================
    // FILTER CHIPS
    // ============================================================
    function buildChips() {
        ANGKATAN_LIST.forEach(function (item) {
            const chip = document.createElement('button');
            chip.className = 'ap-chip' + (item.key === 'all' ? ' ap-chip-active' : '');
            chip.textContent = item.label;
            chip.addEventListener('click', function () {
                activeFilter = item.key;
                document.querySelectorAll('.ap-chip').forEach(function (c) {
                    c.classList.toggle('ap-chip-active', c === chip);
                });
                render();
            });
            chipsWrap.appendChild(chip);
        });
    }

    // ============================================================
    // SORT
    // ============================================================
    function sortData(list) {
        const arr = list.slice();
        switch (sortMode) {
            case 'terbaru':
                return arr.sort(function (a, b) { return (b.tahunLulus || 9999) - (a.tahunLulus || 9999); });
            case 'terlama':
                return arr.sort(function (a, b) { return (a.tahunLulus || 0) - (b.tahunLulus || 0); });
            case 'az':
                return arr.sort(function (a, b) { return a.nama.localeCompare(b.nama); });
            case 'za':
                return arr.sort(function (a, b) { return b.nama.localeCompare(a.nama); });
            default:
                return arr;
        }
    }

    function getFiltered() {
        return alumniData.filter(function (a) {
            const matchFilter = activeFilter === 'all' || a.angkatan === activeFilter;
            const haystack = (a.nama + ' ' + a.profesiSekarang).toLowerCase();
            return matchFilter && haystack.includes(searchTerm);
        });
    }

    // ============================================================
    // RENDER: GRID (dengan foto sebagai background kartu)
    // ============================================================
    function renderGrid(filtered) {
        grid.innerHTML = filtered.map(function (a) {
            return (
                '<article class="ap-card" data-index="' + alumniData.indexOf(a) + '">' +
                    '<div class="ap-card-top">' +
                        photoOrInitials(a, 'ap-card-photo') +
                        '<div>' +
                            '<h3 class="ap-card-name">' + a.nama + '</h3>' +
                            '<span class="ap-card-batch">' + angkatanLabel(a.angkatan, true) + (a.tahunLulus ? ' &bull; Lulus ' + a.tahunLulus : ' &bull; Masih Aktif') + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ap-card-role">' +
                        '<i class="fas fa-briefcase"></i>' +
                        '<div><strong>' + a.profesiSekarang + '</strong><span>' + a.lokasi + '</span></div>' +
                    '</div>' +
                    '<blockquote class="ap-card-quote"><i class="fas fa-quote-left"></i>' + a.testimoni + '</blockquote>' +
                    '<span class="ap-card-hint"><i class="fas fa-arrows-rotate"></i> Klik untuk lihat testimoni lengkap</span>' +
                '</article>'
            );
        }).join('');

        applyTilt(grid.querySelectorAll('.ap-card'));

        grid.querySelectorAll('.ap-card').forEach(function (card) {
            card.addEventListener('click', function () {
                openFlipModal(alumniData[parseInt(card.dataset.index, 10)]);
            });
        });
    }

    // ============================================================
    // FITUR 3: RENDER TIMELINE (dikelompokkan per tahun)
    // ============================================================
    function renderTimeline(filtered) {
        const sorted = filtered.slice().sort(function (a, b) {
            return (a.tahunLulus || 9999) - (b.tahunLulus || 9999);
        });

        const groups = {};
        sorted.forEach(function (a) {
            const key = a.tahunLulus ? String(a.tahunLulus) : 'Masih Aktif';
            if (!groups[key]) groups[key] = [];
            groups[key].push(a);
        });

        timelineWrap.innerHTML = Object.keys(groups).map(function (year) {
            return (
                '<div class="ap-timeline-year">' + year + '</div>' +
                groups[year].map(function (a) {
                    const bgStyle = a.foto ? ' style="background-image:url(\'' + a.foto + '\')"' : '';
                    return (
                        '<div class="ap-timeline-item" data-index="' + alumniData.indexOf(a) + '">' +
                            '<div class="ap-timeline-photo"' + bgStyle + '>' +
                                (a.foto ? '' : '') +
                            '</div>' +
                            '<div><h4>' + a.nama + '</h4><span>' + a.profesiSekarang + ' &bull; ' + a.lokasi + '</span></div>' +
                        '</div>'
                    );
                }).join('')
            );
        }).join('');

        timelineWrap.querySelectorAll('.ap-timeline-item').forEach(function (item) {
            item.addEventListener('click', function () {
                openFlipModal(alumniData[parseInt(item.dataset.index, 10)]);
            });
        });
    }

    // ============================================================
    // RENDER UTAMA
    // ============================================================
    function render() {
        let filtered = getFiltered();
        filtered = sortData(filtered);
        emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

        if (viewMode === 'grid') {
            renderGrid(filtered);
        } else {
            renderTimeline(filtered);
        }
    }

    // ============================================================
    // FITUR 3 (lanjutan): TOGGLE GRID / TIMELINE
    // ============================================================
    const viewGridBtn = document.getElementById('apViewGrid');
    const viewTimelineBtn = document.getElementById('apViewTimeline');

    function setViewMode(mode) {
        viewMode = mode;
        grid.style.display = mode === 'grid' ? 'grid' : 'none';
        timelineWrap.style.display = mode === 'timeline' ? 'block' : 'none';
        viewGridBtn.classList.toggle('ap-view-active', mode === 'grid');
        viewTimelineBtn.classList.toggle('ap-view-active', mode === 'timeline');
        render();
    }

    viewGridBtn.addEventListener('click', function () { setViewMode('grid'); });
    viewTimelineBtn.addEventListener('click', function () { setViewMode('timeline'); });

    // ============================================================
    // FITUR 4: KENALAN ALUMNI ACAK
    // ============================================================
    const randomBtn = document.getElementById('apRandomBtn');
    randomBtn.addEventListener('click', function () {
        randomBtn.classList.remove('ap-spin');
        void randomBtn.offsetWidth; // restart animasi
        randomBtn.classList.add('ap-spin');

        const randomAlumni = alumniData[Math.floor(Math.random() * alumniData.length)];
        openFlipModal(randomAlumni);
    });

    // ============================================================
    // EFEK 3D TILT (mouse parallax, desktop saja)
    // ============================================================
    function applyTilt(elements) {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (isTouchDevice) return;

        elements.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y / rect.height) - 0.5) * -10;
                const rotateY = ((x / rect.width) - 0.5) * 10;
                el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(0)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // ============================================================
    // FITUR 1 & 5: MODAL 3D FLIP dengan foto banner + tombol aksi
    // ============================================================
    const modalBackdrop = document.getElementById('apModalBackdrop');
    const modal3d = document.getElementById('apModal3d');

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            showCopyToast('📋 Testimoni disalin ke clipboard!');
        }).catch(function () {
            showCopyToast('Gagal menyalin, coba lagi.');
        });
    }

    function showCopyToast(msg) {
        let toast = document.querySelector('.ap-copy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'ap-copy-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('ap-show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(function () { toast.classList.remove('ap-show'); }, 2500);
    }

    function openFlipModal(a) {
        const currentIndex = alumniData.indexOf(a);

        const waButton = a.noHp
            ? '<button class="ap-flip-btn ap-btn-wa" id="apFlipWa"><i class="fab fa-whatsapp"></i> Sapa via WhatsApp</button>'
            : '';

        modal3d.innerHTML =
            '<button class="ap-flip-modal-nav ap-flip-modal-prev" id="apFlipPrev" aria-label="Alumni sebelumnya"><i class="fas fa-chevron-left"></i></button>' +
            '<div class="ap-flip-card" id="apFlipCard">' +
                '<div class="ap-flip-inner">' +
                    '<div class="ap-flip-face ap-flip-front">' +
                        '<button class="ap-modal-close" id="apModalCloseBtn"><i class="fas fa-times"></i></button>' +
                        '<div class="ap-flip-photo-banner">' +
                            photoOrInitials(a, 'ap-flip-photo') +
                            '<h3>' + a.nama + '</h3>' +
                            '<span class="ap-card-batch">' + angkatanLabel(a.angkatan, true) + (a.tahunLulus ? ' &bull; Lulus ' + a.tahunLulus : ' &bull; Masih Aktif') + '</span>' +
                        '</div>' +
                        '<div class="ap-flip-front-body">' +
                            '<div class="ap-flip-role"><i class="fas fa-briefcase"></i> <strong>' + a.profesiSekarang + '</strong><br><span style="color:#6b7280;font-size:0.78rem;">' + a.lokasi + '</span></div>' +
                            '<button class="ap-flip-btn" id="apFlipToBack"><i class="fas fa-quote-right"></i> Lihat Testimoni</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ap-flip-face ap-flip-back">' +
                        '<h4><i class="fas fa-quote-left"></i> Testimoni</h4>' +
                        '<blockquote>' + a.testimoni + '</blockquote>' +
                        '<div class="ap-flip-actions">' +
                            '<button class="ap-flip-btn ap-btn-copy" id="apFlipCopy"><i class="fas fa-copy"></i> Salin</button>' +
                            waButton +
                        '</div>' +
                        '<button class="ap-flip-btn" id="apFlipToFront" style="margin-top:0.8rem;width:100%;justify-content:center;"><i class="fas fa-rotate-left"></i> Kembali</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<button class="ap-flip-modal-nav ap-flip-modal-next" id="apFlipNext" aria-label="Alumni berikutnya"><i class="fas fa-chevron-right"></i></button>';

        const flipCard = document.getElementById('apFlipCard');

        document.getElementById('apModalCloseBtn').addEventListener('click', closeFlipModal);
        document.getElementById('apFlipToBack').addEventListener('click', function () {
            flipCard.classList.add('ap-flipped');
        });
        document.getElementById('apFlipToFront').addEventListener('click', function () {
            flipCard.classList.remove('ap-flipped');
        });
        document.getElementById('apFlipCopy').addEventListener('click', function () {
            copyToClipboard('"' + a.testimoni + '" — ' + a.nama + ', Alumni Mapatek Abhipraya (' + angkatanLabel(a.angkatan, true) + ')');
        });
        const waBtn = document.getElementById('apFlipWa');
        if (waBtn) {
            waBtn.addEventListener('click', function () {
                window.open(toWaLink(a.noHp) + '?text=' + encodeURIComponent('Halo ' + a.nama.split(' ')[0] + ', saya melihat profil kakak di halaman Alumni Mapatek Abhipraya. Boleh sharing pengalaman lebih lanjut? 🌲'), '_blank');
            });
        }

        // FITUR: navigasi sebelumnya/berikutnya tanpa menutup modal
        document.getElementById('apFlipPrev').addEventListener('click', function () {
            const prevIndex = (currentIndex - 1 + alumniData.length) % alumniData.length;
            openFlipModal(alumniData[prevIndex]);
        });
        document.getElementById('apFlipNext').addEventListener('click', function () {
            const nextIndex = (currentIndex + 1) % alumniData.length;
            openFlipModal(alumniData[nextIndex]);
        });

        modalBackdrop.classList.add('ap-active');
        document.body.style.overflow = 'hidden';
    }

    function closeFlipModal() {
        modalBackdrop.classList.remove('ap-active');
        document.body.style.overflow = '';
    }

    modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeFlipModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeFlipModal();
    });

    // ============================================================
    // NAVBAR — hamburger drawer mobile
    // ============================================================
    const navBurger = document.getElementById('apNavBurger');
    const drawer = document.getElementById('apDrawer');
    const drawerBackdrop = document.getElementById('apDrawerBackdrop');
    const drawerClose = document.getElementById('apDrawerClose');

    function openDrawer() {
        drawer.classList.add('ap-active');
        drawerBackdrop.classList.add('ap-active');
    }
    function closeDrawer() {
        drawer.classList.remove('ap-active');
        drawerBackdrop.classList.remove('ap-active');
    }

    if (navBurger) navBurger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    // ============================================================
    // SIDEBAR FILTER — mode drawer di mobile
    // ============================================================
    const sidebar = document.getElementById('apSidebar');
    const mobileFilterBtn = document.getElementById('apMobileFilterBtn');
    const sidebarClose = document.getElementById('apSidebarClose');
    const applyBtn = document.getElementById('apApplyBtn');

    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', function () {
            sidebar.classList.add('ap-sidebar-open');
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function () {
            sidebar.classList.remove('ap-sidebar-open');
        });
    }
    if (applyBtn) {
        applyBtn.addEventListener('click', function () {
            sidebar.classList.remove('ap-sidebar-open');
        });
    }

    // ============================================================
    // EVENTS
    // ============================================================
    searchInput.addEventListener('input', function () {
        searchTerm = searchInput.value.toLowerCase().trim();
        render();
    });

    sortSelect.addEventListener('change', function () {
        sortMode = sortSelect.value;
        render();
    });

    // ============================================================
    // FITUR: PROGRESS BAR SCROLL
    // ============================================================
    const progressBar = document.getElementById('apProgressBar');
    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + '%';
    }, { passive: true });

    // ============================================================
    // FITUR: HERO BACKGROUND SLIDESHOW + PARALLAX 3D
    // ============================================================
    (function initHeroSlideshow() {
        const heroBg = document.getElementById('apHeroBg');
        const heroInner = document.getElementById('apHeroInner');
        const hero = document.getElementById('apHero');
        if (!heroBg) return;

        const photos = alumniData.map(function (a) { return a.foto; }).filter(Boolean);
        if (photos.length === 0) return;

        let idx = 0;
        heroBg.style.backgroundImage = 'url(\'' + photos[0] + '\')';

        setInterval(function () {
            idx = (idx + 1) % photos.length;
            heroBg.style.backgroundImage = 'url(\'' + photos[idx] + '\')';
        }, 4500);

        // Parallax 3D ringan mengikuti gerakan mouse (desktop saja)
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (!isTouchDevice) {
            hero.addEventListener('mousemove', function (e) {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                heroBg.style.transform = 'translateZ(-100px) scale(1.15) translate(' + (x * -14) + 'px,' + (y * -10) + 'px)';
                heroInner.style.transform = 'translate(' + (x * 8) + 'px,' + (y * 6) + 'px)';
            });
            hero.addEventListener('mouseleave', function () {
                heroBg.style.transform = 'translateZ(-100px) scale(1.15)';
                heroInner.style.transform = 'translate(0,0)';
            });
        }
    })();

    // ============================================================
    // FITUR: DARK MODE TOGGLE (tersimpan di localStorage)
    // ============================================================
    (function initDarkMode() {
        const darkToggle = document.getElementById('apDarkToggle');
        if (!darkToggle) return;
        const icon = darkToggle.querySelector('i');

        function applyDark(isDark) {
            document.body.classList.toggle('ap-dark', isDark);
            icon.classList.toggle('fa-moon', !isDark);
            icon.classList.toggle('fa-sun', isDark);
        }

        applyDark(localStorage.getItem('ap-dark-mode') === 'true');

        darkToggle.addEventListener('click', function () {
            const isDark = !document.body.classList.contains('ap-dark');
            applyDark(isDark);
            localStorage.setItem('ap-dark-mode', isDark);
        });
    })();

    // ============================================================
    // FITUR: BAGIKAN HALAMAN
    // ============================================================
    (function initShareButton() {
        const shareBtn = document.getElementById('apShareBtn');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', function () {
            const shareData = {
                title: 'Alumni & Jejak Karir | Mapatek Abhipraya',
                text: 'Lihat kisah alumni Mapatek Abhipraya setelah lulus!',
                url: window.location.href
            };
            if (navigator.share) {
                navigator.share(shareData).catch(function () {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    showCopyToast('🔗 Link halaman disalin!');
                });
            }
        });
    })();

    // ============================================================
    // FITUR: GRAFIK MINI SEBARAN ALUMNI PER ANGKATAN
    // ============================================================
    function buildChart() {
        const chartWrap = document.getElementById('apChart');
        if (!chartWrap) return;

        const counts = {};
        alumniData.forEach(function (a) { counts[a.angkatan] = (counts[a.angkatan] || 0) + 1; });
        const max = Math.max.apply(null, Object.values(counts).concat([1]));

        chartWrap.innerHTML = ANGKATAN_LIST.filter(function (a) { return a.key !== 'all'; }).map(function (item) {
            const count = counts[item.key] || 0;
            return (
                '<div class="ap-chart-row">' +
                    '<span class="ap-chart-label">' + angkatanLabel(item.key, true) + '</span>' +
                    '<div class="ap-chart-track"><div class="ap-chart-fill" data-width="' + ((count / max) * 100) + '"></div></div>' +
                    '<span class="ap-chart-count">' + count + '</span>' +
                '</div>'
            );
        }).join('');

        setTimeout(function () {
            chartWrap.querySelectorAll('.ap-chart-fill').forEach(function (bar) {
                bar.style.width = bar.dataset.width + '%';
            });
        }, 100);
    }

    // ============================================================
    // FITUR: NAVIGASI KEYBOARD DI MODAL (panah kiri/kanan)
    // ============================================================
    document.addEventListener('keydown', function (e) {
        if (!modalBackdrop.classList.contains('ap-active')) return;
        if (e.key === 'ArrowLeft') {
            const btn = document.getElementById('apFlipPrev');
            if (btn) btn.click();
        }
        if (e.key === 'ArrowRight') {
            const btn = document.getElementById('apFlipNext');
            if (btn) btn.click();
        }
    });

    // ============================================================
    // INIT
    // ============================================================
    buildStats();
    buildChart();
    buildSpotlight();
    buildChips();
    render();
})();