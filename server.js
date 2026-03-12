const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// 抓取微信文章元数据
async function fetchWechatMeta(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // 微信文章meta提取
    const title = $('h1.rich_media_title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  '无标题';
    
    const cover = $('meta[property="og:image"]').attr('content') || 
                  $('#js_content img').first().attr('data-src') ||
                  '';
    
    const desc = $('meta[property="og:description"]').attr('content') || 
                 $('#js_content').text().slice(0, 200) || 
                 '';
    
    return { title, cover, desc, success: true };
  } catch (error) {
    console.error('Fetch error:', error.message);
    return { title: '获取失败', cover: '', desc: '', success: false };
  }
}

// API: 批量抓取
app.post('/api/fetch-batch', async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'urls array required' });
  }
  
  const results = await Promise.all(
    urls.map(async (url) => {
      const meta = await fetchWechatMeta(url);
      return { url, ...meta };
    })
  );
  
  res.json({ results });
});

// API: 单条抓取
app.get('/api/fetch', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'url required' });
  }
  
  const meta = await fetchWechatMeta(url);
  res.json({ url, ...meta });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
