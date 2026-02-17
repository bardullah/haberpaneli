// api/news.js
const Parser = require('rss-parser');

module.exports = async (req, res) => {
  // 1. CORS Ayarları (Tarayıcının engellememesi için şart)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Tarayıcı önden "İzin var mı?" diye sorarsa "Evet" de.
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { topic } = req.query;
    
    // Parser'ı başlat (User-Agent ekleyerek engelleri aş)
    const parser = new Parser({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const feeds = {
      'latvia': 'https://www.euronews.com/rss/en/tag/latvia',
      'lithuania': 'https://www.euronews.com/rss/en/tag/lithuania',
      'estonia': 'https://www.euronews.com/rss/en/tag/estonia',
      'tech': 'https://www.euronews.com/rss/en/next/tech-news',
      'health': 'https://www.euronews.com/rss/en/health/health-news',
      'eu': 'https://www.euronews.com/rss/en/european-union'
    };

    // Eğer konu gelmezse veya listede yoksa varsayılan olarak 'eu' al
    const targetUrl = feeds[topic] || feeds['eu'];

    // RSS'i çek
    const feed = await parser.parseURL(targetUrl);

    // Veriyi temizle ve gönder
    const items = feed.items.slice(0, 12).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: 'Euronews'
    }));

    res.status(200).json(items);

  } catch (error) {
    // Hatayı sunucu konsoluna yaz (Vercel Logs'da görünür)
    console.error("API Hatası:", error);
    
    // Kullanıcıya JSON formatında hata dön
    res.status(500).json({ 
      error: 'Haberler çekilemedi', 
      details: error.message 
    });
  }
};
