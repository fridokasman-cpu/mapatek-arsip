// ================================================================
// NAVIGATION MENU - Dropdown & Mobile Navigation
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================================
    // 1. DROPDOWN MENU (Desktop)
    // ============================================================
    const navLinks = document.querySelector('.nav-links');
    const navItems = navLinks ? navLinks.querySelectorAll('li') : [];

    // Buat elemen dropdown untuk menu yang memiliki submenu
    const menuItemsWithDropdown = [
        { 
            trigger: 'Kegiatan', 
            items: [
                { title: 'Agenda', href: '#agenda' },
                { title: 'Galeri', href: '#galeri' },
                { title: 'Tutorial', href: '#tutorial' },
                { title: 'Quiz', href: '#quiz' }
            ]
        },
        { 
            trigger: 'Informasi', 
            items: [
                { title: 'Tentang', href: '#tentang' },
                { title: 'Pengurus', href: '#pengurus' },
                { title: 'Berita', href: '#berita' },
                { title: 'Arsip', href: '#arsip' }
            ]
        }
    ];

    // Fungsi untuk membuat dropdown
    function createDropdown(triggerText, items) {
        // Cari elemen nav yang sesuai (jika ada)
        const existingItem = Array.from(navItems).find(item => 
            item.textContent.trim() === triggerText
        );

        if (existingItem) {
            // Ubah menjadi dropdown
            const link = existingItem.querySelector('a');
            if (link) {
                // Buat wrapper dropdown
                const dropdownWrapper = document.createElement('div');
                dropdownWrapper.className = 'nav-dropdown';
                dropdownWrapper.style.position = 'relative';
                
                // Clone link sebagai trigger
                const trigger = link.cloneNode(true);
                trigger.href = '#';
                trigger.style.cursor = 'pointer';
                trigger.innerHTML += ' <i class="fas fa-chevron-down" style="font-size:10px;margin-left:4px;"></i>';
                
                // Buat dropdown menu
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'nav-dropdown-menu';
                dropdownMenu.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: rgba(10, 43, 37, 0.97);
                    backdrop-filter: blur(20px);
                    border-radius: 12px;
                    padding: 8px 0;
                    min-width: 200px;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.08);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                `;

                items.forEach(item => {
                    const menuLink = document.createElement('a');
                    menuLink.href = item.href;
                    menuLink.textContent = item.title;
                    menuLink.style.cssText = `
                        padding: 10px 20px;
                        color: rgba(255,255,255,0.8);
                        text-decoration: none;
                        font-size: 0.85rem;
                        font-weight: 500;
                        transition: all 0.2s;
                        border-radius: 6px;
                        margin: 2px 8px;
                    `;
                    menuLink.onmouseover = function() {
                        this.style.background = 'rgba(255,255,255,0.08)';
                        this.style.color = 'white';
                    };
                    menuLink.onmouseout = function() {
                        this.style.background = 'transparent';
                        this.style.color = 'rgba(255,255,255,0.8)';
                    };
                    dropdownMenu.appendChild(menuLink);
                });

                // Hover events untuk desktop
                dropdownWrapper.onmouseenter = function() {
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    dropdownMenu.style.transform = 'translateY(0)';
                };
                dropdownWrapper.onmouseleave = function() {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(10px)';
                };

                // Click untuk mobile
                trigger.onclick = function(e) {
                    e.preventDefault();
                    if (window.innerWidth <= 992) {
                        const isOpen = dropdownMenu.style.visibility === 'visible';
                        dropdownMenu.style.opacity = isOpen ? '0' : '1';
                        dropdownMenu.style.visibility = isOpen ? 'hidden' : 'visible';
                        dropdownMenu.style.transform = isOpen ? 'translateY(10px)' : 'translateY(0)';
                    }
                };

                dropdownWrapper.appendChild(trigger);
                dropdownWrapper.appendChild(dropdownMenu);
                existingItem.innerHTML = '';
                existingItem.appendChild(dropdownWrapper);
            }
        }
    }

    // Buat dropdown untuk menu yang sudah ada
    // Periksa apakah menu "Kegiatan" dan "Informasi" ada
    const hasKegiatan = Array.from(navItems).some(item => item.textContent.trim() === 'Kegiatan');
    const hasInformasi = Array.from(navItems).some(item => item.textContent.trim() === 'Informasi');

    // Jika belum ada, tambahkan sebagai item baru
    if (!hasKegiatan) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Kegiatan';
        link.innerHTML += ' <i class="fas fa-chevron-down" style="font-size:10px;margin-left:4px;"></i>';
        li.appendChild(link);
        
        // Buat dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'nav-dropdown-menu';
        dropdownMenu.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: rgba(10, 43, 37, 0.97);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 8px 0;
            min-width: 200px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.08);
            z-index: 100;
            flex-direction: column;
        `;
        dropdownMenu.style.display = 'none';

        const items = [
            { title: 'Agenda', href: '#agenda' },
            { title: 'Galeri', href: '#galeri' },
            { title: 'Tutorial', href: '#tutorial' },
            { title: 'Quiz', href: '#quiz' }
        ];
        items.forEach(item => {
            const menuLink = document.createElement('a');
            menuLink.href = item.href;
            menuLink.textContent = item.title;
            menuLink.style.cssText = `
                padding: 10px 20px;
                color: rgba(255,255,255,0.8);
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.2s;
                border-radius: 6px;
                margin: 2px 8px;
            `;
            menuLink.onmouseover = function() {
                this.style.background = 'rgba(255,255,255,0.08)';
                this.style.color = 'white';
            };
            menuLink.onmouseout = function() {
                this.style.background = 'transparent';
                this.style.color = 'rgba(255,255,255,0.8)';
            };
            dropdownMenu.appendChild(menuLink);
        });

        li.appendChild(dropdownMenu);
        li.style.position = 'relative';
        navLinks.appendChild(li);

        // Hover untuk desktop
        li.onmouseenter = function() {
            if (window.innerWidth > 992) {
                dropdownMenu.style.display = 'flex';
            }
        };
        li.onmouseleave = function() {
            if (window.innerWidth > 992) {
                dropdownMenu.style.display = 'none';
            }
        };
        // Click untuk mobile
        link.onclick = function(e) {
            e.preventDefault();
            if (window.innerWidth <= 992) {
                const isOpen = dropdownMenu.style.display === 'flex';
                dropdownMenu.style.display = isOpen ? 'none' : 'flex';
            }
        };
    }

    // ============================================================
    // 2. TUTUP DROPDOWN SAAT KLIK DI LUAR
    // ============================================================
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.nav-dropdown-menu');
        dropdowns.forEach(dropdown => {
            if (!dropdown.closest('.nav-dropdown') && !dropdown.closest('li')) {
                if (window.innerWidth <= 992) {
                    dropdown.style.display = 'none';
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                }
            }
        });
    });

    // ============================================================
    // 3. RESPONSIVE: Reset dropdown di desktop
    // ============================================================
    window.addEventListener('resize', function() {
        const dropdownMenus = document.querySelectorAll('.nav-dropdown-menu');
        if (window.innerWidth > 992) {
            dropdownMenus.forEach(menu => {
                menu.style.display = 'none';
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
            });
        }
    });

    console.log('✅ Navigation Menu dengan dropdown siap digunakan!');
});