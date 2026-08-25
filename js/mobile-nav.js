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

                #navLinks {
                    display: flex !important;
                    position: fixed;
                    top: 0;
                    right: 0;
                    height: 100vh;
                    width: min(85vw, 340px);
                    margin: 0;
                    padding: 4.5rem 0 2rem;
                    list-style: none;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 0;
                    background: linear-gradient(180deg, #0b3d2e 0%, #06261c 100%);
                    overflow-y: auto;
                    transform: translateX(100%);
                    transition: transform 0.32s ease;
                    z-index: 3000;
                    box-shadow: -10px 0 40px rgba(0,0,0,0.45);
                }

                body.mnav-active #navLinks {
                    transform: translateX(0);
                }

                .mnav-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    z-index: 2999;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease;
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
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    color: #fff !important;
                    font-size: 1rem;
                    font-weight: 600;
                    text-decoration: none;
                }

                #navLinks .nav-dropdown-menu {
                    display: none;
                    background: rgba(0,0,0,0.2);
                    padding: 0.25rem 0 0.6rem;
                    position: static;
                    opacity: 1;
                    visibility: visible;
                    transform: none;
                }

                #navLinks .nav-dropdown.mnav-open > .nav-dropdown-menu {
                    display: block;
                }

                #navLinks .nav-dropdown > a i.fa-chevron-down {
                    transition: transform 0.25s ease;
                }

                #navLinks .nav-dropdown.mnav-open > a i.fa-chevron-down {
                    transform: rotate(180deg);
                }

                #navLinks .dropdown-grid {
                    display: flex !important;
                    flex-direction: column;
                    gap: 0;
                }

                #navLinks .dropdown-item {
                    display: flex !important;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.65rem 1.5rem 0.65rem 2.25rem;
                    color: rgba(255,255,255,0.88) !important;
                    text-decoration: none;
                }

                #navLinks .dropdown-icon {
                    width: 30px;
                    height: 30px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.08);
                    border-radius: 8px;
                    font-size: 0.8rem;
                }

                #navLinks .dropdown-content {
                    display: flex;
                    flex-direction: column;
                }

                #navLinks .dropdown-title {
                    font-size: 0.88rem;
                    font-weight: 600;
                    line-height: 1.2;
                }

                #navLinks .dropdown-desc {
                    display: none;
                }

                #navLinks .nav-emergency {
                    padding: 1rem 1.5rem 0;
                    border-bottom: none;
                }

                #navLinks .nav-emergency a {
                    justify-content: center;
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
        backdrop.addEventListener('click', closeMenu);

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