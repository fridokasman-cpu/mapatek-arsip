(function () {
    'use strict';

    const tableBody = document.getElementById('daTableBody');
    const cardsWrap = document.getElementById('daCards');
    const emptyMsg = document.getElementById('daEmpty');
    const searchInput = document.getElementById('daSearch');
    const chipsWrap = document.getElementById('daFilterChips');
    const statsWrap = document.getElementById('daStats');

    let activeFilter = 'all';
    let searchTerm = '';

    function toWaLink(noHp) {
        const digits = noHp.replace(/\D/g, '');
        const wa = digits.startsWith('0') ? '62' + digits.slice(1) : digits;
        return 'https://wa.me/' + wa;
    }

    function angkatanLabel(key) {
        const found = ANGKATAN_LIST_DA.find(function (a) { return a.key === key; });
        return found ? found.label : key;
    }

    function buildStats() {
        const total = anggotaData.length;
        const perAngkatan = {};
        anggotaData.forEach(function (a) {
            perAngkatan[a.angkatan] = (perAngkatan[a.angkatan] || 0) + 1;
        });

        let html = '<div class="da-stat-card da-stat-total"><span class="da-stat-num">' + total + '</span><span class="da-stat-label">Total Anggota</span></div>';

        ANGKATAN_LIST_DA.filter(function (a) { return a.key !== 'all'; }).forEach(function (a) {
            const count = perAngkatan[a.key] || 0;
            html += '<div class="da-stat-card"><span class="da-stat-num">' + count + '</span><span class="da-stat-label">' + a.label + '</span></div>';
        });

        statsWrap.innerHTML = html;
    }

    function buildChips() {
        ANGKATAN_LIST_DA.forEach(function (item) {
            const chip = document.createElement('button');
            chip.className = 'da-chip' + (item.key === 'all' ? ' da-chip-active' : '');
            chip.textContent = item.label;
            chip.addEventListener('click', function () {
                activeFilter = item.key;
                document.querySelectorAll('.da-chip').forEach(function (c) {
                    c.classList.toggle('da-chip-active', c === chip);
                });
                render();
            });
            chipsWrap.appendChild(chip);
        });
    }

    function render() {
        const filtered = anggotaData
            .map(function (a, i) { return { a: a, no: i + 1 }; })
            .filter(function (item) {
                const a = item.a;
                const matchFilter = activeFilter === 'all' || a.angkatan === activeFilter;
                const haystack = (a.namaLengkap + ' ' + a.nim + ' ' + a.namaLapangan).toLowerCase();
                const matchSearch = haystack.includes(searchTerm);
                return matchFilter && matchSearch;
            });

        emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

        // Tabel (desktop)
        tableBody.innerHTML = filtered.map(function (item) {
            const a = item.a;
            return (
                '<tr>' +
                    '<td>' + item.no + '</td>' +
                    '<td><span class="da-badge">' + angkatanLabel(a.angkatan).replace(/^[^ ]+\s/, '') + '</span></td>' +
                    '<td class="da-cell-name">' + a.namaLengkap + '</td>' +
                    '<td>' + a.namaLapangan + '</td>' +
                    '<td>' + a.nim + '</td>' +
                    '<td>' + a.bidang + '</td>' +
                    '<td><a href="' + toWaLink(a.noHp) + '" target="_blank" class="da-wa-btn" aria-label="Chat WhatsApp ' + a.namaLengkap + '"><i class="fab fa-whatsapp"></i></a></td>' +
                '</tr>'
            );
        }).join('');

        // Kartu (mobile)
        cardsWrap.innerHTML = filtered.map(function (item) {
            const a = item.a;
            return (
                '<div class="da-card">' +
                    '<div class="da-card-head">' +
                        '<span class="da-badge">' + angkatanLabel(a.angkatan).replace(/^[^ ]+\s/, '') + '</span>' +
                        '<a href="' + toWaLink(a.noHp) + '" target="_blank" class="da-wa-btn" aria-label="Chat WhatsApp ' + a.namaLengkap + '"><i class="fab fa-whatsapp"></i></a>' +
                    '</div>' +
                    '<h4>' + a.namaLengkap + '</h4>' +
                    '<div class="da-card-row"><span>Nama Lapangan</span><strong>' + a.namaLapangan + '</strong></div>' +
                    '<div class="da-card-row"><span>NIM</span><strong>' + a.nim + '</strong></div>' +
                    '<div class="da-card-row"><span>Bidang</span><strong>' + a.bidang + '</strong></div>' +
                '</div>'
            );
        }).join('');
    }

    searchInput.addEventListener('input', function () {
        searchTerm = searchInput.value.toLowerCase().trim();
        render();
    });

    buildStats();
    buildChips();
    render();
})();
