(function () {
    'use strict';

    function initAb3dTilt() {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (isTouchDevice) return;

        function tiltify(el, strength) {
            strength = strength || 10;
            el.addEventListener('mousemove', function (e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y / rect.height) - 0.5) * -strength;
                const rotateY = ((x / rect.width) - 0.5) * strength;
                el.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }

        const emblem = document.getElementById('ab3dEmblem');
        if (emblem) tiltify(emblem, 22);

        const nameCard = document.getElementById('ab3dNameCard');
        if (nameCard) tiltify(nameCard, 6);

        document.querySelectorAll('.ab3d-tcard').forEach(function (card) {
            tiltify(card, 12);
        });

        document.querySelectorAll('.ab3d-feature').forEach(function (card) {
            tiltify(card, 10);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAb3dTilt);
    } else {
        initAb3dTilt();
    }
})();