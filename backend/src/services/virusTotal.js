const axios = require("axios");

const API_KEY = process.env.VIRUSTOTAL_API_KEY;
const BASE_URL = "https://www.virustotal.com/api/v3";

async function scanUrl(url) {
  if (!API_KEY) {
    return { error: "VirusTotal API key not configured", positives: 0, total: 0 };
  }

  try {
    const submitRes = await axios.post(
      `${BASE_URL}/urls`,
      new URLSearchParams({ url }),
      { headers: { "x-apikey": API_KEY, "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const analysisId = submitRes.data.data.id;

    await new Promise((r) => setTimeout(r, 3000));

    const analysisRes = await axios.get(`${BASE_URL}/analyses/${analysisId}`, {
      headers: { "x-apikey": API_KEY },
    });

    const stats = analysisRes.data.data.attributes.stats;
    return {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      total: stats.malicious + stats.suspicious + stats.harmless + stats.undetected,
    };
  } catch (err) {
    console.error("VirusTotal API error:", err.message);
    return { error: "VirusTotal scan failed", malicious: 0, suspicious: 0, total: 0 };
  }
}

module.exports = { scanUrl };
