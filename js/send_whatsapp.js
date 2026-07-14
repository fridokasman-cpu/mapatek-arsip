// ================================================================
// Kirim WhatsApp via Pipedream (untuk GitHub Pages)
// ================================================================

const PIPEDREAM_URL = "https://0d250388bd18ad0736c9dc02c8bedcce.m.pipedream.net/"; // Ganti dengan URL Anda
const DEFAULT_TARGET = "https://chat.whatsapp.com/DUccwgqYT0pEVgapGgPPV4?s=cl&p=i&ilr=4&amv=0"; // ID grup atau nomor HP default

/**
 * Kirim pesan WhatsApp via Pipedream
 * @param {string} target - ID Grup atau nomor HP (contoh: 'grup_xxxxx' atau '6281234567890')
 * @param {string} message - Isi pesan
 */
async function sendWhatsApp(target, message) {
    if (!target || !message) {
        console.error("Target dan pesan harus diisi");
        return { status: 'error', message: 'Target dan pesan harus diisi' };
    }

    try {
        const response = await fetch(PIPEDREAM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ target, message })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Pesan berhasil dikirim:", data);
            return { status: 'success', data };
        } else {
            console.error("❌ Gagal mengirim:", data);
            return { status: 'error', message: data.reason || 'Gagal mengirim pesan' };
        }
    } catch (error) {
        console.error("❌ Error:", error);
        return { status: 'error', message: error.message };
    }
}

/**
 * Kirim pengumuman ke grup default
 * @param {string} message - Isi pengumuman
 */
async function kirimPengumumanKeGrup(message) {
    return sendWhatsApp(DEFAULT_TARGET, message);
}

/**
 * Kirim pesan pribadi ke nomor HP
 * @param {string} phoneNumber - Nomor HP (contoh: 6281234567890)
 * @param {string} message - Isi pesan
 */
async function kirimPesanPribadi(phoneNumber, message) {
    return sendWhatsApp(phoneNumber, message);
}

// Ekspor ke global agar bisa dipanggil dari HTML
window.sendWhatsApp = sendWhatsApp;
window.kirimPengumumanKeGrup = kirimPengumumanKeGrup;
window.kirimPesanPribadi = kirimPesanPribadi;