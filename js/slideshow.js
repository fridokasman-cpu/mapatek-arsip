// ================================================================
// SLIDESHOW BACKGROUND - HERO SECTION
// ================================================================

const slideshowImages = [
    {
        url: 'images/slideshow/hero1.jpg',
        caption: 'Wisuda Angkatan Pendiri'
    },
    {
        url: 'images/slideshow/hero2.jpg',
        caption: 'Pelantikan Angkatan Tedak Daivat'
    },
    {
        url: 'images/slideshow/hero3.jpg',
        caption: 'Pendakian Gunung Lawu 2025'
    },
    {
        url: 'images/slideshow/hero4.jpg',
        caption: 'Bersih Bersih Pantai Baros'
    },
    {
        url: 'images/slideshow/hero5.jpg',
        caption: 'Latihan RC'
    }
];

let currentSlide = 0;
let slideshowInterval;

function changeSlide(index) {
    const hero = document.querySelector('.hero');
    const caption = document.querySelector('.hero-slide-caption');
    
    if (!hero) return;
    
    // Hapus class active dari semua dot
    document.querySelectorAll('.slide-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Set background image dengan efek fade
    hero.style.backgroundImage = `url('${slideshowImages[index].url}')`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
    hero.style.transition = 'background-image 1s ease-in-out';
    
    // Update caption
    if (caption) {
        caption.textContent = slideshowImages[index].caption;
        caption.style.opacity = '0';
        setTimeout(() => {
            caption.style.opacity = '1';
        }, 100);
    }
    
    // Update dot aktif
    const dots = document.querySelectorAll('.slide-dot');
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % slideshowImages.length;
    changeSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slideshowImages.length) % slideshowImages.length;
    changeSlide(prev);
}

function startSlideshow() {
    // Hentikan interval sebelumnya jika ada
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    // Mulai slideshow otomatis setiap 5 detik
    slideshowInterval = setInterval(nextSlide, 5000);
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// Buat navigasi slideshow
function createSlideshowNavigation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Buat container untuk navigasi
    const navContainer = document.createElement('div');
    navContainer.className = 'slideshow-nav';
    
    // Tombol prev
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-btn slide-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        prevSlide();
        startSlideshow(); // Reset timer
    };
    
    // Tombol next
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-btn slide-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        nextSlide();
        startSlideshow(); // Reset timer
    };
    
    // Container dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slide-dots';
    
    slideshowImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'slide-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = (e) => {
            e.stopPropagation();
            changeSlide(index);
            startSlideshow(); // Reset timer
        };
        dotsContainer.appendChild(dot);
    });
    
    // Caption
    const caption = document.createElement('div');
    caption.className = 'hero-slide-caption';
    caption.textContent = slideshowImages[0].caption;
    
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(dotsContainer);
    navContainer.appendChild(nextBtn);
    hero.appendChild(navContainer);
    hero.appendChild(caption);
}

// Inisialisasi slideshow
document.addEventListener('DOMContentLoaded', function() {
    // Buat navigasi
    createSlideshowNavigation();
    
    // Set gambar pertama
    setTimeout(() => {
        changeSlide(0);
    }, 100);
    
    // Mulai slideshow otomatis
    setTimeout(startSlideshow, 500);
    
    // Hentikan slideshow saat hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopSlideshow);
        hero.addEventListener('mouseleave', startSlideshow);
        
        // Untuk touch device
        hero.addEventListener('touchstart', stopSlideshow);
        hero.addEventListener('touchend', startSlideshow);
    }
});

// Ekspose fungsi ke global
window.changeSlide = changeSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.startSlideshow = startSlideshow;
window.stopSlideshow = stopSlideshow;