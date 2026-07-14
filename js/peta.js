// ================================================================
// FILE: js/peta.js
// DESKRIPSI: Semua fungsi JavaScript untuk peta pendakian MAPATEK
// ================================================================

// ================================================================
// 1. INISIALISASI PETA
// ================================================================
const map = L.map('map', {
    center: [-7.5, 110.4],
    zoom: 8,
    zoomControl: true,
    fadeAnimation: true,
    attributionControl: true
});

// ================================================================
// 2. LAYER PETA (Online)
// ================================================================
// Base layer: OpenStreetMap
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    maxNativeZoom: 19
}).addTo(map);

// Layer Topografi (OpenTopoMap)
const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
    maxNativeZoom: 17
});

// Layer Satelit (ESRI)
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com">ESRI</a>',
    maxZoom: 19
});

// Layer control
const baseLayers = {
    '🗺️ Peta Dasar': osmLayer,
    '🗻 Topografi': topoLayer,
    '🛰️ Satelit': satelliteLayer
};
L.control.layers(baseLayers).addTo(map);

// ================================================================
// 3. KOMPAS
// ================================================================
L.control.compass({
    position: 'topleft',
    autoRotate: true,
    showCompass: true,
    showAngle: true
}).addTo(map);

// ================================================================
// 4. VARIABEL GLOBAL
// ================================================================
let userMarker = null;
let userCircle = null;
let trackPoints = [];
let trackLine = null;
let isTracking = false;
let watchId = null;
let startTime = null;
let totalDistance = 0;
let lastPosition = null;
let drawnItems = L.featureGroup().addTo(map);
let drawControl = null;
let savedTracks = [];

// ================================================================
// 5. LOAD SAVED TRACKS (dari localStorage)
// ================================================================
function loadSavedTracks() {
    try {
        const data = localStorage.getItem('mapatek_tracks');
        if (data) {
            savedTracks = JSON.parse(data);
            console.log('📂 ' + savedTracks.length + ' jejak tersimpan');
        }
    } catch (e) {
        console.warn('Gagal load tracks:', e);
    }
}
loadSavedTracks();

// ================================================================
// 6. FUNGSI GPS
// ================================================================
function locateMe() {
    const status = document.getElementById('gpsStatus');
    const dot = document.getElementById('gpsDot');
    const text = document.getElementById('gpsText');
    const accuracy = document.getElementById('gpsAccuracy');

    status.classList.add('active');
    dot.className = 'dot off';
    text.textContent = 'Mengakses GPS...';
    accuracy.textContent = '';

    if (!navigator.geolocation) {
        showToast('❌ Browser tidak mendukung GPS', 'error');
        dot.className = 'dot off';
        text.textContent = 'GPS tidak didukung';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const acc = position.coords.accuracy;

            updateUserMarker(lat, lng, acc);
            
            dot.className = 'dot on';
            text.textContent = '📍 GPS Aktif';
            accuracy.textContent = '±' + Math.round(acc) + 'm';
            map.setView([lat, lng], 15);
            showToast('✅ Lokasi ditemukan!', 'success');
        },
        function(error) {
            console.error('GPS Error:', error);
            dot.className = 'dot off';
            text.textContent = '❌ Gagal akses GPS';
            accuracy.textContent = '';
            showToast('❌ Gagal akses GPS: ' + error.message, 'error');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
}

function updateUserMarker(lat, lng, acc) {
    if (!userMarker) {
        userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 30px rgba(59,130,246,0.5);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            })
        }).addTo(map).bindPopup('📍 Anda di sini');
        
        userCircle = L.circle([lat, lng], {
            radius: acc || 20,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            weight: 1,
            className: 'gps-accuracy'
        }).addTo(map);
    } else {
        userMarker.setLatLng([lat, lng]);
        userCircle.setLatLng([lat, lng]);
        if (acc) userCircle.setRadius(acc);
    }
}

