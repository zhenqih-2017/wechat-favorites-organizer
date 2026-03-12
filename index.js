const fs = require('fs');
const path = require('path');

/**
 * 解析微信收藏邮件内容
 * 支持多种格式：
 * 1. 【类型】标题\n链接
 * 2. 用户名 时间\n[标题 : 链接]
 */
function parseFavorites(content) {
  const items = [];
  
  // 格式1：【类型】标题 + 换行 + 链接
  const regex1 = /【([^】]+)】([^\n]+)\n([^\n]+)/g;
  let match;
  while ((match = regex1.exec(content)) !== null) {
    const type = match[1].trim();
    const title = match[2].trim();
    const url = match[3].trim();
    
    if (url.startsWith('http')) {
      items.push({
        type: type,
        title: title,
        url: url,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
  
  // 格式2：用户名 时间\n[标题 : 链接]
  const regex2 = /\[([^:]+):\s*(https?:\/\/[^\]]+)\]/g;
  while ((match = regex2.exec(content)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();
    
    // 根据标题关键词判断类型
    let type = '链接';
    if (title.includes('视频') || url.includes('xiaohongshu')) type = '视频';
    else if (title.includes('文章') || title.includes('分享')) type = '文章';
    else if (title.includes('笔记')) type = '笔记';
    
    items.push({
      type: type,
      title: title,
      url: url,
      date: new Date().toISOString().split('T')[0]
    });
  }
  
  // 去重
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

/**
 * AI分类打标签（增强版）
 */
function classifyItems(items) {
  const rules = [
    { category: 'OpenClaw', keywords: ['openclaw', 'OpenClaw', '龙虾', 'miclaw', 'arkclaw', '养虾', '小龙虾', 'claw', 'Claw'] },
    { category: 'AI工具', keywords: ['NanoBanana', 'nano-banana', 'Seedance', 'Gemini', 'Claude', 'GPT', 'DeepSeek', 'AI作图', 'AI生图', '豆包', 'Lovart', 'Skills', 'skill', '模型', '生图', 'AI创作', 'AI视频', '即梦', '扣子', 'Coze'] },
    { category: 'AI创业', keywords: ['一人公司', '独立开发', 'AI创业', '年入', '月入', '赚钱', '变现', '创业', '副业', '单人', 'MRR'] },
    { category: 'AI资讯', keywords: ['发布', '上线', '来了', '更新', '推出', '吴恩达', '达沃斯', '大逆转', '掀桌子', '血洗', '杀疯了', '央视', 'GitHub全球榜'] },
    { category: '内容创作', keywords: ['小红书', '爆款', '播放', '漫剧', '视频', '涨粉', '复刻', '教程', '创作方向', '菜谱', '转场', '贴纸', '文案', '运营'] },
    { category: '职场/成长', keywords: ['转型', '招聘', '职场', '学习', '日记', '认知', '成长', '建议', '绩点', '保研', '青年', '逆袭', 'token', 'Token'] },
    { category: '商业洞察', keywords: ['房价', '市场', '商家', '赚', '公司', '员工', '炫富', '千亿', '生意', '小店', '客源', '赛道', '技术'] },
    { category: '技术/开发', keywords: ['开源', '部署', '编程', '代码', 'GitHub', 'Claude Code', 'git', '开发者', '程序员', '工作流'] },
  ];

  return items.map(item => {
    const text = item.title.toLowerCase();
    let category = '其他';
    let tags = [];

    for (const rule of rules) {
      for (const kw of rule.keywords) {
        if (item.title.includes(kw)) {
          category = rule.category;
          tags.push(kw);
          break;
        }
      }
      if (tags.length > 0) break;
    }

    // 根据来源平台补充标签
    if (item.url.includes('xiaohongshu')) {
      tags.push('小红书');
      item.type = '视频';
    } else if (item.url.includes('mp.weixin.qq.com')) {
      item.type = '公众号';
    } else if (item.url.includes('feishu')) {
      item.type = '飞书';
      tags.push('飞书');
    } else if (item.url.includes('view.inews.qq.com') || item.url.includes('mbd.baidu.com')) {
      item.type = '资讯';
    }

    return { ...item, category, tags: tags.length > 0 ? [...new Set(tags)] : ['其他'] };
  });
}

/**
 * 生成统计数据
 */
function generateStats(items) {
  const stats = {
    total: items.length,
    byType: {},
    byCategory: {},
    byTag: {}
  };
  
  items.forEach(item => {
    // 按类型统计
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    
    // 按分类统计
    stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
    
    // 按标签统计
    item.tags.forEach(tag => {
      stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
    });
  });
  
  return stats;
}

/**
 * 生成HTML网页
 */
function generateHTML(items, stats) {
  const itemsJSON = JSON.stringify(items, null, 2);
  const statsJSON = JSON.stringify(stats, null, 2);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>微信收藏整理 - ${new Date().toLocaleDateString('zh-CN')}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header h1 { color: #333; font-size: 28px; margin-bottom: 10px; }
    .header p { color: #666; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .stat-card h3 { color: #667eea; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
    .stat-value { font-size: 36px; font-weight: bold; color: #333; }
    .filters {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .filter-group { margin-bottom: 15px; }
    .filter-group label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
    .filter-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
    .filter-btn {
      padding: 6px 14px;
      border: 1px solid #ddd;
      border-radius: 20px;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 13px;
    }
    .filter-btn:hover, .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    .search-box {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }
    .item-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: block;
    }
    .item-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    .item-type {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .type-文章 { background: #e3f2fd; color: #1976d2; }
    .type-视频 { background: #fce4ec; color: #c2185b; }
    .type-笔记 { background: #f3e5f5; color: #7b1fa2; }
    .type-链接 { background: #e8f5e9; color: #388e3c; }
    .item-title { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 10px; line-height: 1.4; }
    .item-category { display: inline-block; padding: 3px 10px; background: #667eea; color: white; border-radius: 12px; font-size: 12px; margin-right: 8px; }
    .item-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .item-tag { padding: 2px 8px; background: #f5f5f5; border-radius: 4px; font-size: 11px; color: #666; }
    .chart-container { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 微信收藏整理</h1>
      <p>共整理 ${stats.total} 条收藏，生成时间：${new Date().toLocaleString('zh-CN')}</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>总收藏数</h3>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <h3>分类数量</h3>
        <div class="stat-value">${Object.keys(stats.byCategory).length}</div>
      </div>
      <div class="stat-card">
        <h3>标签数量</h3>
        <div class="stat-value">${Object.keys(stats.byTag).length}</div>
      </div>
    </div>
    
    <div class="chart-container">
      <canvas id="categoryChart" height="100"></canvas>
    </div>
    
    <div class="filters">
      <input type="text" class="search-box" id="searchBox" placeholder="🔍 搜索标题、标签...">
      
      <div class="filter-group">
        <label>按类型筛选</label>
        <div class="filter-buttons" id="typeFilters"></div>
      </div>
      
      <div class="filter-group">
        <label>按分类筛选</label>
        <div class="filter-buttons" id="categoryFilters"></div>
      </div>
    </div>
    
    <div class="items-grid" id="itemsGrid"></div>
  </div>
  
  <script>
    const items = ${itemsJSON};
    const stats = ${statsJSON};
    
    // 渲染类型筛选按钮
    const typeFilters = document.getElementById('typeFilters');
    Object.keys(stats.byType).forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = type + ' (' + stats.byType[type] + ')';
      btn.onclick = () => toggleFilter(btn, 'type', type);
      typeFilters.appendChild(btn);
    });
    
    // 渲染分类筛选按钮
    const categoryFilters = document.getElementById('categoryFilters');
    Object.keys(stats.byCategory).forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = cat + ' (' + stats.byCategory[cat] + ')';
      btn.onclick = () => toggleFilter(btn, 'category', cat);
      categoryFilters.appendChild(btn);
    });
    
    // 渲染收藏卡片
    function renderItems(filteredItems) {
      const grid = document.getElementById('itemsGrid');
      grid.innerHTML = '';
      
      filteredItems.forEach(item => {
        const card = document.createElement('a');
        card.className = 'item-card';
        card.href = item.url;
        card.target = '_blank';
        card.dataset.type = item.type;
        card.dataset.category = item.category;
        
        card.innerHTML = \`
          <span class="item-type type-\${item.type}">\${item.type}</span>
          <div class="item-title">\${item.title}</div>
          <span class="item-category">\${item.category}</span>
          <div class="item-tags">
            \${item.tags.map(tag => '<span class="item-tag">' + tag + '</span>').join('')}
          </div>
        \`;
        
        grid.appendChild(card);
      });
    }
    
    // 筛选状态
    let activeFilters = { type: null, category: null };
    
    function toggleFilter(btn, filterType, value) {
      const buttons = btn.parentElement.querySelectorAll('.filter-btn');
      
      if (activeFilters[filterType] === value) {
        activeFilters[filterType] = null;
        btn.classList.remove('active');
      } else {
        buttons.forEach(b => b.classList.remove('active'));
        activeFilters[filterType] = value;
        btn.classList.add('active');
      }
      
      applyFilters();
    }
    
    function applyFilters() {
      let filtered = items;
      
      if (activeFilters.type) {
        filtered = filtered.filter(i => i.type === activeFilters.type);
      }
      if (activeFilters.category) {
        filtered = filtered.filter(i => i.category === activeFilters.category);
      }
      
      const searchTerm = document.getElementById('searchBox').value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(i => 
          i.title.toLowerCase().includes(searchTerm) ||
          i.tags.some(t => t.toLowerCase().includes(searchTerm))
        );
      }
      
      renderItems(filtered);
    }
    
    // 搜索功能
    document.getElementById('searchBox').addEventListener('input', applyFilters);
    
    // 渲染分类图表
    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(stats.byCategory),
        datasets: [{
          data: Object.values(stats.byCategory),
          backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: '收藏分类分布' }
        }
      }
    });
    
    // 初始渲染
    renderItems(items);
  </script>
</body>
</html>`;
}

/**
 * 主函数
 */
async function organizeFavorites(params) {
  try {
    const content = params.content;
    
    if (!content || content.trim().length === 0) {
      return { success: false, error: '请提供微信收藏内容' };
    }
    
    // 1. 解析内容
    const items = parseFavorites(content);
    
    if (items.length === 0) {
      return { success: false, error: '未解析到任何收藏内容，请检查格式是否正确' };
    }
    
    // 2. AI分类打标签
    const classifiedItems = classifyItems(items);
    
    // 3. 生成统计
    const stats = generateStats(classifiedItems);
    
    // 4. 生成HTML
    const html = generateHTML(classifiedItems, stats);
    
    // 5. 保存文件
    const outputPath = path.join(process.cwd(), `wechat-favorites-${Date.now()}.html`);
    fs.writeFileSync(outputPath, html);
    
    return {
      success: true,
      message: `成功整理 ${stats.total} 条收藏`,
      stats: stats,
      outputPath: outputPath,
      preview: classifiedItems.slice(0, 3)
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { organizeFavorites };

// 如果直接运行
if (require.main === module) {
  const testContent = `【文章】如何学习Python编程
https://mp.weixin.qq.com/s/example1

【视频】OpenClaw使用教程
https://mp.weixin.qq.com/s/example2

【笔记】产品需求文档模板
https://mp.weixin.qq.com/s/example3`;

  organizeFavorites({ content: testContent }).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
}
