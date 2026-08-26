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

        // Bangun dot indikator
        cards.forEach(function (_, i) {
            const dot = document.createElement('button');
            dot.className = 'p3d-dot';
            dot.setAttribute('aria-label', 'Ke pengurus nomor ' + (i + 1));
            dot.addEventListener('click', function () {
                setActive(i);
                restartAutoplay();
            });
            dotsWrap.appendChild(dot);
        });
        const dots = Array.from(dotsWrap.querySelectorAll('.p3d-dot'));

        function getConfig() {
            const w = window.innerWidth;
            if (w < 480) return { angle: 24, spacingX: 70, depth: 90 };
            if (w < 768) return { angle: 27, spacingX: 95, depth: 115 };
            return { angle: 30, spacingX: 145, depth: 150 };
        }

        function render() {
            const cfg = getConfig();

            cards.forEach(function (card, i) {
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

        function next() { setActive(active + 1); }
        function prev() { setActive(active - 1); }

        prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });
        nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });

        // Klik langsung di kartu samping -> jadikan aktif
        cards.forEach(function (card, i) {
            card.addEventListener('click', function (e) {
                if (i !== active) {
                    e.preventDefault();
                    setActive(i);
                    restartAutoplay();
                }
            });
        });

        // Keyboard (saat stage difokus)
        stage.addEventListener('keydown', function (e) {
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