// ================================================================
// 7. TRACKING (REKAM JEJAK)
// ================================================================
function toggleTracking() {
    isTracking = !isTracking;
    const btn = document.getElementById('btnTrack');
    const text = document.getElementById('trackText');

    if (isTracking) {
        btn.classList.add('active');
        text.textContent = 'Berhenti';
        startTracking();
        showToast('🟢 Memulai rekaman jejak...', 'success');
    } else {
        btn.classList.remove('active');
        text.textContent = 'Rekam';
        stopTracking();
        showToast('⏹️ Rekaman dihentikan (' + trackPoints.length + ' titik)', 'warning');
    }
}

function startTracking() {
    trackPoints = [];
    totalDistance = 0;
    lastPosition = null;
    startTime = Date.now();
    document.getElementById('statsPanel').classList.add('active');

    if (trackLine) {
        map.removeLayer(trackLine);
        trackLine = null;
    }

    if (!navigator.geolocation) {
        showToast('❌ Browser tidak mendukung GPS', 'error');
        isTracking = false;
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const acc = position.coords.accuracy;

            trackPoints.push([lat, lng]);
            updateUserMarker(lat, lng, acc);
            updateStats();

            if (trackLine) {
                map.removeLayer(trackLine);
            }
            trackLine = L.polyline(trackPoints, {
                color: '#10b981',
                weight: 4,
                opacity: 0.9,
                smoothFactor: 1
            }).addTo(map);

            document.getElementById('gpsText').textContent = '📍 Tracking ' + trackPoints.length + ' titik';
            document.getElementById('gpsAccuracy').textContent = '±' + Math.round(acc) + 'm';
        },
        function(error) {
            console.error('Tracking Error:', error);
            showToast('❌ Error tracking: ' + error.message, 'error');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 }
    );
}

function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (trackPoints.length < 2) {
        document.getElementById('statsPanel').classList.remove('active');
    }
}

// ================================================================
// 8. STATISTIK PERJALANAN
// ================================================================
function updateStats() {
    document.getElementById('statPoints').textContent = trackPoints.length;

    let dist = 0;
    for (let i = 1; i < trackPoints.length; i++) {
        const p1 = trackPoints[i-1];
        const p2 = trackPoints[i];
        dist += distance(p1[0], p1[1], p2[0], p2[1]);
    }
    totalDistance = dist;
    document.getElementById('statDistance').textContent = formatDistance(dist);

    const elapsed = (Date.now() - startTime) / 1000;
    document.getElementById('statTime').textContent = formatTime(elapsed);

    if (elapsed > 0) {
        const speed = (dist / 1000) / (elapsed / 3600);
        document.getElementById('statSpeed').textContent = speed.toFixed(1) + ' km/j';
    }
}

function distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function formatDistance(m) {
    if (m < 1000) return Math.round(m) + ' m';
    return (m / 1000).toFixed(2) + ' km';
}

function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return h + ':' + String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
    return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
}

// ================================================================
// 9. SIMPAN JEJAK (localStorage)
// ================================================================
function saveTrack() {
    if (trackPoints.length < 2) {
        showToast('⚠️ Belum ada jejak untuk disimpan!', 'warning');
        return;
    }

    const data = {
        id: Date.now(),
        name: 'Jejak ' + new Date().toLocaleDateString('id-ID'),
        points: trackPoints,
        date: new Date().toISOString(),
        count: trackPoints.length,
        distance: totalDistance,
        duration: (Date.now() - startTime) / 1000
    };

    try {
        savedTracks.push(data);
        localStorage.setItem('mapatek_tracks', JSON.stringify(savedTracks));
        showToast('✅ Jejak tersimpan! (' + trackPoints.length + ' titik)', 'success');
    } catch (e) {
        showToast('❌ Gagal menyimpan: ' + e.message, 'error');
    }
}

