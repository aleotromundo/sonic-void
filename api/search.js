// api/search.js
export default async function handler(req, res) {
  const { query, type } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Falta el término de búsqueda' });
  }

  try {
    // --- BUSQUEDA EN YOUTUBE (Lee la clave de Vercel) ---
    if (type === 'youtube') {
      const apiKey = process.env.YOUTUBE_API_KEY; 
      
      if (!apiKey) {
        return res.status(500).json({ error: 'Falta la clave YOUTUBE_API_KEY en Vercel' });
      }

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&q=${encodeURIComponent(query)}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return res.status(200).json(data);
    } 
    
    // --- BUSQUEDA EN OPENVERSE (Lee las claves de Vercel) ---
    else if (type === 'openverse') {
      const clientId = process.env.OPENVERSE_CLIENT_ID;
      const clientSecret = process.env.OPENVERSE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Faltan credenciales de Openverse en Vercel' });
      }

      // 1. Obtener Token
      const tokenResp = await fetch('https://api.openverse.org/v1/auth_tokens/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        })
      });
      
      const tokenData = await tokenResp.json();
      const token = tokenData.access_token;

      // 2. Buscar Audio
      const searchUrl = `https://api.openverse.org/v1/audio/?q=${encodeURIComponent(query)}&page_size=20`;
      const searchResp = await fetch(searchUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const searchData = await searchResp.json();
      return res.status(200).json(searchData);
    }

    return res.status(400).json({ error: 'Tipo de búsqueda inválido' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}