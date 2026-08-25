// ================================================================
// MOBILE NAVIGATION — Desain Baru (Off-canvas, terisolasi total)
// ----------------------------------------------------------------
// File ini MENGGANTIKAN navigation-menu.js sepenuhnya.
// CSS untuk menu mobile di-inject lewat JS (bukan taruh di styles.css)
// supaya tidak bentrok dengan aturan lama yang sudah numpuk & saling
// tabrakan. Class yang dipakai ("mnav-active", "mnav-open") adalah
// class BARU yang belum pernah dipakai di styles.css, jadi dijamin
// tidak ada konflik spesifisitas/urutan CSS sama sekali.
//
// Tidak perlu ubah index.html maupun styles.css sama sekali —
// file ini memakai ulang struktur #navLinks yang sudah ada.
//
// Desktop (>992px) TIDAK disentuh — hover dropdown tetap pakai CSS
// asli dari styles.css seperti sebelumnya.
// ================================================================

(function () {
    'use strict';

    function injectStyles() {
        if (document.getElementById('mnav-styles')) return;

        const style = document.createElement('style');
        style.id = 'mnav-styles';
        style.textContent = `
            @media (max-width: 992px) {
                body.mnav-active {
                    overflow: hidden;
                }

                /* PENTING: .navbar sudah membentuk stacking context sendiri
                   (position:fixed + z-index:1000 di styles.css). Karena itu,
                   z-index #navLinks di bawah ini HANYA berlaku di dalam
                   .navbar, dan tidak bisa mengalahkan .mnav-backdrop yang
                   levelnya di <body>. Naikkan z-index .navbar saat menu aktif
                   supaya seluruh isinya (termasuk #navLinks) pasti di atas
                   backdrop dan bisa menerima klik dengan benar. */
                body.mnav-active .navbar {
                    z-index: 4000 !important;
                }

                #navLinks {
                    display: flex !important;
                    position: fixed !important;
                    top: 0 !important;
                    right: 0 !important;
                    left: auto !important;
                    bottom: auto !important;
                    height: 100vh !important;
                    width: min(85vw, 340px) !important;
                    max-width: 340px !important;
                    margin: 0 !important;
                    padding: 4.5rem 0 2rem !important;
                    list-style: none !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    gap: 0 !important;
                    background: linear-gradient(180deg, #0b3d2e 0%, #06261c 100%) !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    transform: translateX(100%) !important;
                    transition: transform 0.32s ease !important;
                    z-index: 3000 !important;
                    box-shadow: -10px 0 40px rgba(0,0,0,0.45) !important;
                }

                body.mnav-active #navLinks {
                    transform: translateX(0) !important;
                }

                .mnav-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    z-index: 2999;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease;
                    /* PENTING: backdrop TIDAK BOLEH menerima klik sama sekali.
                       Tutup-saat-klik-di-luar ditangani lewat JS (cek posisi
                       elemen yang diklik), bukan lewat backdrop ini, supaya
                       tidak mungkin ada klik di dalam panel yang "kececer"
                       ke backdrop akibat masalah stacking/z-index apapun. */
                    pointer-events: none !important;
                }

                body.mnav-active .mnav-backdrop {
                    opacity: 1;
                    visibility: visible;
                }

                .mnav-close-btn {
                    position: absolute;
                    top: 0.85rem;
                    right: 0.85rem;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    border: none;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 3001;
                }

                #navLinks > li {
                    width: 100%;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }

                #navLinks > li > a {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    padding: 1rem 1.5rem !important;
                    color: #fff !important;
                    font-size: 1rem !important;
                    font-weight: 600 !important;
                    text-decoration: none !important;
                    width: auto !important;
                }

                #navLinks .nav-dropdown-menu {
                    display: none !important;
                    background: rgba(0,0,0,0.2) !important;
                    padding: 0.25rem 0 0.6rem !important;
                    position: static !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: none !important;
                    width: 100% !important;
                    height: auto !important;
                    max-height: none !important;
                    margin: 0 !important;
                    animation: none !important;
                }

                #navLinks .nav-dropdown.mnav-open > .nav-dropdown-menu {
                    display: block !important;
                }

                #navLinks .nav-dropdown > a i.fa-chevron-down {
                    transition: transform 0.25s ease !important;
                }

                #navLinks .nav-dropdown.mnav-open > a i.fa-chevron-down {
                    transform: rotate(180deg) !important;
                }

                #navLinks .dropdown-grid {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0 !important;
                    grid-template-columns: none !important;
                    width: 100% !important;
                }

                #navLinks .dropdown-item {
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.75rem !important;
                    padding: 0.65rem 1.5rem 0.65rem 2.25rem !important;
                    color: rgba(255,255,255,0.88) !important;
                    text-decoration: none !important;
                    width: auto !important;
                }

                #navLinks .dropdown-icon {
                    width: 30px !important;
                    height: 30px !important;
                    flex-shrink: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: rgba(255,255,255,0.08) !important;
                    border-radius: 8px !important;
                    font-size: 0.8rem !important;
                }

                #navLinks .dropdown-content {
                    display: flex !important;
                    flex-direction: column !important;
                }

                #navLinks .dropdown-title {
                    font-size: 0.88rem !important;
                    font-weight: 600 !important;
                    line-height: 1.2 !important;
                    color: #fff !important;
                }

                #navLinks .dropdown-desc {
                    display: none !important;
                }

                #navLinks .nav-emergency {
                    padding: 1rem 1.5rem 0 !important;
                    border-bottom: none !important;
                    width: 100% !important;
                }

                #navLinks .nav-emergency a {
                    justify-content: center !important;
                    display: flex !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function buildBackdrop() {
        let backdrop = document.querySelector('.mnav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'mnav-backdrop';
            document.body.appendChild(backdrop);
        }
        return backdrop;
    }

    function buildCloseButton(navLinks) {
        let btn = navLinks.querySelector('.mnav-close-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'mnav-close-btn';
            btn.setAttribute('aria-label', 'Tutup menu');
            btn.innerHTML = '<i class="fas fa-times"></i>';
            navLinks.prepend(btn);
        }
        return btn;
    }

    function init() {
        const navLinks = document.getElementById('navLinks');
        const hamburger = document.querySelector('.hamburger');

        if (!navLinks || !hamburger) {
            console.warn('⚠️ mobile-nav.js: #navLinks atau .hamburger tidak ditemukan di halaman ini');
            return;
        }

        injectStyles();

        // Bersihkan inline style lama (jika ada sisa dari script sebelumnya)
        // — inline style selalu menang atas CSS apapun, termasuk !important
        // di stylesheet biasa, jadi ini harus dikosongkan dulu.
        navLinks.removeAttribute('style');
        navLinks.querySelectorAll('.nav-dropdown-menu').forEach(function (menu) {
            menu.removeAttribute('style');
        });

        const backdrop = buildBackdrop();
        const closeBtn = buildCloseButton(navLinks);

        // Ambil alih hamburger sepenuhnya (clone-replace agar listener
        // lama dari script lain tidak ikut nyangkut)
        const freshHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(freshHamburger, hamburger);

        function openMenu() {
            document.body.classList.add('mnav-active');
        }

        function closeMenu() {
            document.body.classList.remove('mnav-active');
            navLinks.querySelectorAll('.nav-dropdown.mnav-open').forEach(function (li) {
                li.classList.remove('mnav-open');
            });
        }

        function toggleMenu() {
            if (document.body.classList.contains('mnav-active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        freshHamburger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (window.innerWidth > 992) return; // desktop: navbar lama yang jalan
            toggleMenu();
        });

        closeBtn.addEventListener('click', closeMenu);

        // Tutup saat klik di luar panel — dicek lewat posisi elemen yang
        // diklik (bukan lewat backdrop), jadi tidak mungkin salah tangkap
        // klik yang sebenarnya ditujukan untuk isi menu.
        document.addEventListener('click', function (e) {
            if (!document.body.classList.contains('mnav-active')) return;
            const clickedInsidePanel = e.target.closest('#navLinks');
            const clickedHamburger = e.target.closest('.hamburger');
            if (!clickedInsidePanel && !clickedHamburger) {
                closeMenu();
            }
        });

        // Accordion untuk setiap dropdown — hanya aktif di mobile
        navLinks.querySelectorAll('.nav-dropdown > a').forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                if (window.innerWidth > 992) return; // desktop: biarkan hover asli bekerja
                e.preventDefault();
                e.stopPropagation();

                const parentLi = this.parentElement;
                const isOpen = parentLi.classList.contains('mnav-open');

                navLinks.querySelectorAll('.nav-dropdown.mnav-open').forEach(function (li) {
                    if (li !== parentLi) li.classList.remove('mnav-open');
                });

                parentLi.classList.toggle('mnav-open', !isOpen);
            });
        });

        // Klik link isi menu (bukan trigger dropdown) -> tutup panel
        navLinks.querySelectorAll('a:not([href="#"])').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 992) closeMenu();
            });
        });

        // ESC menutup menu
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        // Reset saat layar di-resize ke ukuran desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 992) closeMenu();
        });

        // Kompatibilitas: kalau ada kode lama yang masih memanggil ini
        window.toggleMenu = toggleMenu;
        window.toggleMobileMenu = toggleMenu;

        console.log('✅ mobile-nav.js siap — menu mobile pakai desain off-canvas baru');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();