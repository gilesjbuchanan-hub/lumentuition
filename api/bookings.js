const AT_BASE  = 'app0T0Lpf9jApuSDN';
const AT_TABLE = 'tbldWStqAwcywUvGg';
const AT_URL   = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.AIRTABLE_TOKEN;
  if (!token) return res.status(500).json({ error: 'Missing AIRTABLE_TOKEN' });

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  if (req.method === 'GET') {
    const { tutorId } = req.query;
    const formula = encodeURIComponent(`{tutor_id}=${tutorId}`);
    const r = await fetch(`${AT_URL}?filterByFormula=${formula}`, { headers });
    const data = await r.json();
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const r = await fetch(AT_URL, { method: 'POST', headers, body: JSON.stringify(req.body) });
    const data = await r.json();
    return res.status(200).json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
