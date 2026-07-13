// ================================================================
// CONFIG — API Keys (JANGAN COMMIT FILE INI!)
// ================================================================
// File ini akan diabaikan oleh .gitignore

const GEMINI_API_KEY = "AIzaSyC1YOTI61Wc7hdceu-r-ukDTMROjq7a1TM";
const WEATHER_API_KEY = "41cdf78032a3fc2031fcdc09192f0f19"; // Sudah ada di data.js

// Ekspor ke global agar bisa diakses di file lain
window.GEMINI_API_KEY = GEMINI_API_KEY;
window.WEATHER_API_KEY = WEATHER_API_KEY;