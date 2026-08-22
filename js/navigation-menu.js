// ================================================================
// NAVIGATION MENU - 4 Menu Utama dengan Dropdown (FIXED)
// ================================================================

// Deteksi apakah perangkat mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    console.log('📱 Mobile device detected');
    document.body.classList.add('is-mobile');
}

// Pastikan DOM sudah siap sebelum menjalankan
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Navigation Menu initializing...');
    initNavigation();
});

function initNavigation() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    
    if (!navLinks) {
        console.warn('⚠️ navLinks not found');
        return;
    }

    // ============================================================
    // 1. HAMBURGER MENU TOGGLE (PRIORITAS UTAMA)
    // ============================================================
    if (hamburger) {
        // Hapus semua event listener dengan clone
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Gunakan pointer-events: none pada ikon agar tidak menghalangi
        const icon = newHamburger.querySelector('i');
        if (icon) {
            icon.style.pointerEvents = 'none';
        }
        
        // Event click untuk hamburger
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🍔 Hamburger clicked - toggling menu');
            
            // Toggle menu
            navLinks.classList.toggle('active');
            
            // Tutup semua dropdown
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
            
            // Scroll ke atas saat menu dibuka (opsional)
            if (navLinks.classList.contains('active')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            console.log('Menu active:', navLinks.classList.contains('active'));
        });
        
        // Touch event untuk mobile (pasif)
        newHamburger.addEventListener('touchstart', function(e) {
            // Biarkan click handler yang bekerja
        }, { passive: true });
    } else {
        console.warn('⚠️ Hamburger not found!');
    }

    // ============================================================
    // 2. MOBILE DROPDOWN TOGGLE
    // ============================================================
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown > a');
    
    dropdownTriggers.forEach(trigger => {
        // Clone dan replace untuk menghapus event listener lama
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
    });

    // Ambil ulang triggers setelah clone
    const freshTriggers = document.querySelectorAll('.nav-dropdown > a');
    
    freshTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Hanya untuk mobile
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                const parent = this.parentElement;
                const isActive = parent.classList.contains('active');
                
                // Tutup semua dropdown lain
                document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                    if (drop !== parent) {
                        drop.classList.remove('active');
                    }
                });
                
                // Toggle class active
                if (isActive) {
                    parent.classList.remove('active');
                } else {
                    parent.classList.add('active');
                }
                
                console.log('Dropdown toggled:', parent.classList.contains('active'));
            }
        });
    });

    // ============================================================
    // 3. TUTUP DROPDOWN SAAT KLIK DI LUAR
    // ============================================================
    document.addEventListener('click', function(event) {
        // Cek apakah klik di dalam navbar
        const isNavbar = event.target.closest('.navbar');
        const isHamburger = event.target.closest('.hamburger');
        const isDropdown = event.target.closest('.nav-dropdown');
        
        // Jika klik di luar navbar dan bukan hamburger
        if (!isNavbar && !isHamburger) {
            // Tutup menu mobile
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            // Tutup dropdown
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
        }
    });

    // ============================================================
    // 4. TUTUP MOBILE MENU SAAT KLIK LINK (kecuali dropdown trigger)
    // ============================================================
    const mobileLinks = document.querySelectorAll('.nav-links a:not([href="#"])');
    
    mobileLinks.forEach(link => {
        // Clone untuk hapus event lama
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            // Cek apakah ini link di dalam dropdown (bukan trigger)
            const isDropdownMenu = this.closest('.nav-dropdown-menu');
            const isDropdownTrigger = this.closest('.nav-dropdown') && !isDropdownMenu;
            
            // Jika bukan dropdown trigger, tutup menu
            if (!isDropdownTrigger) {
                if (window.innerWidth <= 992) {
                    // Tutup semua dropdown
                    document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                        drop.classList.remove('active');
                    });
                    // Tutup menu
                    if (navLinks) {
                        navLinks.classList.remove('active');
                    }
                }
            }
        });
    });

    // ============================================================
    // 5. TUTUP MENU SAAT SCROLL (Mobile)
    // ============================================================
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 992 && navLinks.classList.contains('active')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                navLinks.classList.remove('active');
                document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                    drop.classList.remove('active');
                });
            }, 300);
        }
    }, { passive: true });

    // ============================================================
    // 6. RESIZE: Reset state saat layar berubah
    // ============================================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992) {
                // Hapus class active di mobile
                document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                    drop.classList.remove('active');
                });
                // Tutup mobile menu
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
                // Reset dropdown style
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                    menu.style.transform = '';
                    menu.style.display = '';
                });
            } else {
                // Di mobile, pastikan menu tertutup saat resize
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        }, 200);
    });

    // ============================================================
    // 7. DROPDOWN HOVER UNTUK DESKTOP
    // ============================================================
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        // Hapus event listener lama dengan clone
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
    });

    // Ambil ulang dropdown setelah clone
    const freshDropdowns = document.querySelectorAll('.nav-dropdown');
    
    freshDropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        if (!menu) return;

        // Desktop - hover
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 992) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 992) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateX(-50%) translateY(10px)';
            }
        });
    });

    // ============================================================
    // 8. KEYBOARD: ESC untuk tutup
    // ============================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
        }
    });

    console.log('✅ Navigation Menu with 4 menus ready!');
    console.log('📱 Mobile menu: click hamburger to open');
    console.log('💻 Desktop menu: hover to open dropdown');
}

// ============================================================
// 9. FALLBACK: Jika DOM sudah siap, jalankan langsung
// ============================================================
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Jika DOM sudah siap, panggil langsung
    setTimeout(function() {
        if (typeof initNavigation === 'function') {
            initNavigation();
        }
    }, 100);
}

// ============================================================
// 10. EKSPOR FUNGSI KE GLOBAL (untuk dipanggil dari HTML)
// ============================================================
window.toggleMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        const isActive = navLinks.classList.contains('active');
        if (isActive) {
            navLinks.classList.remove('active');
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
        } else {
            navLinks.classList.add('active');
        }
    }
};

// Fungsi toggle khusus untuk mobile (dipanggil dari onclick di HTML)
window.toggleMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
        document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
            drop.classList.remove('active');
        });
    }
};

console.log('✅ navigation-menu.js loaded');