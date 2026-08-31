(function () {
    'use strict';

    const tableBody = document.getElementById('daTableBody');
    const cardsWrap = document.getElementById('daCards');
    const emptyMsg = document.getElementById('daEmpty');
    const searchInput = document.getElementById('daSearch');
    const chipsWrap = document.getElementById('daFilterChips');
    const divisiChipsWrap = document.getElementById('daDivisiChips');
    const statsWrap = document.getElementById('daStats');
    const divChartWrap = document.getElementById('daDivChart');

    let activeFilter = 'all';
    let activeDivisi = 'all';
    let searchTerm = '';
    let sortKey = 'namaLengkap';
    let sortDir = 1; // 1 = asc, -1 = desc

    // ============================================================
    // UTIL
    // ============================================================
    function initials(name) {
        return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    }

    function photoOrInitials(a, extraClass) {
        extraClass = extraClass || '';
        if (a.foto) return '<img class="' + extraClass + '" src="' + a.foto + '" alt="' + a.namaLengkap + '">';
        return '<span class="' + extraClass + ' da-avatar-initials">' + initials(a.namaLengkap) + '</span>';
    }

    function toWaLink(noHp) {
        if (!noHp) return '#';
        const digits = noHp.replace(/\D/g, '');
        const wa = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
        return 'https://wa.me/' + wa;
    }

    function angkatanLabel(key) {
        const found = ANGKATAN_LIST_DA.find(function (a) { return a.key === key; });
        return found ? found.label : key;
    }

    function divisiLabel(key) {
        const found = DIVISI_LIST.find(function (d) { return d.key === key; });
        return found ? found.label : key;
    }

    // NIM disamarkan sebagian untuk privasi — hanya beberapa karakter
    // pertama & terakhir yang tampil, sisanya diganti bintang.
    function maskNim(nim) {
        if (!nim || nim.length < 6) return nim;
        const clean = nim;
        const visibleStart = clean.slice(0, 2);
        const visibleEnd = clean.slice(-3);
        const middleLength = Math.max(clean.length - 5, 3);
        return visibleStart + '*'.repeat(Math.min(middleLength, 6)) + visibleEnd;
    }

    function statusClass(status) {
        if (status === 'Aktif') return 'status-aktif';
        if (status === 'Cuti') return 'status-cuti';
        return 'status-purna';
    }

    function statusBadge(status) {
        return '<span class="da-badge-status ' + statusClass(status) + '"><i class="fas fa-circle"></i> ' + status + '</span>';
    }

    function lamaBergabung(tanggal) {
        if (!tanggal) return '-';
        const start = new Date(tanggal);
        const now = new Date();
        let bulan = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
        if (bulan < 12) return bulan + ' bulan';
        const tahun = Math.floor(bulan / 12);
        const sisaBulan = bulan % 12;
        return tahun + ' tahun' + (sisaBulan > 0 ? ' ' + sisaBulan + ' bulan' : '');
    }

    function formatTanggal(tanggal) {
        if (!tanggal) return '-';
        const d = new Date(tanggal);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // ============================================================
    // 📊 STATISTIK & GRAFIK DIVISI
    // ============================================================
    function buildStats() {
        const total = anggotaData.length;
        const aktif = anggotaData.filter(function (a) { return a.status === 'Aktif'; }).length;
        const perAngkatan = {};
        anggotaData.forEach(function (a) {
            perAngkatan[a.angkatan] = (perAngkatan[a.angkatan] || 0) + 1;
        });

        let html = '<div class="da-stat-card da-stat-total"><span class="da-stat-num">' + total + '</span><span class="da-stat-label">Total Anggota</span></div>';
        html += '<div class="da-stat-card"><span class="da-stat-num">' + aktif + '</span><span class="da-stat-label">Aktif Sekarang</span></div>';

        ANGKATAN_LIST_DA.filter(function (a) { return a.key !== 'all'; }).forEach(function (a) {
            const count = perAngkatan[a.key] || 0;
            html += '<div class="da-stat-card"><span class="da-stat-num">' + count + '</span><span class="da-stat-label">' + a.label + '</span></div>';
        });

        statsWrap.innerHTML = html;

        // Grafik batang sederhana: sebaran per divisi
        if (divChartWrap) {
            const perDivisi = {};
            anggotaData.forEach(function (a) {
                perDivisi[a.divisi] = (perDivisi[a.divisi] || 0) + 1;
            });
            const maxCount = Math.max.apply(null, Object.values(perDivisi).concat([1]));

            divChartWrap.innerHTML = DIVISI_LIST.filter(function (d) { return d.key !== 'all'; }).map(function (d) {
                const count = perDivisi[d.key] || 0;
                const pct = Math.round((count / maxCount) * 100);
                return (
                    '<div class="da-divbar-row">' +
                        '<span class="da-divbar-label">' + d.label + '</span>' +
                        '<span class="da-divbar-track"><span class="da-divbar-fill" style="width:' + pct + '%"></span></span>' +
                        '<span class="da-divbar-count">' + count + '</span>' +
                    '</div>'
                );
            }).join('');
        }
    }

    // ============================================================
    // FILTER CHIPS (Angkatan & Divisi)
    // ============================================================
    function buildChips() {
        ANGKATAN_LIST_DA.forEach(function (item) {
            const chip = document.createElement('button');
            chip.className = 'da-chip' + (item.key === 'all' ? ' da-chip-active' : '');
            chip.textContent = item.label;
            chip.addEventListener('click', function () {
                activeFilter = item.key;
                chipsWrap.querySelectorAll('.da-chip').forEach(function (c) {
                    c.classList.toggle('da-chip-active', c === chip);
                });
                render();
            });
            chipsWrap.appendChild(chip);
        });

        if (divisiChipsWrap) {
            DIVISI_LIST.forEach(function (item) {
                const chip = document.createElement('button');
                chip.className = 'da-chip' + (item.key === 'all' ? ' da-chip-active' : '');
                chip.textContent = item.label;
                chip.addEventListener('click', function () {
                    activeDivisi = item.key;
                    divisiChipsWrap.querySelectorAll('.da-chip').forEach(function (c) {
                        c.classList.toggle('da-chip-active', c === chip);
                    });
                    render();
                });
                divisiChipsWrap.appendChild(chip);
            });
        }
    }

    // ============================================================
    // SORTING (klik header tabel)
    // ============================================================
    function initSorting() {
        document.querySelectorAll('.da-table th[data-sort]').forEach(function (th) {
            th.addEventListener('click', function () {
                const key = th.dataset.sort;
                if (sortKey === key) {
                    sortDir *= -1;
                } else {
                    sortKey = key;
                    sortDir = 1;
                }
                document.querySelectorAll('.da-table th[data-sort]').forEach(function (h) {
                    h.classList.toggle('da-sort-active', h === th);
                    const icon = h.querySelector('i');
                    if (icon) icon.className = h === th ? (sortDir === 1 ? 'fas fa-arrow-up' : 'fas fa-arrow-down') : 'fas fa-sort';
                });
                render();
            });
        });
    }

    function sortData(list) {
        return list.slice().sort(function (x, y) {
            let av = x.a[sortKey];
            let bv = y.a[sortKey];
            if (typeof av === 'string') av = av.toLowerCase();
            if (typeof bv === 'string') bv = bv.toLowerCase();
            if (av < bv) return -1 * sortDir;
            if (av > bv) return 1 * sortDir;
            return 0;
        });
    }

    // ============================================================
    // RENDER TABEL & KARTU
    // ============================================================
    function getFiltered() {
        return anggotaData
            .map(function (a, i) { return { a: a, no: i + 1 }; })
            .filter(function (item) {
                const a = item.a;
                const matchFilter = activeFilter === 'all' || a.angkatan === activeFilter;
                const matchDivisi = activeDivisi === 'all' || a.divisi === activeDivisi;
                const haystack = (a.namaLengkap + ' ' + a.nim + ' ' + a.namaLapangan + ' ' + a.jabatan).toLowerCase();
                const matchSearch = haystack.includes(searchTerm);
                return matchFilter && matchDivisi && matchSearch;
            });
    }

    function render() {
        const filtered = sortData(getFiltered());

        emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

        // Tabel (desktop)
        tableBody.innerHTML = filtered.map(function (item, idx) {
            const a = item.a;
            const waDisabled = !a.noHp ? ' da-wa-disabled' : '';
            return (
                '<tr data-index="' + anggotaData.indexOf(a) + '">' +
                    '<td>' + (idx + 1) + '</td>' +
                    '<td class="da-cell-person">' + photoOrInitials(a) +
                        '<div><div class="da-cell-name">' + a.namaLengkap + '</div><div class="da-cell-sub">' + a.namaLapangan + '</div></div>' +
                    '</td>' +
                    '<td><span class="da-badge">' + angkatanLabel(a.angkatan).replace(/^[^ ]+\s/, '') + '</span></td>' +
                    '<td>' + a.jabatan + '</td>' +
                    '<td>' + maskNim(a.nim) + '</td>' +
                    '<td>' + statusBadge(a.status) + '</td>' +
                    '<td><a href="' + toWaLink(a.noHp) + '" target="_blank" class="da-wa-btn' + waDisabled + '" aria-label="Chat WhatsApp ' + a.namaLengkap + '" onclick="event.stopPropagation()"><i class="fab fa-whatsapp"></i></a></td>' +
                '</tr>'
            );
        }).join('');

        tableBody.querySelectorAll('tr').forEach(function (tr) {
            tr.addEventListener('click', function () {
                openMemberModal(anggotaData[parseInt(tr.dataset.index, 10)]);
            });
        });

        // Kartu (mobile)
        cardsWrap.innerHTML = filtered.map(function (item) {
            const a = item.a;
            const waDisabled = !a.noHp ? ' da-wa-disabled' : '';
            return (
                '<div class="da-card" data-index="' + anggotaData.indexOf(a) + '">' +
                    '<div class="da-card-head">' +
                        '<div class="da-card-head-left">' + photoOrInitials(a) +
                            '<div><strong>' + a.namaLengkap + '</strong><div class="da-cell-sub">' + a.jabatan + '</div></div>' +
                        '</div>' +
                        '<a href="' + toWaLink(a.noHp) + '" target="_blank" class="da-wa-btn' + waDisabled + '" aria-label="Chat WhatsApp ' + a.namaLengkap + '" onclick="event.stopPropagation()"><i class="fab fa-whatsapp"></i></a>' +
                    '</div>' +
                    '<div class="da-card-row"><span>Angkatan</span><strong>' + angkatanLabel(a.angkatan).replace(/^[^ ]+\s/, '') + '</strong></div>' +
                    '<div class="da-card-row"><span>NIM</span><strong>' + maskNim(a.nim) + '</strong></div>' +
                    '<div class="da-card-row"><span>Status</span><strong>' + a.status + '</strong></div>' +
                '</div>'
            );
        }).join('');

        cardsWrap.querySelectorAll('.da-card').forEach(function (card) {
            card.addEventListener('click', function () {
                openMemberModal(anggotaData[parseInt(card.dataset.index, 10)]);
            });
        });
    }

    // ============================================================
    // MODAL DETAIL ANGGOTA
    // ============================================================
    const modalBackdrop = document.getElementById('daModalBackdrop');
    const modalClose = document.getElementById('daModalClose');
    const modalHead = document.getElementById('daModalHead');
    const modalRows = document.getElementById('daModalRows');
    const modalWaBtn = document.getElementById('daModalWaBtn');
    const modalCardBtn = document.getElementById('daModalCardBtn');

    let modalActive = null;

    function openMemberModal(a) {
        modalActive = a;
        modalHead.innerHTML =
            photoOrInitials(a) +
            '<h3>' + a.namaLengkap + '</h3>' +
            '<p>"' + a.namaLapangan + '" &middot; ' + a.jabatan + '</p>';

        modalRows.innerHTML =
            '<div class="da-modal-row"><span>Angkatan</span><strong>' + angkatanLabel(a.angkatan) + '</strong></div>' +
            '<div class="da-modal-row"><span>Divisi</span><strong>' + divisiLabel(a.divisi) + '</strong></div>' +
            '<div class="da-modal-row"><span>Status</span><strong>' + a.status + '</strong></div>' +
            '<div class="da-modal-row"><span>NIM</span><strong>' + maskNim(a.nim) + '</strong></div>' +
            '<div class="da-modal-row"><span>Bergabung sejak</span><strong>' + formatTanggal(a.tanggalBergabung) + '</strong></div>' +
            '<div class="da-modal-row"><span>Lama bergabung</span><strong>' + lamaBergabung(a.tanggalBergabung) + '</strong></div>' +
            '<div class="da-modal-row"><span>Kegiatan diikuti</span><strong>' + a.jumlahKegiatan + 'x</strong></div>';

        if (a.noHp) {
            modalWaBtn.href = toWaLink(a.noHp);
            modalWaBtn.style.display = 'inline-flex';
        } else {
            modalWaBtn.style.display = 'none';
        }

        modalBackdrop.classList.add('da-active');
        document.body.style.overflow = 'hidden';
    }

    function closeMemberModal() {
        modalBackdrop.classList.remove('da-active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeMemberModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeMemberModal();
    });
    if (modalCardBtn) modalCardBtn.addEventListener('click', function () {
        if (modalActive) {
            closeMemberModal();
            renderIdCard(modalActive);
            const section = document.getElementById('daIdCardSection');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // ============================================================
    // 🪪 KARTU ANGGOTA DIGITAL 3D
    // ============================================================
    const idCardPicker = document.getElementById('daIdCardPicker');
    const idCard = document.getElementById('daIdCard');
    const idCardShine = document.getElementById('daIdCardShine');
    const idCardPhoto = document.getElementById('daIdCardPhoto');
    const idCardStatusDot = document.getElementById('daIdCardStatusDot');
    const idCardName = document.getElementById('daIdCardName');
    const idCardLapangan = document.getElementById('daIdCardLapangan');
    const idCardJabatan = document.getElementById('daIdCardJabatan');
    const idCardMeta = document.getElementById('daIdCardMeta');
    const idCardId = document.getElementById('daIdCardId');
    const idCardWaBtn = document.getElementById('daIdCardWaBtn');
    const idCardDetailBtn = document.getElementById('daIdCardDetailBtn');

    let idCardActive = null;

    function memberCode(a) {
        const idx = anggotaData.indexOf(a) + 1;
        return 'MPT-A-' + a.angkatan.slice(0, 3).toUpperCase() + '-' + String(idx).padStart(3, '0');
    }

    function renderIdCard(a) {
        idCardActive = a;

        idCardPhoto.src = a.foto || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(a.namaLengkap) + '&background=059669&color=fff');
        idCardPhoto.alt = a.namaLengkap;
        if (idCardStatusDot) idCardStatusDot.className = 'da-idcard-status-dot ' + statusClass(a.status);
        idCardName.textContent = a.namaLengkap;
        idCardLapangan.textContent = '"' + a.namaLapangan + '"';
        idCardJabatan.textContent = a.jabatan;
        idCardMeta.innerHTML = '<i class="fas fa-users"></i> ' + divisiLabel(a.divisi) + '<br><i class="fas fa-calendar"></i> Bergabung ' + formatTanggal(a.tanggalBergabung);
        idCardId.textContent = memberCode(a);

        if (a.noHp) {
            idCardWaBtn.href = toWaLink(a.noHp);
            idCardWaBtn.classList.remove('da-wa-disabled');
        } else {
            idCardWaBtn.href = '#';
            idCardWaBtn.classList.add('da-wa-disabled');
        }

        idCardPicker.querySelectorAll('.da-idcard-chip-btn').forEach(function (chip) {
            chip.classList.toggle('da-active', parseInt(chip.dataset.index, 10) === anggotaData.indexOf(a));
        });
    }

    function buildIdCardPicker() {
        idCardPicker.innerHTML = anggotaData.map(function (a, i) {
            return (
                '<button class="da-idcard-chip-btn" data-index="' + i + '">' +
                    photoOrInitials(a, '') + '<span>' + a.namaLengkap.split(' ')[0] + '</span>' +
                '</button>'
            );
        }).join('');

        idCardPicker.querySelectorAll('.da-idcard-chip-btn').forEach(function (chip) {
            chip.addEventListener('click', function () {
                trackEvent('member_idcard_select', { anggota: anggotaData[parseInt(chip.dataset.index, 10)].namaLengkap });
                renderIdCard(anggotaData[parseInt(chip.dataset.index, 10)]);
            });
        });
    }

    function initIdCardTilt() {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (isTouchDevice || !idCard) return;

        idCard.addEventListener('mousemove', function (e) {
            const rect = idCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -16;
            const rotateY = ((x / rect.width) - 0.5) * 16;
            idCard.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.03)';
            idCardShine.style.background = 'radial-gradient(circle 160px at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.22), transparent 60%)';
        });

        idCard.addEventListener('mouseleave', function () {
            idCard.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
        });
    }

    function buildIdCardSection() {
        if (!idCard || anggotaData.length === 0) return;
        buildIdCardPicker();
        const ketua = anggotaData.find(function (a) { return a.jabatan === 'Ketua Umum'; }) || anggotaData[0];
        renderIdCard(ketua);
        initIdCardTilt();

        if (idCardDetailBtn) idCardDetailBtn.addEventListener('click', function () {
            if (idCardActive) openMemberModal(idCardActive);
        });
    }

    // ============================================================
    // 🏛️ STRUKTUR ORGANISASI
    // ============================================================
    function buildOrgChart() {
        const wrap = document.getElementById('daOrgChart');
        if (!wrap) return;

        const ketua = anggotaData.find(function (a) { return a.jabatan === 'Ketua Umum'; });
        const wakil = anggotaData.find(function (a) { return a.jabatan === 'Wakil Ketua'; });
        const sekretaris = anggotaData.find(function (a) { return a.jabatan === 'Sekretaris'; });
        const bendahara = anggotaData.find(function (a) { return a.jabatan === 'Bendahara'; });
        const koordinator = anggotaData.filter(function (a) { return a.jabatan.indexOf('Koordinator') === 0; });

        function orgCard(a) {
            if (!a) return '';
            return (
                '<div class="da-org-card" data-nama="' + a.namaLengkap + '">' +
                    photoOrInitials(a, '') +
                    '<div><div class="da-org-card-name">' + a.namaLengkap + '</div><div class="da-org-card-role">' + a.jabatan + '</div></div>' +
                '</div>'
            );
        }

        let html = '<div class="da-org-row">' + orgCard(ketua) + '</div>';
        html += '<div class="da-org-row">' + orgCard(wakil) + '</div>';
        html += '<div class="da-org-row">' + orgCard(sekretaris) + orgCard(bendahara) + '</div>';
        html += '<div class="da-org-row">' + koordinator.map(orgCard).join('') + '</div>';

        wrap.innerHTML = html;

        wrap.querySelectorAll('.da-org-card').forEach(function (card) {
            card.addEventListener('click', function () {
                const nama = card.dataset.nama;
                const a = anggotaData.find(function (x) { return x.namaLengkap === nama; });
                if (a) openMemberModal(a);
            });
        });
    }

    // ============================================================
    // 🎂 WIDGET ULANG TAHUN BULAN INI
    // ============================================================
    function buildBirthdayWidget() {
        const wrap = document.getElementById('daBirthdayList');
        if (!wrap) return;

        const now = new Date();
        const thisMonth = now.getMonth();

        const list = anggotaData
            .filter(function (a) { return a.tanggalLahir && new Date(a.tanggalLahir).getMonth() === thisMonth; })
            .sort(function (a, b) { return new Date(a.tanggalLahir).getDate() - new Date(b.tanggalLahir).getDate(); });

        if (list.length === 0) {
            wrap.innerHTML = '<div class="da-birthday-empty"><i class="fas fa-cake-candles"></i> Belum ada anggota yang berulang tahun bulan ini.</div>';
            return;
        }

        wrap.innerHTML = list.map(function (a) {
            const d = new Date(a.tanggalLahir);
            const tgl = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
            return (
                '<div class="da-birthday-card" data-nama="' + a.namaLengkap + '">' +
                    photoOrInitials(a, '') +
                    '<div><div class="da-birthday-name">' + a.namaLengkap + '</div><div class="da-birthday-date"><i class="fas fa-cake-candles"></i> ' + tgl + '</div></div>' +
                '</div>'
            );
        }).join('');

        wrap.querySelectorAll('.da-birthday-card').forEach(function (card) {
            card.addEventListener('click', function () {
                const a = anggotaData.find(function (x) { return x.namaLengkap === card.dataset.nama; });
                if (a) openMemberModal(a);
            });
        });
    }

    // ============================================================
    // 📤 EXPORT CSV & 🖨️ PRINT
    // ============================================================
    function exportCsv() {
        const filtered = sortData(getFiltered()).map(function (item) { return item.a; });
        const headers = ['No', 'Nama Lengkap', 'Nama Lapangan', 'NIM', 'Angkatan', 'Divisi', 'Jabatan', 'Status', 'Tanggal Bergabung', 'Jumlah Kegiatan'];
        const rows = filtered.map(function (a, i) {
            return [
                i + 1, a.namaLengkap, a.namaLapangan, a.nim,
                angkatanLabel(a.angkatan).replace(/^[^ ]+\s/, ''),
                divisiLabel(a.divisi).replace(/^[^ ]+\s/, ''),
                a.jabatan, a.status, a.tanggalBergabung, a.jumlahKegiatan
            ];
        });

        function esc(v) {
            const s = String(v == null ? '' : v);
            return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        }

        const csv = [headers, ...rows].map(function (r) { return r.map(esc).join(','); }).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data-anggota-mapatek.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        trackEvent('export_csv', { jumlah: filtered.length });
    }

    const exportBtn = document.getElementById('daExportBtn');
    const printBtn = document.getElementById('daPrintBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportCsv);
    if (printBtn) printBtn.addEventListener('click', function () {
        trackEvent('print_page', {});
        window.print();
    });

    // ============================================================
    // 📊 ANALYTICS EVENT TRACKING (diam kalau GA/Plausible belum dipasang)
    // ============================================================
    function trackEvent(name, params) {
        params = params || {};
        try {
            if (typeof window.gtag === 'function') window.gtag('event', name, params);
            if (typeof window.plausible === 'function') window.plausible(name, { props: params });
        } catch (err) { /* diamkan */ }
    }

    // ============================================================
    // SEARCH
    // ============================================================
    searchInput.addEventListener('input', function () {
        searchTerm = searchInput.value.toLowerCase().trim();
        render();
    });

    // ============================================================
    // INIT — tunggu data siap (fallback ATAU Google Sheets)
    // ============================================================
    async function init() {
        if (typeof MAPATEK_ANGGOTA_READY !== 'undefined') {
            await MAPATEK_ANGGOTA_READY;
        }
        buildStats();
        buildChips();
        initSorting();
        render();
        buildOrgChart();
        buildIdCardSection();
        buildBirthdayWidget();
    }

    init();
})();