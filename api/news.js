import Parser from 'rss-parser';

export default async function handler(req, res) {
  // Vercel için CORS ayarları
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { topic } = req.query;
  const parser = new Parser();

  // RSS Kaynakları
  const feeds = {
    'latvia': 'https://www.euronews.com/rss/en/tag/latvia',
    'lithuania': 'https://www.euronews.com/rss/en/tag/lithuania',
    'estonia': 'https://www.euronews.com/rss/en/tag/estonia',
    'tech': 'https://www.euronews.com/rss/en/next/tech-news',
    'health': 'https://www.euronews.com/rss/en/health/health-news',
    'eu': 'https://www.euronews.com/rss/en/european-union'
  };

  try {
    const feedUrl = feeds[topic] || feeds['eu'];
    const feed = await parser.parseURL(feedUrl);

    const items = feed.items.slice(0, 12).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
