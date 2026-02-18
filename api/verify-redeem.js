// api/verify-redeem.js
import { createClient } from '@vercel/kv';

// 初始化 Redis 客户端（从环境变量读取连接信息）
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// 预定义的兑换码列表（实际可从数据库读取，此处简化）
const validCodes = {
  'design-pack-101': [
    'R20250321ABCDEF',
    'R20250322GHIJKL',
  ],
};

const downloadUrls = {
  'design-pack-101': 'https://your-cdn.com/design-pack.zip',
};

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, resourceId } = req.body;
  if (!code || !resourceId) {
    return res.status(400).json({ success: false, message: '参数缺失' });
  }

  // 1. 验证兑换码是否有效（属于该资源）
  const validList = validCodes[resourceId];
  if (!validList || !validList.includes(code)) {
    return res.status(400).json({ success: false, message: '无效的兑换码' });
  }

  // 2. 检查是否已被使用（在 Redis 中存储一个键，例如 `used:code:xxx`）
  const usedKey = `used:${code}`;
  const alreadyUsed = await kv.get(usedKey);
  if (alreadyUsed) {
    return res.status(400).json({ success: false, message: '兑换码已使用' });
  }

  // 3. 标记为已使用（设置过期时间，例如一年）
  await kv.set(usedKey, '1', { ex: 31536000 }); // 单位：秒

  // 4. 返回下载链接
  return res.status(200).json({
    success: true,
    downloadUrl: downloadUrls[resourceId] || null,
  });
}
