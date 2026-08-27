(function () {
    'use strict';

    const grid = document.getElementById('alumniGrid');
    const emptyMsg = document.getElementById('alumniEmpty');
    const searchInput = document.getElementById('alumniSearch');
    const chipsWrap = document.getElementById('alumniFilterChips');

    let activeFilter = 'all';
    let searchTerm = '';

    function buildChips() {
        ANGKATAN_LIST.forEach(function (item) {
            const chip = document.createElement('button');
            chip.className = 'ap-chip' + (item.key === 'all' ? ' ap-chip-active' : '');
            chip.textContent = item.label;
            chip.dataset.key = item.key;
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

    function initials(name) {
        return name.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    function angkatanLabel(key) {
        const found = ANGKATAN_LIST.find(function (a) { return a.key === key; });
        return found ? found.label.replace(/^[^ ]+\s/, '') : key;
    }

    function render() {
        const filtered = alumniData.filter(function (a) {
            const matchFilter = activeFilter === 'all' || a.angkatan === activeFilter;
            const matchSearch = a.nama.toLowerCase().includes(searchTerm) ||
                                 a.profesiSekarang.toLowerCase().includes(searchTerm);
            return matchFilter && matchSearch;
        });

        emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

        grid.innerHTML = filtered.map(function (a) {
            const photoHtml = a.foto
                ? '<img src="' + a.foto + '" alt="' + a.nama + '" class="ap-card-photo" onerror="this.replaceWith(document.createElement(\'span\'))">'
                : '<div class="ap-card-photo ap-card-initials">' + initials(a.nama) + '</div>';

            const social = [];
            if (a.instagram) social.push('<a href="' + a.instagram + '" target="_blank" rel="noopener" aria-label="Instagram ' + a.nama + '"><i class="fab fa-instagram"></i></a>');
            if (a.linkedin) social.push('<a href="' + a.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn ' + a.nama + '"><i class="fab fa-linkedin"></i></a>');

            return (
                '<article class="ap-card">' +
                    '<div class="ap-card-top">' +
                        photoHtml +
                        '<div>' +
                            '<h3 class="ap-card-name">' + a.nama + '</h3>' +
                            '<span class="ap-card-batch">' + angkatanLabel(a.angkatan) + (a.tahunLulus ? ' &bull; Lulus ' + a.tahunLulus : ' &bull; Masih Aktif') + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ap-card-role">' +
                        '<i class="fas fa-briefcase"></i>' +
                        '<div><strong>' + a.profesiSekarang + '</strong><span>' + a.lokasi + '</span></div>' +
                    '</div>' +
                    '<blockquote class="ap-card-quote"><i class="fas fa-quote-left"></i> ' + a.testimoni + '</blockquote>' +
                    (social.length ? '<div class="ap-card-social">' + social.join('') + '</div>' : '') +
                '</article>'
            );
        }).join('');
    }

    searchInput.addEventListener('input', function () {
        searchTerm = searchInput.value.toLowerCase().trim();
        render();
    });

    buildChips();
    render();
})();