// ================================================================
// 10. EXPORT JEJAK
// ================================================================
function showExportModal() {
    if (trackPoints.length < 2) {
        showToast('⚠️ Belum ada jejak untuk diekspor!', 'warning');
        return;
    }
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function exportTrack(format) {
    closeExportModal();
    
    if (trackPoints.length < 2) {
        showToast('⚠️ Belum ada jejak!', 'warning');
        return;
    }

    let content, filename, mimeType;
    const coords = trackPoints.map(p => [p[1], p[0]]);

    switch(format) {
        case 'geojson':
            content = JSON.stringify({
                type: "Feature",
                properties: {
                    name: "Jejak MAPATEK",
                    date: new Date().toISOString(),
                    points: trackPoints.length
                },
                geometry: {
                    type: "LineString",
                    coordinates: coords
                }
            }, null, 2);
            filename = 'jejak_mapatek.geojson';
            mimeType = 'application/json';
            break;

        case 'gpx':
            content = generateGPX(trackPoints);
            filename = 'jejak_mapatek.gpx';
            mimeType = 'application/gpx+xml';
            break;

        case 'kml':
            content = generateKML(trackPoints);
            filename = 'jejak_mapatek.kml';
            mimeType = 'application/vnd.google-earth.kml+xml';
            break;

        case 'csv':
            content = 'lat,lng,alt\n' + trackPoints.map(p => p[0] + ',' + p[1] + ',0').join('\n');
            filename = 'jejak_mapatek.csv';
            mimeType = 'text/csv';
            break;

        default:
            showToast('Format tidak dikenal', 'error');
            return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('📥 File ' + filename + ' siap diunduh!', 'success');
}

function generateGPX(points) {
    const now = new Date().toISOString();
    let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
    gpx += '<gpx version="1.1" creator="MAPATEK" xmlns="http://www.topografix.com/GPX/1/1">\n';
    gpx += '  <metadata>\n';
    gpx += '    <time>' + now + '</time>\n';
    gpx += '    <desc>Jejak pendakian MAPATEK</desc>\n';
    gpx += '  </metadata>\n';
    gpx += '  <trk>\n';
    gpx += '    <name>Jejak MAPATEK</name>\n';
    gpx += '    <trkseg>\n';
    points.forEach(p => {
        gpx += '      <trkpt lat="' + p[0] + '" lon="' + p[1] + '">\n';
        gpx += '        <ele>0</ele>\n';
        gpx += '        <time>' + now + '</time>\n';
        gpx += '      </trkpt>\n';
    });
    gpx += '    </trkseg>\n';
    gpx += '  </trk>\n';
    gpx += '</gpx>';
    return gpx;
}

function generateKML(points) {
    const coords = points.map(p => p[1] + ',' + p[0] + ',0').join(' ');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
           '<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
           '  <Document>\n' +
           '    <name>Jejak MAPATEK</name>\n' +
           '    <Placemark>\n' +
           '      <name>Jejak Pendakian</name>\n' +
           '      <LineString>\n' +
           '        <coordinates>' + coords + '</coordinates>\n' +
           '      </LineString>\n' +
           '    </Placemark>\n' +
           '  </Document>\n' +
           '</kml>';
}

// ================================================================
// 11. HAPUS JEJAK
// ================================================================
function clearTrack() {
    if (trackPoints.length === 0) {
        showToast('ℹ️ Tidak ada jejak untuk dihapus', 'warning');
        return;
    }

    if (confirm('Hapus semua jejak yang terekam?')) {
        trackPoints = [];
        totalDistance = 0;
        lastPosition = null;
        if (trackLine) {
            map.removeLayer(trackLine);
            trackLine = null;
        }
        document.getElementById('statsPanel').classList.remove('active');
        document.getElementById('gpsText').textContent = '📍 GPS Aktif';
        showToast('🗑️ Jejak dihapus', 'warning');
    }
}

// ================================================================
// 12. DRAW TOOLS (Gambar jalur manual)
// ================================================================
let drawActive = false;

function toggleDraw() {
    drawActive = !drawActive;
    if (drawActive) {
        if (!drawControl) {
            drawControl = new L.Control.Draw({
                position: 'topleft',
                draw: {
                    polyline: {
                        shapeOptions: {
                            color: '#f472b6',
                            weight: 4
                        }
                    },
                    polygon: false,
                    rectangle: false,
                    circle: false,
                    marker: true
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true
                }
            });
            map.addControl(drawControl);
        }
        showToast('✏️ Klik pada peta untuk menggambar jalur', 'success');
    } else {
        if (drawControl) {
            map.removeControl(drawControl);
            drawControl = null;
        }
        showToast('✏️ Mode gambar dinonaktifkan', 'warning');
    }
}

map.on(L.Draw.Event.CREATED, function(event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
    
    if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs();
        trackPoints = latlngs.map(ll => [ll.lat, ll.lng]);
        totalDistance = 0;
        for (let i = 1; i < trackPoints.length; i++) {
            totalDistance += distance(
                trackPoints[i-1][0], trackPoints[i-1][1],
                trackPoints[i][0], trackPoints[i][1]
            );
        }
        showToast('✅ Jalur digambar: ' + trackPoints.length + ' titik', 'success');
        document.getElementById('statsPanel').classList.add('active');
        document.getElementById('statPoints').textContent = trackPoints.length;
        document.getElementById('statDistance').textContent = formatDistance(totalDistance);
    }
});

map.on(L.Draw.Event.DELETED, function() {
    if (drawnItems.getLayers().length === 0) {
        trackPoints = [];
        document.getElementById('statsPanel').classList.remove('active');
    }
});

// ================================================================
// 13. RESET NORTH (Arah Utara)
// ================================================================
function resetNorth() {
    map.setView(map.getCenter(), map.getZoom());
    showToast('🧭 Arah Utara direset', 'success');
}

// ================================================================
// 14. FULLSCREEN
// ================================================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        showToast('⛶ Mode layar penuh', 'success');
    } else {
        document.exitFullscreen();
        showToast('⛶ Keluar layar penuh', 'warning');
    }
}

