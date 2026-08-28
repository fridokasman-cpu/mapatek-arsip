(function () {
    'use strict';

    const grid = document.getElementById('alumniGrid');
    const emptyMsg = document.getElementById('alumniEmpty');
    const searchInput = document.getElementById('alumniSearch');
    const chipsWrap = document.getElementById('alumniFilterChips');
    const sortSelect = document.getElementById('apSortSelect');
    const statsBlock = document.getElementById('apStatsBlock');
    const spotlightWrap = document.getElementById('apSpotlightWrap');

    let activeFilter = 'all';
    let searchTerm = '';
    let sortMode = 'terbaru';

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

    // ============================================================
    // STATISTIK SIDEBAR
    // ============================================================
    function buildStats() {
        const total = alumniData.length;
        const bekerja = alumniData.filter(function (a) { return a.tahunLulus; }).length;
        statsBlock.innerHTML =
            '<div class="ap-stat-mini"><strong>' + total + '</strong><span>Total Alumni</span></div>' +
            '<div class="ap-stat-mini"><strong>' + bekerja + '</strong><span>Sudah Lulus</span></div>';
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

        // Tilt 3D ringan untuk kartu spotlight
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

    // ============================================================
    // RENDER GRID
    // ============================================================
    function render() {
        let filtered = alumniData.filter(function (a) {
            const matchFilter = activeFilter === 'all' || a.angkatan === activeFilter;
            const haystack = (a.nama + ' ' + a.profesiSekarang).toLowerCase();
            return matchFilter && haystack.includes(searchTerm);
        });

        filtered = sortData(filtered);
        emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

        grid.innerHTML = filtered.map(function (a, i) {
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
    // MODAL 3D FLIP — DETAIL ALUMNI
    // ============================================================
    const modalBackdrop = document.getElementById('apModalBackdrop');
    const modal3d = document.getElementById('apModal3d');

    function openFlipModal(a) {
        modal3d.innerHTML =
            '<div class="ap-flip-card" id="apFlipCard">' +
                '<div class="ap-flip-inner">' +
                    '<div class="ap-flip-face ap-flip-front">' +
                        '<button class="ap-modal-close" id="apModalCloseBtn"><i class="fas fa-times"></i></button>' +
                        photoOrInitials(a, 'ap-flip-photo') +
                        '<h3>' + a.nama + '</h3>' +
                        '<span class="ap-card-batch">' + angkatanLabel(a.angkatan, true) + (a.tahunLulus ? ' &bull; Lulus ' + a.tahunLulus : ' &bull; Masih Aktif') + '</span>' +
                        '<div class="ap-flip-role"><i class="fas fa-briefcase"></i> <strong>' + a.profesiSekarang + '</strong><br><span style="color:#6b7280;font-size:0.78rem;">' + a.lokasi + '</span></div>' +
                        '<button class="ap-flip-btn" id="apFlipToBack"><i class="fas fa-quote-right"></i> Lihat Testimoni</button>' +
                    '</div>' +
                    '<div class="ap-flip-face ap-flip-back">' +
                        '<h4><i class="fas fa-quote-left"></i> Testimoni</h4>' +
                        '<blockquote>' + a.testimoni + '</blockquote>' +
                        '<button class="ap-flip-btn" id="apFlipToFront"><i class="fas fa-rotate-left"></i> Kembali</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        const flipCard = document.getElementById('apFlipCard');

        document.getElementById('apModalCloseBtn').addEventListener('click', closeFlipModal);
        document.getElementById('apFlipToBack').addEventListener('click', function () {
            flipCard.classList.add('ap-flipped');
        });
        document.getElementById('apFlipToFront').addEventListener('click', function () {
            flipCard.classList.remove('ap-flipped');
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
    // INIT
    // ============================================================
    buildStats();
    buildSpotlight();
    buildChips();
    render();
})();