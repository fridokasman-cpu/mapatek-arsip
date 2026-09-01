(function () {
    'use strict';

    function formatRupiah(num) {
        return 'Rp' + num.toLocaleString('id-ID');
    }

    function trackEvent(name, params) {
        params = params || {};
        try {
            if (typeof window.gtag === 'function') window.gtag('event', name, params);
            if (typeof window.plausible === 'function') window.plausible(name, { props: params });
        } catch (err) { /* diamkan */ }
    }

    // ============================================================
    // 📊 FITUR 3: DASHBOARD TOTAL DAMPAK DONASI
    // ============================================================
    function animateCount(el, target, duration) {
        const start = 0;
        const startTime = performance.now();
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(start + (target - start) * eased);
            el.textContent = value.toLocaleString('id-ID');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function buildImpactDashboard() {
        const wrap = document.getElementById('impactGrid');
        if (!wrap) return;

        const totalTerkumpul = campaignData.reduce(function (sum, c) { return sum + c.terkumpul; }, 0);
        const campaignAktif = campaignData.filter(function (c) {
            return !c.deadline || new Date(c.deadline) >= new Date();
        }).length;
        const totalProduk = merchData.length;

        wrap.innerHTML =
            '<div class="mp-impact-card mp-impact-hero"><span class="mp-impact-num" id="impactTerkumpul">0</span><span class="mp-impact-label">Total Dana Terkumpul (Rp)</span></div>' +
            '<div class="mp-impact-card"><span class="mp-impact-num" id="impactCampaign">0</span><span class="mp-impact-label">Campaign Aktif</span></div>' +
            '<div class="mp-impact-card"><span class="mp-impact-num" id="impactProduk">0</span><span class="mp-impact-label">Produk Tersedia</span></div>' +
            '<div class="mp-impact-card"><span class="mp-impact-num" id="impactDonatur">0</span><span class="mp-impact-label">Donatur Tercatat</span></div>';

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(document.getElementById('impactTerkumpul'), totalTerkumpul, 1400);
                    animateCount(document.getElementById('impactCampaign'), campaignAktif, 900);
                    animateCount(document.getElementById('impactProduk'), totalProduk, 900);
                    animateCount(document.getElementById('impactDonatur'), donaturData.length, 1100);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(wrap);
    }

    // ============================================================
    // ⏳ FITUR 5: COUNTDOWN DEADLINE CAMPAIGN
    // ============================================================
    function countdownBadge(deadline) {
        if (!deadline) return '';
        const now = new Date();
        const end = new Date(deadline);
        const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return '<span class="mp-countdown-badge mp-countdown-closed"><i class="fas fa-lock"></i> Ditutup</span>';
        }
        if (diffDays === 0) {
            return '<span class="mp-countdown-badge mp-countdown-urgent"><i class="fas fa-clock"></i> Hari terakhir!</span>';
        }
        const urgentClass = diffDays <= 7 ? ' mp-countdown-urgent' : '';
        return '<span class="mp-countdown-badge' + urgentClass + '"><i class="fas fa-clock"></i> ' + diffDays + ' hari lagi</span>';
    }

    // ============================================================
    // 📣 FITUR 10: SHARE CAMPAIGN
    // ============================================================
    function shareCampaign(c) {
        const url = window.location.href.split('#')[0] + '#' + c.id;
        const text = 'Yuk bantu donasi untuk "' + c.judul + '" di Mapatek Abhipraya: ' + url;

        if (navigator.share) {
            navigator.share({ title: c.judul, text: text, url: url }).catch(function () {});
            trackEvent('share_campaign', { campaign: c.judul, method: 'native' });
            return;
        }

        // Fallback: buka WhatsApp share + salin link
        navigator.clipboard && navigator.clipboard.writeText(url).catch(function () {});
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        trackEvent('share_campaign', { campaign: c.judul, method: 'whatsapp_fallback' });
    }

    // ============================================================
    // CAMPAIGN DONASI (+ countdown + share)
    // ============================================================
    const campaignGrid = document.getElementById('campaignGrid');

    if (campaignGrid) {
        campaignGrid.innerHTML = campaignData.map(function (c) {
            return (
                '<div class="mp-campaign-card" id="' + c.id + '">' +
                    '<div class="mp-campaign-image" style="background-image:url(\'' + c.gambar + '\')">' +
                        countdownBadge(c.deadline) +
                    '</div>' +
                    '<div class="mp-campaign-body">' +
                        '<h3>' + c.judul + '</h3>' +
                        '<p>' + c.deskripsi + '</p>' +
                        '<div class="mp-progress-track">' +
                            '<div class="mp-progress-fill" data-percent="' + Math.min(100, Math.round((c.terkumpul / c.target) * 100)) + '" style="width:0%"></div>' +
                        '</div>' +
                        '<div class="mp-progress-stats">' +
                            '<span><strong>' + formatRupiah(c.terkumpul) + '</strong> terkumpul</span>' +
                            '<span>' + Math.min(100, Math.round((c.terkumpul / c.target) * 100)) + '%</span>' +
                        '</div>' +
                        '<div class="mp-progress-target">Target: ' + formatRupiah(c.target) + '</div>' +
                        '<div class="mp-campaign-actions">' +
                            '<a class="mp-btn mp-btn-donate" target="_blank" href="https://wa.me/' + WA_ADMIN_NUMBER +
                                '?text=' + encodeURIComponent('Halo Mapatek, saya ingin donasi untuk campaign "' + c.judul + '".') + '">' +
                                '<i class="fas fa-hand-holding-heart"></i> Donasi' +
                            '</a>' +
                            '<button class="mp-btn mp-btn-share" data-id="' + c.id + '" aria-label="Bagikan campaign"><i class="fas fa-share-nodes"></i></button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }).join('');

        campaignGrid.querySelectorAll('.mp-btn-share').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const c = campaignData.find(function (x) { return x.id === btn.dataset.id; });
                if (c) shareCampaign(c);
            });
        });

        const progressBars = document.querySelectorAll('.mp-progress-fill');
        const progressObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.width = el.dataset.percent + '%';
                    progressObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });
        progressBars.forEach(function (bar) { progressObserver.observe(bar); });
    }

    // ============================================================
    // 💰 FITUR 4: TOMBOL DONASI CEPAT
    // ============================================================
    function buildQuickDonate() {
        const wrap = document.getElementById('quickDonateAmounts');
        const customInput = document.getElementById('quickDonateCustom');
        const goBtn = document.getElementById('quickDonateBtn');
        if (!wrap || !goBtn) return;

        let selectedAmount = donationTiers[0];

        wrap.innerHTML = donationTiers.map(function (amount, i) {
            return '<button class="mp-amount-btn' + (i === 0 ? ' mp-amount-active' : '') + '" data-amount="' + amount + '">' + formatRupiah(amount) + '</button>';
        }).join('');

        wrap.querySelectorAll('.mp-amount-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                selectedAmount = parseInt(btn.dataset.amount, 10);
                if (customInput) customInput.value = '';
                wrap.querySelectorAll('.mp-amount-btn').forEach(function (b) { b.classList.toggle('mp-amount-active', b === btn); });
            });
        });

        if (customInput) {
            customInput.addEventListener('input', function () {
                const val = parseInt(customInput.value.replace(/\D/g, ''), 10);
                if (val > 0) {
                    selectedAmount = val;
                    wrap.querySelectorAll('.mp-amount-btn').forEach(function (b) { b.classList.remove('mp-amount-active'); });
                }
            });
        }

        goBtn.addEventListener('click', function () {
            const text = 'Halo Mapatek, saya ingin donasi sebesar ' + formatRupiah(selectedAmount) + '. Mohon info rekening/QRIS ya.';
            trackEvent('quick_donate_click', { nominal: selectedAmount });
            window.open('https://wa.me/' + WA_ADMIN_NUMBER + '?text=' + encodeURIComponent(text), '_blank');
        });
    }

    // ============================================================
    // 🏆 FITUR 7: WALL OF FAME DONATUR
    // ============================================================
    function donorTier(jumlah) {
        if (jumlah >= 500000) return { key: 'gold', label: 'Gold Supporter' };
        if (jumlah >= 100000) return { key: 'silver', label: 'Silver Supporter' };
        return { key: 'bronze', label: 'Bronze Supporter' };
    }

    function donorInitials(name) {
        return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    }

    function buildDonorWall() {
        const wrap = document.getElementById('donorWall');
        if (!wrap || !donaturData || donaturData.length === 0) return;

        const sorted = donaturData.slice().sort(function (a, b) { return b.jumlah - a.jumlah; });

        wrap.innerHTML = sorted.map(function (d) {
            const tier = donorTier(d.jumlah);
            return (
                '<div class="mp-donor-card">' +
                    '<div class="mp-donor-avatar tier-' + tier.key + '">' + donorInitials(d.nama) + '</div>' +
                    '<div class="mp-donor-name">' + d.nama + '</div>' +
                    '<span class="mp-donor-tier tier-' + tier.key + '">' + tier.label + '</span>' +
                '</div>'
            );
        }).join('');
    }

    // ============================================================
    // 📸 FITUR 9: GALERI DAMPAK EKSPEDISI (coverflow 3D)
    // ============================================================
    let dampakIndex = 0;

    function buildDampakGallery() {
        const stage = document.getElementById('dampakStage');
        const counter = document.getElementById('dampakCounter');
        const prevBtn = document.getElementById('dampakPrev');
        const nextBtn = document.getElementById('dampakNext');
        if (!stage || !dampakGaleri || dampakGaleri.length === 0) return;

        stage.innerHTML = dampakGaleri.map(function (item, i) {
            return (
                '<div class="mp-dampak-item" data-i="' + i + '">' +
                    '<img src="' + item.gambar + '" alt="' + item.caption + '">' +
                    '<div class="mp-dampak-item-caption">' + item.caption + '</div>' +
                '</div>'
            );
        }).join('');

        function update() {
            const items = stage.querySelectorAll('.mp-dampak-item');
            items.forEach(function (item, i) {
                const offset = i - dampakIndex;
                const abs = Math.abs(offset);
                item.classList.toggle('mp-dampak-active', offset === 0);
                let transform, opacity, z;
                if (abs === 0) { transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)'; opacity = 1; z = 10; }
                else if (abs <= 2) { transform = 'translateX(' + (offset * 62) + '%) translateZ(-160px) rotateY(' + (offset > 0 ? -35 : 35) + 'deg) scale(0.82)'; opacity = 0.55; z = 10 - abs; }
                else { transform = 'translateX(' + (offset > 0 ? 140 : -140) + '%) translateZ(-260px) scale(0.6)'; opacity = 0; z = 0; }
                item.style.transform = transform;
                item.style.opacity = opacity;
                item.style.zIndex = z;
            });
            if (counter) counter.textContent = (dampakIndex + 1) + ' / ' + dampakGaleri.length;
        }

        stage.querySelectorAll('.mp-dampak-item').forEach(function (item) {
            item.addEventListener('click', function () {
                dampakIndex = parseInt(item.dataset.i, 10);
                update();
            });
        });

        if (prevBtn) prevBtn.addEventListener('click', function () {
            dampakIndex = (dampakIndex - 1 + dampakGaleri.length) % dampakGaleri.length;
            update();
        });
        if (nextBtn) nextBtn.addEventListener('click', function () {
            dampakIndex = (dampakIndex + 1) % dampakGaleri.length;
            update();
        });

        update();
    }

    // ============================================================
    // ❓ FAQ ACCORDION (info tambahan)
    // ============================================================
    function buildFaq() {
        const wrap = document.getElementById('faqList');
        if (!wrap || !faqData) return;

        wrap.innerHTML = faqData.map(function (item, i) {
            return (
                '<div class="mp-faq-item" data-i="' + i + '">' +
                    '<button class="mp-faq-question">' + item.q + ' <i class="fas fa-chevron-down"></i></button>' +
                    '<div class="mp-faq-answer"><p>' + item.a + '</p></div>' +
                '</div>'
            );
        }).join('');

        wrap.querySelectorAll('.mp-faq-item').forEach(function (item) {
            const question = item.querySelector('.mp-faq-question');
            const answer = item.querySelector('.mp-faq-answer');
            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('mp-faq-open');
                wrap.querySelectorAll('.mp-faq-item').forEach(function (other) {
                    other.classList.remove('mp-faq-open');
                    other.querySelector('.mp-faq-answer').style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('mp-faq-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // ============================================================
    // 🛒 FITUR 1: KERANJANG BELANJA MULTI-PRODUK (tanpa localStorage —
    // hanya disimpan di memori selama halaman terbuka)
    // ============================================================
    let cart = []; // { nama, harga, varian, qty }

    const cartBtn = document.getElementById('cartBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartModal = document.getElementById('cartModal');
    const cartModalContent = document.getElementById('cartModalContent');

    function cartKey(nama, varian) { return nama + '|' + (varian || ''); }

    function addToCart(nama, harga, varian) {
        const key = cartKey(nama, varian);
        const existing = cart.find(function (item) { return cartKey(item.nama, item.varian) === key; });
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ nama: nama, harga: harga, varian: varian || '', qty: 1 });
        }
        updateCartBadge();
        trackEvent('add_to_cart', { produk: nama, varian: varian || '' });
    }

    function updateCartBadge() {
        if (!cartBadge) return;
        const totalQty = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
        cartBadge.textContent = totalQty;
        cartBadge.classList.toggle('mp-hidden', totalQty === 0);
    }

    function renderCartModal() {
        if (!cartModalContent) return;

        if (cart.length === 0) {
            cartModalContent.innerHTML =
                '<button class="mp-modal-close" id="cartCloseBtn"><i class="fas fa-times"></i></button>' +
                '<h3><i class="fas fa-cart-shopping"></i> Keranjang</h3>' +
                '<div class="mp-cart-empty"><i class="fas fa-cart-shopping"></i>Keranjang masih kosong.<br>Yuk pilih merchandise dulu!</div>';
            document.getElementById('cartCloseBtn').addEventListener('click', closeCartModal);
            return;
        }

        const total = cart.reduce(function (sum, item) { return sum + item.harga * item.qty; }, 0);

        cartModalContent.innerHTML =
            '<button class="mp-modal-close" id="cartCloseBtn"><i class="fas fa-times"></i></button>' +
            '<h3><i class="fas fa-cart-shopping"></i> Keranjang (' + cart.length + ' item)</h3>' +
            cart.map(function (item, i) {
                return (
                    '<div class="mp-cart-item">' +
                        '<div class="mp-cart-item-info">' +
                            '<div class="mp-cart-item-name">' + item.nama + '</div>' +
                            '<div class="mp-cart-item-sub">' + (item.varian ? 'Ukuran ' + item.varian + ' &middot; ' : '') + formatRupiah(item.harga) + '</div>' +
                        '</div>' +
                        '<div class="mp-cart-item-qty">' +
                            '<button data-i="' + i + '" data-act="dec">-</button>' +
                            '<span>' + item.qty + '</span>' +
                            '<button data-i="' + i + '" data-act="inc">+</button>' +
                        '</div>' +
                        '<button class="mp-cart-item-remove" data-i="' + i + '" data-act="remove"><i class="fas fa-trash"></i></button>' +
                    '</div>'
                );
            }).join('') +
            '<div class="mp-cart-total"><span>Total</span><strong>' + formatRupiah(total) + '</strong></div>' +
            '<a class="mp-btn mp-btn-whatsapp" id="cartCheckoutBtn" target="_blank"><i class="fab fa-whatsapp"></i> Checkout via WhatsApp</a>';

        document.getElementById('cartCloseBtn').addEventListener('click', closeCartModal);

        cartModalContent.querySelectorAll('[data-act="inc"]').forEach(function (btn) {
            btn.addEventListener('click', function () { cart[parseInt(btn.dataset.i, 10)].qty += 1; updateCartBadge(); renderCartModal(); });
        });
        cartModalContent.querySelectorAll('[data-act="dec"]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const idx = parseInt(btn.dataset.i, 10);
                cart[idx].qty -= 1;
                if (cart[idx].qty <= 0) cart.splice(idx, 1);
                updateCartBadge(); renderCartModal();
            });
        });
        cartModalContent.querySelectorAll('[data-act="remove"]').forEach(function (btn) {
            btn.addEventListener('click', function () { cart.splice(parseInt(btn.dataset.i, 10), 1); updateCartBadge(); renderCartModal(); });
        });

        const checkoutBtn = document.getElementById('cartCheckoutBtn');
        let text = 'Halo Mapatek, saya ingin memesan:\n';
        cart.forEach(function (item) {
            text += '- ' + item.nama + (item.varian ? ' (ukuran ' + item.varian + ')' : '') + ' x' + item.qty + ' = ' + formatRupiah(item.harga * item.qty) + '\n';
        });
        text += 'Total: ' + formatRupiah(total) + '. Apakah semua tersedia?';
        checkoutBtn.href = 'https://wa.me/' + WA_ADMIN_NUMBER + '?text=' + encodeURIComponent(text);
        checkoutBtn.addEventListener('click', function () { trackEvent('checkout_cart', { total: total, items: cart.length }); });
    }

    function openCartModal() {
        renderCartModal();
        cartModal.classList.add('mp-modal-active');
        document.body.style.overflow = 'hidden';
    }
    function closeCartModal() {
        cartModal.classList.remove('mp-modal-active');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCartModal);
    if (cartModal) cartModal.addEventListener('click', function (e) { if (e.target === cartModal) closeCartModal(); });

    // ============================================================
    // MERCHANDISE (+ 3D tilt, search, stok badge, tombol +cart)
    // ============================================================
    const productGrid = document.getElementById('productGrid');
    const chipsWrap = document.getElementById('merchFilterChips');
    const searchInput = document.getElementById('merchSearch');
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('productModalContent');

    let activeCategory = 'all';
    let searchTerm = '';

    function buildChips() {
        if (!chipsWrap) return;
        merchCategories.forEach(function (cat) {
            const chip = document.createElement('button');
            chip.className = 'mp-chip' + (cat.key === 'all' ? ' mp-chip-active' : '');
            chip.textContent = cat.label;
            chip.addEventListener('click', function () {
                activeCategory = cat.key;
                chipsWrap.querySelectorAll('.mp-chip').forEach(function (c) {
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

        const stokBadge = (p.stok != null && p.stok <= 5) ? '<span class="mp-stock-badge">Sisa ' + p.stok + '</span>' : '';

        return (
            '<div class="mp-product-card" data-index="' + index + '">' +
                stokBadge +
                imgHtml +
                '<div class="mp-product-body">' +
                    '<h4>' + p.nama + '</h4>' +
                    '<span class="mp-product-price">' + formatRupiah(p.harga) + '</span>' +
                    '<div class="mp-product-actions">' +
                        '<button class="mp-btn mp-btn-detail" data-index="' + index + '" data-act="detail">Detail</button>' +
                        '<button class="mp-btn mp-btn-cart mp-btn-add-cart" data-index="' + index + '" data-act="cart" aria-label="Tambah ke keranjang"><i class="fas fa-cart-plus"></i></button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function renderProducts() {
        if (!productGrid) return;
        const filtered = merchData
            .map(function (p, i) { return { p: p, i: i }; })
            .filter(function (item) {
                const matchCat = activeCategory === 'all' || item.p.kategori === activeCategory;
                const matchSearch = item.p.nama.toLowerCase().includes(searchTerm);
                return matchCat && matchSearch;
            });

        productGrid.innerHTML = filtered.length
            ? filtered.map(function (item) { return productCardHtml(item.p, item.i); }).join('')
            : '<div class="mp-cart-empty" style="grid-column:1/-1"><i class="fas fa-magnifying-glass"></i>Produk tidak ditemukan.</div>';

        productGrid.querySelectorAll('[data-act="detail"]').forEach(function (btn) {
            btn.addEventListener('click', function () { openProductModal(merchData[parseInt(btn.dataset.index, 10)]); });
        });
        productGrid.querySelectorAll('[data-act="cart"]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const p = merchData[parseInt(btn.dataset.index, 10)];
                addToCart(p.nama, p.harga, p.varian.length ? p.varian[0] : '');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(function () { btn.innerHTML = '<i class="fas fa-cart-plus"></i>'; }, 900);
            });
        });

        initProductTilt();
    }

    // FITUR 2: kartu produk 3D tilt mengikuti mouse
    function initProductTilt() {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (isTouchDevice || !productGrid) return;

        productGrid.querySelectorAll('.mp-product-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y / rect.height) - 0.5) * -10;
                const rotateY = ((x / rect.width) - 0.5) * 10;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            searchTerm = searchInput.value.toLowerCase().trim();
            renderProducts();
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
            '<div class="mp-modal-actions">' +
                '<button class="mp-btn mp-btn-cart" id="modalAddCartBtn"><i class="fas fa-cart-plus"></i> + Keranjang</button>' +
                '<a class="mp-btn mp-btn-whatsapp mp-modal-order" id="modalOrderBtn" target="_blank"><i class="fab fa-whatsapp"></i> Pesan</a>' +
            '</div>';

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

        document.getElementById('modalAddCartBtn').addEventListener('click', function () {
            addToCart(p.nama, p.harga, selectedVariant);
            const btn = document.getElementById('modalAddCartBtn');
            btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
            setTimeout(function () { btn.innerHTML = '<i class="fas fa-cart-plus"></i> + Keranjang'; }, 1000);
        });

        document.getElementById('modalCloseBtn').addEventListener('click', closeProductModal);
        modal.classList.add('mp-modal-active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        modal.classList.remove('mp-modal-active');
        document.body.style.overflow = '';
    }

    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeProductModal(); });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeProductModal(); if (cartModal) closeCartModal(); }
    });

    // ============================================================
    // INIT
    // ============================================================
    buildImpactDashboard();
    buildChips();
    renderProducts();
    buildQuickDonate();
    buildDonorWall();
    buildDampakGallery();
    buildFaq();
    updateCartBadge();
})();