// ================================================================
// 15. TOAST NOTIFICATION
// ================================================================
let toastTimeout;

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ================================================================
// 16. KEYBOARD SHORTCUTS
// ================================================================
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.key.toLowerCase()) {
        case 'g': locateMe(); e.preventDefault(); break;
        case 'r': toggleTracking(); e.preventDefault(); break;
        case 's': saveTrack(); e.preventDefault(); break;
        case 'e': showExportModal(); e.preventDefault(); break;
        case 'c': clearTrack(); e.preventDefault(); break;
        case 'd': toggleDraw(); e.preventDefault(); break;
        case 'n': resetNorth(); e.preventDefault(); break;
        case 'f': toggleFullscreen(); e.preventDefault(); break;
    }
});

// ================================================================
// 17. LOAD SAMPLE ROUTE (Jalur Contoh)
// ================================================================
function loadSampleRoute() {
    const sampleRoute = {
        "type": "Feature",
        "properties": { "name": "Jalur Pendakian Gunung Merbabu" },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [110.4328, -7.4517],
                [110.4350, -7.4550],
                [110.4380, -7.4600],
                [110.4400, -7.4650],
                [110.4420, -7.4700],
                [110.4450, -7.4750],
                [110.4480, -7.4800],
                [110.4500, -7.4850]
            ]
        }
    };

    L.geoJSON(sampleRoute, {
        style: {
            color: '#ff7800',
            weight: 4,
            opacity: 0.7,
            dashArray: '8, 6'
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup('<b>🏔️ ' + feature.properties.name + '</b><br>Jalur pendakian populer');
        }
    }).addTo(map);
}

// ================================================================
// 18. SERVICE WORKER (Offline)
// ================================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(function(reg) {
                console.log('✅ Service Worker terdaftar!', reg);
            })
            .catch(function(err) {
                console.log('❌ Service Worker gagal:', err);
            });
    }
}

// ================================================================
// 19. INIT (Panggil semua fungsi saat halaman dimuat)
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    showToast('🗺️ Peta Pendakian MAPATEK siap!', 'success');
    setTimeout(locateMe, 1000);
    setTimeout(loadSampleRoute, 500);
    registerServiceWorker();
    
    console.log('🗺️ Peta Pendakian MAPATEK siap!');
    console.log('⌨️ Shortcut: [G] GPS [R] Rekam [S] Simpan [E] Export');
    console.log('⌨️ Shortcut: [C] Hapus [D] Gambar [N] Utara [F] Fullscreen');
});