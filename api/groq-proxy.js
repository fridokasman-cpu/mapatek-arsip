module.exports = async (req, res) => {
  // Log request
  console.log('📥 Request ke /api/groq-proxy');
  console.log('📤 Method:', req.method);
  console.log('📤 Model:', req.body?.model);

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validasi method
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Validasi body
  if (!req.body || !req.body.messages) {
    console.log('❌ Request body tidak valid');
    return res.status(400).json({ error: 'Request body harus memiliki messages' });
  }

  try {
    // Cek API Key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('❌ GROQ_API_KEY tidak ditemukan!');
      return res.status(500).json({ error: 'API Key tidak terkonfigurasi' });
    }

    console.log('📤 Mengirim ke Groq API...');

    // Kirim ke Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // Log response
    if (!response.ok) {
      console.error('❌ Error dari Groq:', {
        status: response.status,
        error: data
      });
    } else {
      console.log('✅ Success dari Groq');
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('💥 Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
