// ================================================================
// NAVIGATION MENU - Wide Dropdown dengan Deskripsi
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================================
    // 1. MOBILE DROPDOWN TOGGLE
    // ============================================================
    const dropdownTriggers = document.querySelectorAll('.nav-dropdown > a');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Hanya untuk mobile
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
                
                // Tutup dropdown lain
                dropdownTriggers.forEach(other => {
                    if (other !== this) {
                        other.parentElement.classList.remove('active');
                    }
                });
            }
        });
    });

    // ============================================================
    // 2. TUTUP DROPDOWN SAAT KLIK DI LUAR
    // ============================================================
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            const isDropdown = event.target.closest('.nav-dropdown');
            if (!isDropdown) {
                document.querySelectorAll('.nav-dropdown.active').forEach(drop => {
                    drop.classList.remove('active');
                });
            }
        } else {
            // Desktop: tutup dropdown saat klik di luar
            const isDropdown = event.target.closest('.nav-dropdown');
            if (!isDropdown) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateX(-50%) translateY(10px)';
                });
            }
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
        hamburger.addEventListener('click', function(e) {
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
            // Reset dropdown menu style
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                menu.style.opacity = '';
                menu.style.visibility = '';
                menu.style.transform = '';
            });
        }
    });

    console.log('✅ Navigation Menu dengan wide dropdown siap digunakan!');
    console.log('📱 Desktop: Hover untuk membuka dropdown lebar dengan deskripsi');
    console.log('📱 Mobile: Klik untuk membuka dropdown');
});