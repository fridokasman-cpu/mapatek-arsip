// ================================================================
// NAVIGATION MENU - 4 Menu Utama dengan Dropdown (FIXED)
// ================================================================

// Pastikan DOM sudah siap sebelum menjalankan
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Navigation Menu initializing...');

    // ============================================================
    // 1. MOBILE DROPDOWN TOGGLE
    // ============================================================
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown > a');
    
    // Hapus semua event listener lama (jika ada) dengan clone
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
            }
        });
    });

    // ============================================================
    // 2. TUTUP DROPDOWN SAAT KLIK DI LUAR
    // ============================================================
    document.addEventListener('click', function(event) {
        const isDropdown = event.target.closest('.nav-dropdown');
        if (!isDropdown) {
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
        }
    });

    // ============================================================
    // 3. TUTUP MOBILE MENU SAAT KLIK LINK
    // ============================================================
    const mobileLinks = document.querySelectorAll('.nav-links a:not([href="#"])');
    const navLinks = document.getElementById('navLinks');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
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
        });
    });

    // ============================================================
    // 4. HAMBURGER MENU TOGGLE
    // ============================================================
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        // Clone untuk menghapus event listener lama
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        newHamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks) {
                navLinks.classList.toggle('active');
                // Tutup semua dropdown saat menu dibuka/tutup
                document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                    drop.classList.remove('active');
                });
            }
        });
    }

    // ============================================================
    // 5. RESIZE: Reset state saat layar berubah
    // ============================================================
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            // Hapus class active di mobile
            document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                drop.classList.remove('active');
            });
            // Tutup mobile menu
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });

    // ============================================================
    // 6. DROPDOWN HOVER UNTUK DESKTOP
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

    console.log('✅ Navigation Menu with 4 menus ready!');
});

// ============================================================
// 7. FALLBACK: Jika DOM sudah siap, jalankan langsung
// ============================================================
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Jika DOM sudah siap, panggil langsung
    setTimeout(() => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }, 100);
}