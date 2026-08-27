(function () {
    'use strict';

    function formatRupiah(num) {
        return 'Rp' + num.toLocaleString('id-ID');
    }

    // ============================================================
    // CAMPAIGN DONASI
    // ============================================================
    const campaignGrid = document.getElementById('campaignGrid');

    campaignGrid.innerHTML = campaignData.map(function (c, i) {
        const percent = Math.min(100, Math.round((c.terkumpul / c.target) * 100));
        return (
            '<div class="mp-campaign-card">' +
                '<div class="mp-campaign-image" style="background-image:url(\'' + c.gambar + '\')"></div>' +
                '<div class="mp-campaign-body">' +
                    '<h3>' + c.judul + '</h3>' +
                    '<p>' + c.deskripsi + '</p>' +
                    '<div class="mp-progress-track">' +
                        '<div class="mp-progress-fill" data-percent="' + percent + '" style="width:0%"></div>' +
                    '</div>' +
                    '<div class="mp-progress-stats">' +
                        '<span><strong>' + formatRupiah(c.terkumpul) + '</strong> terkumpul</span>' +
                        '<span>' + percent + '%</span>' +
                    '</div>' +
                    '<div class="mp-progress-target">Target: ' + formatRupiah(c.target) + '</div>' +
                    '<a class="mp-btn mp-btn-donate" target="_blank" href="https://wa.me/' + WA_ADMIN_NUMBER +
                        '?text=' + encodeURIComponent('Halo Mapatek, saya ingin donasi untuk campaign "' + c.judul + '".') + '">' +
                        '<i class="fas fa-hand-holding-heart"></i> Donasi Sekarang' +
                    '</a>' +
                '</div>' +
            '</div>'
        );
    }).join('');

    // Animasi progress bar saat elemen terlihat di layar
    const progressBars = document.querySelectorAll('.mp-progress-fill');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.width = el.dataset.percent + '%';
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });
    progressBars.forEach(function (bar) { observer.observe(bar); });

    // ============================================================
    // MERCHANDISE
    // ============================================================
    const productGrid = document.getElementById('productGrid');
    const chipsWrap = document.getElementById('merchFilterChips');
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('productModalContent');

    let activeCategory = 'all';

    function buildChips() {
        merchCategories.forEach(function (cat) {
            const chip = document.createElement('button');
            chip.className = 'mp-chip' + (cat.key === 'all' ? ' mp-chip-active' : '');
            chip.textContent = cat.label;
            chip.addEventListener('click', function () {
                activeCategory = cat.key;
                document.querySelectorAll('.mp-chip').forEach(function (c) {
                    c.classList.toggle('mp-chip-active', c === chip);
                });
                renderProducts();
            });
            chipsWrap.appendChild(chip);
        });
    }

    function productCardHtml(p, index) {
        const imgHtml = p.gambar
            ? '<img src="' + p.gambar + '" alt="' + p.nama + '" class="mp-product-img">'
            : '<div class="mp-product-img mp-product-img-placeholder"><i class="fas fa-image"></i></div>';

        return (
            '<div class="mp-product-card" data-index="' + index + '">' +
                imgHtml +
                '<div class="mp-product-body">' +
                    '<h4>' + p.nama + '</h4>' +
                    '<span class="mp-product-price">' + formatRupiah(p.harga) + '</span>' +
                    '<button class="mp-btn mp-btn-detail" data-index="' + index + '">Lihat Detail</button>' +
                '</div>' +
            '</div>'
        );
    }

    function renderProducts() {
        const filtered = merchData
            .map(function (p, i) { return { p: p, i: i }; })
            .filter(function (item) { return activeCategory === 'all' || item.p.kategori === activeCategory; });

        productGrid.innerHTML = filtered.map(function (item) {
            return productCardHtml(item.p, item.i);
        }).join('');

        productGrid.querySelectorAll('.mp-btn-detail').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openProductModal(merchData[parseInt(btn.dataset.index, 10)]);
            });
        });
    }

    function openProductModal(p) {
        const varianHtml = p.varian.length
            ? '<div class="mp-modal-variants"><span>Pilih ukuran:</span>' +
                p.varian.map(function (v) { return '<button class="mp-variant-btn">' + v + '</button>'; }).join('') +
              '</div>'
            : '';

        let selectedVariant = p.varian.length ? p.varian[0] : null;

        modalContent.innerHTML =
            '<button class="mp-modal-close" id="modalCloseBtn"><i class="fas fa-times"></i></button>' +
            (p.gambar
                ? '<img src="' + p.gambar + '" class="mp-modal-img" alt="' + p.nama + '">'
                : '<div class="mp-modal-img mp-product-img-placeholder"><i class="fas fa-image"></i></div>') +
            '<h3>' + p.nama + '</h3>' +
            '<span class="mp-modal-price">' + formatRupiah(p.harga) + '</span>' +
            '<p class="mp-modal-desc">' + p.deskripsi + '</p>' +
            varianHtml +
            '<a class="mp-btn mp-btn-whatsapp mp-modal-order" id="modalOrderBtn" target="_blank">' +
                '<i class="fab fa-whatsapp"></i> Pesan via WhatsApp' +
            '</a>';

        function buildOrderLink() {
            let text = 'Halo Mapatek, saya ingin memesan "' + p.nama + '"';
            if (selectedVariant) text += ' ukuran ' + selectedVariant;
            text += '. Apakah masih tersedia?';
            return 'https://wa.me/' + WA_ADMIN_NUMBER + '?text=' + encodeURIComponent(text);
        }

        document.getElementById('modalOrderBtn').href = buildOrderLink();

        modalContent.querySelectorAll('.mp-variant-btn').forEach(function (btn, idx) {
            if (idx === 0) btn.classList.add('mp-variant-active');
            btn.addEventListener('click', function () {
                selectedVariant = btn.textContent;
                modalContent.querySelectorAll('.mp-variant-btn').forEach(function (b) {
                    b.classList.toggle('mp-variant-active', b === btn);
                });
                document.getElementById('modalOrderBtn').href = buildOrderLink();
            });
        });

        document.getElementById('modalCloseBtn').addEventListener('click', closeProductModal);
        modal.classList.add('mp-modal-active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        modal.classList.remove('mp-modal-active');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeProductModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeProductModal();
    });

    buildChips();
    renderProducts();
})();
