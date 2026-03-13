// 从飞书文档提取的微信收藏链接
const favoritesData = [
  { title: "3D领域的NanoBanana也来了，万物皆可用嘴操控", url: "https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647679204&idx=1&sn=3ed3b69b86b52f1cbd16b5b8758a6231", category: "AI工具", tags: ["NanoBanana", "3D"], date: "2026-01-26" },
  { title: "阿川同学的文字分享", url: "https://mp.weixin.qq.com/s?scene=1&__biz=Mzg5MjUzOTA0OA==&mid=2247507620", category: "其他", tags: ["分享"], date: "2026-01-26" },
  { title: "加班到凌晨，老板还说我做的设计一股"AI味"，怎么去除啊？", url: "https://mp.weixin.qq.com/s?__biz=MzI1NzMwNDA0Mg==&mid=2247530653", category: "职场/成长", tags: ["设计", "AI"], date: "2026-01-26" },
  { title: "投资回报最高的项目", url: "https://mp.weixin.qq.com/s?__biz=MzIxMTI1MjAwNw==&mid=2650946815", category: "商业洞察", tags: ["投资"], date: "2026-01-28" },
  { title: "阶跃AI最新的Skill玩法，用完直接头皮发麻", url: "https://www.xiaohongshu.com/discovery/item/6979a789000000001a0264bd", category: "AI工具", tags: ["阶跃AI", "Skill"], date: "2026-01-29" },
  { title: "越来越兴奋了，终于看到未来AI创作方向了", url: "https://mp.weixin.qq.com/s?__biz=MzA3Mzk4MzgyNw==&mid=2650711348", category: "AI创业", tags: ["AI创作"], date: "2026-01-29" },
  { title: "扣子工作流：一键批量生成火爆的小红书菜谱笔记图文", url: "https://mp.weixin.qq.com/s?__biz=MzIxODM4MjIzMw==&mid=2247485725", category: "AI工具", tags: ["扣子", "小红书"], date: "2026-01-29" },
  { title: "达沃斯现场｜吴恩达：门槛没了，AI 创业只剩 3 种能力", url: "https://mp.weixin.qq.com/s?__biz=MzYyNTQwNzIwNA==&mid=2247496978", category: "AI创业", tags: ["吴恩达", "创业"], date: "2026-01-29" },
  { title: "我给自己的QLab品牌，用Lovart Skills设计了全套视觉", url: "https://mp.weixin.qq.com/s?__biz=MzU2Njg0OTEyNQ==&mid=2247491257", category: "AI工具", tags: ["Lovart", "设计"], date: "2026-02-08" },
  { title: "200万赞涨粉15万！AI超现实风景千万爆款玩法", url: "https://mp.weixin.qq.com/s?__biz=Mzk1NzQ3NTkwMg==&mid=2247496740", category: "内容创作", tags: ["AI", "爆款"], date: "2026-02-08" },
  { title: "杀疯了：10天，Claude"血洗华尔街"始末", url: "https://mp.weixin.qq.com/s?__biz=MjM5NjAxOTU4MA==&mid=3009366228", category: "AI资讯", tags: ["Claude", "华尔街"], date: "2026-02-09" },
  { title: "年轻人迷上"怪味"，有商家年赚12亿", url: "https://view.inews.qq.com/w/20260210A02L0Y00", category: "商业洞察", tags: ["商业", "趋势"], date: "2026-02-10" },
  { title: "阿里掀桌子了！实测效果媲美 NanoBanana Pro", url: "https://mp.weixin.qq.com/s?__biz=MzI4MjUyNTg1OQ==&mid=2247566095", category: "AI工具", tags: ["阿里", "生图"], date: "2026-02-11" },
  { title: "上央视了", url: "https://mp.weixin.qq.com/s?__biz=MjM5NTIzMTY2MQ==&mid=2650441554", category: "AI资讯", tags: ["OpenClaw", "央视"], date: "2026-02-14" },
  { title: ""一人公司"，何以成为可能？", url: "https://mp.weixin.qq.com/s?__biz=MTI0MDU3NDYwMQ==&mid=2657890726", category: "AI创业", tags: ["一人公司"], date: "2026-02-15" },
  { title: "全网播放量超9亿，丽萍的"胡闹厨房"", url: "https://mp.weixin.qq.com/s?__biz=MzI2NTY4MDg1NA==&mid=2247845014", category: "内容创作", tags: ["视频", "爆款"], date: "2026-02-16" },
  { title: "实测即梦Seedance2.0：一条近亿播放的YouTube真人视频，我用10块钱成本复刻了", url: "https://mp.weixin.qq.com/s?__biz=MzE5MTA4MDQyMA==&mid=2247483903", category: "AI工具", tags: ["Seedance", "视频"], date: "2026-02-16" },
  { title: "《7天精通 Seedance 2.0实操手册》", url: "https://mp.weixin.qq.com/s?__biz=MjM5NjE3NjYzMw==&mid=2247495754", category: "AI工具", tags: ["Seedance", "教程"], date: "2026-02-16" },
  { title: "淘宝上卖9块9的DeepSeek，让我看到了被折叠的魔幻世界", url: "https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647675112", category: "商业洞察", tags: ["DeepSeek", "商业"], date: "2026-02-27" },
  { title: "重磅更新！Nano Banana 2 来了", url: "https://mp.weixin.qq.com/s?__biz=MjM5NTIzMTY2MQ==&mid=2650441697", category: "AI工具", tags: ["NanoBanana", "更新"], date: "2026-02-27" },
  { title: "玩OpenClaw真能赚到钱？赛博🦞24小时打工养活你！", url: "https://mp.weixin.qq.com/s?__biz=MzkzOTUwNzM0Mw==&mid=2247484562", category: "OpenClaw", tags: ["变现", "案例"], date: "2026-02-27" },
  { title: "又快又便宜的Nanobanana2上线了，一次性出100张短剧图", url: "https://mp.weixin.qq.com/s?__biz=MzkxMjY2NzgwOA==&mid=2247492076", category: "AI工具", tags: ["NanoBanana", "短剧"], date: "2026-02-28" },
  { title: "用了两周OpenClaw后，决定今年不招人类员工了", url: "https://mp.weixin.qq.com/s?__biz=MzI1MTUxNzgxMA==&mid=2247501061", category: "OpenClaw", tags: ["案例", "团队"], date: "2026-02-28" },
  { title: "三个月一人公司月入近2万：方法蠢到我不好意思说", url: "https://mp.weixin.qq.com/s?__biz=MzkzNzg4MDA1MA==&mid=2247484001", category: "AI创业", tags: ["一人公司", "变现"], date: "2026-02-28" },
  { title: "打不过Seedance 2.0就加入，聊聊贾樟柯新AI广告", url: "https://mp.weixin.qq.com/s?__biz=MzA4NTQzNTMwOA==&mid=2651622436", category: "AI工具", tags: ["Seedance", "广告"], date: "2026-03-01" },
  { title: "《从「尝鲜」到「出片」：Seedance 2.0 深度玩家必备工具包》", url: "https://mp.weixin.qq.com/s?__biz=MzkxOTAxMzUxOA==&mid=2247483805", category: "AI工具", tags: ["Seedance", "教程"], date: "2026-03-02" },
  { title: "我让OpenClaw帮我运营3个小红书号，它比我自己发的还火", url: "https://mp.weixin.qq.com/s?__biz=MzkzNzc1NDc3Mg==&mid=2247485774", category: "OpenClaw", tags: ["运营", "小红书"], date: "2026-03-02" },
  { title: "AI时代，为什么我极力推荐你开始写日记？", url: "https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647680238", category: "职场/成长", tags: ["日记", "AI"], date: "2026-03-02" },
  { title: "字节杀疯了！豆包 Seed 2.0 专家模式已上线", url: "https://mp.weixin.qq.com/s?__biz=MzI4MjUyNTg1OQ==&mid=2247566719", category: "AI工具", tags: ["豆包", "Seed"], date: "2026-03-02" },
  { title: "18岁印度少年周末搞了个网站，3天收入破5万——SimpleClaw", url: "https://mp.weixin.qq.com/s?__biz=MzAxMzg0MzMxNg==&mid=2650966400", category: "OpenClaw", tags: ["案例", "变现"], date: "2026-03-02" },
  { title: "卸载 OpenClaw！拥抱NanoClaw", url: "https://mp.weixin.qq.com/s?__biz=MzIzMzQyMzUzNw==&mid=2247513818", category: "OpenClaw", tags: ["工具对比", "NanoClaw"], date: "2026-03-02" },
  { title: "我用Seedance 2.0 10元复刻亿播视频，两天做到百万播放", url: "https://mp.weixin.qq.com/s?__biz=Mzg5MTkwNjUxNQ==&mid=2247648072", category: "AI工具", tags: ["Seedance", "案例"], date: "2026-03-02" },
  { title: "如何3分钟部署你自己的openclaw", url: "https://mp.weixin.qq.com/s?__biz=MzA3Mzk4MzgyNw==&mid=2650711645", category: "OpenClaw", tags: ["部署", "教程"], date: "2026-03-03" },
  { title: "我用 OpenClaw 搞了家16人的公司：全员AI，24小时无休！", url: "https://mp.weixin.qq.com/s?__biz=MzA5MTcxMjUzMw==&mid=2658720317", category: "OpenClaw", tags: ["案例", "团队"], date: "2026-03-03" },
  { title: "为什么很多人的 OpenClaw 都用错了？", url: "https://mp.weixin.qq.com/s?__biz=MjM5NTIzMTY2MQ==&mid=2650441771", category: "OpenClaw", tags: ["认知", "方法论"], date: "2026-03-03" },
  { title: "我花499找人上门安装OpenClaw，看到了AI时代最魔幻的一幕", url: "https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647680353", category: "OpenClaw", tags: ["部署", "服务"], date: "2026-03-04" },
  { title: "把 OpenClaw 装在本地电脑 24 小时工作，6000 字零基础上手教程", url: "https://mp.weixin.qq.com/s?__biz=MjM5NTIzMTY2MQ==&mid=2650441906", category: "OpenClaw", tags: ["部署", "教程"], date: "2026-03-11" },
  { title: "凌晨4点，我对OpenClaw说"我去睡了，你继续干"，中午醒来我惊呆了", url: "https://mp.weixin.qq.com/s?__biz=MzE5MTA4MDQyMA==&mid=2247484021", category: "OpenClaw", tags: ["案例", "自动化"], date: "2026-03-10" },
  { title: "8点1氪：宁德时代日赚近2亿；二手平台出现OpenClaw上门卸载服务", url: "https://mp.weixin.qq.com/s?__biz=MzI2NDk5NzA0Mw==&mid=2248880944", category: "OpenClaw", tags: ["资讯", "服务"], date: "2026-03-11" },
  { title: "小白养虾指南：火山的ArkClaw把养虾的门槛打到地板了", url: "https://mp.weixin.qq.com/s?__biz=MzI1MTUxNzgxMA==&mid=2247501535", category: "OpenClaw", tags: ["教程", "ArkClaw"], date: "2026-03-11" },
  { title: "笑死？PUA Skills，让Agent极致工作，Github已2.3k star", url: "https://mp.weixin.qq.com/s?__biz=Mzg5MTU1NTE1OQ==&mid=2247498663", category: "AI工具", tags: ["Skills", "GitHub"], date: "2026-03-11" }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
  module.exports = favoritesData;
}
