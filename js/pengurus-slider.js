(function () {
    'use strict';

    function initPengurus3D() {
        const stage = document.getElementById('p3dStage');
        const track = document.getElementById('p3dTrack');
        const prevBtn = document.getElementById('p3dPrev');
        const nextBtn = document.getElementById('p3dNext');
        const dotsWrap = document.getElementById('p3dDots');

        if (!stage || !track) return;

        const cards = Array.from(track.querySelectorAll('.p3d-card'));
        const total = cards.length;
        let active = 0;
        let autoplayTimer = null;
        let zoomedCard = null;

        // Bangun dot indikator
        cards.forEach(function (_, i) {
            const dot = document.createElement('button');
            dot.className = 'p3d-dot';
            dot.setAttribute('aria-label', 'Ke pengurus nomor ' + (i + 1));
            dot.addEventListener('click', function () {
                if (zoomedCard) return;
                setActive(i);
                restartAutoplay();
            });
            dotsWrap.appendChild(dot);
        });
        const dots = Array.from(dotsWrap.querySelectorAll('.p3d-dot'));

        // Backdrop khusus untuk mode zoom
        const zoomBackdrop = document.createElement('div');
        zoomBackdrop.className = 'p3d-zoom-backdrop';
        document.body.appendChild(zoomBackdrop);

        function getConfig() {
            const w = window.innerWidth;
            if (w < 480) return { angle: 24, spacingX: 70, depth: 90 };
            if (w < 768) return { angle: 27, spacingX: 95, depth: 115 };
            return { angle: 30, spacingX: 145, depth: 150 };
        }

        function render() {
            const cfg = getConfig();

            cards.forEach(function (card, i) {
                // Kartu yang sedang di-zoom dibiarkan, style-nya diatur
                // sendiri oleh openZoom()/closeZoom(), jangan ditimpa render().
                if (card === zoomedCard) return;

                let diff = i - active;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                const absDiff = Math.abs(diff);
                const visible = absDiff <= 3;

                const rotateY = -diff * cfg.angle;
                const translateX = diff * cfg.spacingX;
                const translateZ = -absDiff * cfg.depth;
                const scale = Math.max(1 - absDiff * 0.16, 0.5);
                const opacity = visible ? Math.max(1 - absDiff * 0.32, 0) : 0;

                card.style.transform =
                    'translateX(' + translateX + 'px) ' +
                    'translateZ(' + translateZ + 'px) ' +
                    'rotateY(' + rotateY + 'deg) ' +
                    'scale(' + scale + ')';
                card.style.opacity = opacity;
                card.style.zIndex = 100 - absDiff;
                card.style.pointerEvents = visible ? 'auto' : 'none';
                card.classList.toggle('p3d-active', diff === 0);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle('p3d-dot-active', i === active);
            });
        }

        function setActive(i) {
            active = ((i % total) + total) % total;
            render();
        }

        function next() { if (zoomedCard) return; setActive(active + 1); }
        function prev() { if (zoomedCard) return; setActive(active - 1); }

        prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });
        nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });

        // ============================================================
        // ZOOM OTOMATIS SAAT KARTU DIKLIK
        // ============================================================
        let zoomedOriginalNextSibling = null;

        function openZoom(i) {
            if (zoomedCard) return;

            setActive(i); // kartu ini juga jadi kartu tengah di belakang layar
            stopAutoplay();

            const card = cards[i];
            zoomedCard = card;

            const inner = card.querySelector('.p3d-card-inner');
            let closeBtn = inner.querySelector('.p3d-zoom-close');
            if (!closeBtn) {
                closeBtn = document.createElement('button');
                closeBtn.className = 'p3d-zoom-close';
                closeBtn.setAttribute('aria-label', 'Tutup');
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeZoom();
                });
                inner.appendChild(closeBtn);
            }

            // PENTING: .p3d-stage punya CSS "perspective", yang membuat
            // descendant "position:fixed" jadi terjebak relatif terhadap
            // .p3d-stage (bukan viewport), dan stacking-nya ikut terjebak
            // di bawah backdrop. Solusinya: pindahkan kartu ini langsung
            // jadi anak <body> selama mode zoom, lalu kembalikan lagi ke
            // posisi semula saat ditutup.
            zoomedOriginalNextSibling = card.nextSibling;
            document.body.appendChild(card);

            card.classList.add('p3d-zoomed');
            card.style.transform = 'translate(-50%, -50%)';
            card.style.opacity = '1';
            card.style.zIndex = '';
            card.style.pointerEvents = 'auto';

            zoomBackdrop.classList.add('p3d-zoom-active');
            document.body.classList.add('p3d-zoom-lock');
            document.addEventListener('keydown', onZoomKeydown);
        }

        function closeZoom() {
            if (!zoomedCard) return;
            const card = zoomedCard;

            card.classList.remove('p3d-zoomed');

            // kembalikan kartu ke posisi asalnya di dalam track
            if (zoomedOriginalNextSibling && zoomedOriginalNextSibling.parentNode === track) {
                track.insertBefore(card, zoomedOriginalNextSibling);
            } else {
                track.appendChild(card);
            }

            zoomedCard = null;
            zoomedOriginalNextSibling = null;

            zoomBackdrop.classList.remove('p3d-zoom-active');
            document.body.classList.remove('p3d-zoom-lock');
            document.removeEventListener('keydown', onZoomKeydown);

            render();
            startAutoplay();
        }

        function onZoomKeydown(e) {
            if (e.key === 'Escape') closeZoom();
        }

        zoomBackdrop.addEventListener('click', closeZoom);

        // Klik kartu (tengah atau samping) -> zoom otomatis
        // (kecuali kalau yang diklik ikon WA -> biarkan langsung buka WhatsApp)
        cards.forEach(function (card, i) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('.p3d-wa')) return;
                if (e.target.closest('.p3d-zoom-close')) return;
                if (zoomedCard) return;
                e.preventDefault();
                openZoom(i);
            });
        });

        // Keyboard (saat stage difokus) — nonaktif ketika sedang zoom
        stage.addEventListener('keydown', function (e) {
            if (zoomedCard) return;
            if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
            if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
        });

        // Swipe / drag
        // PENTING: sengaja TIDAK pakai setPointerCapture() — itu yang bikin
        // klik di tombol panah / kartu / ikon WA tidak pernah sampai ke
        // elemen aslinya (semua event "ditelan" oleh stage). Kita juga
        // kecualikan elemen interaktif dari logika drag sama sekali.
        let dragging = false;
        let startX = 0;

        stage.addEventListener('pointerdown', function (e) {
            if (zoomedCard) return;
            if (e.target.closest('.p3d-nav, .p3d-wa, .p3d-dot')) return;
            dragging = true;
            startX = e.clientX;
        });

        stage.addEventListener('pointerup', function (e) {
            if (!dragging) return;
            dragging = false;
            const deltaX = e.clientX - startX;
            if (Math.abs(deltaX) > 40) {
                deltaX < 0 ? next() : prev();
                restartAutoplay();
            }
        });

        stage.addEventListener('pointercancel', function () { dragging = false; });

        // Autoplay dengan jeda saat disentuh/hover
        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(next, 4500);
        }
        function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
        }
        function restartAutoplay() {
            startAutoplay();
        }

        stage.addEventListener('mouseenter', stopAutoplay);
        stage.addEventListener('mouseleave', startAutoplay);
        stage.addEventListener('touchstart', stopAutoplay, { passive: true });

        window.addEventListener('resize', render);

        render();
        startAutoplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPengurus3D);
    } else {
        initPengurus3D();
    }
})();