// api/news.js
import Parser from 'rss-parser';

export default async function handler(req, res) {
  // CORS ayarları (Her yerden erişime izin ver)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { topic } = req.query;
  const parser = new Parser();

  // RSS Kaynakları (İngilizce Euronews)
  const feeds = {
    'latvia': 'https://www.euronews.com/rss/en/tag/latvia',
    'lithuania': 'https://www.euronews.com/rss/en/tag/lithuania',
    'estonia': 'https://www.euronews.com/rss/en/tag/estonia',
    'tech': 'https://www.euronews.com/rss/en/next/tech-news',
    'health': 'https://www.euronews.com/rss/en/health/health-news',
    'eu': 'https://www.euronews.com/rss/en/european-union'
  };

  try {
    const feedUrl = feeds[topic];
    if (!feedUrl) {
      return res.status(400).json({ error: 'Geçersiz konu' });
    }

    const feed = await parser.parseURL(feedUrl);
    
    // Veriyi sadeleştirip gönderelim
    const items = feed.items.slice(0, 12).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      source: 'Euronews'
    }));

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Haber çekilemedi', details: error.message });
  }
}