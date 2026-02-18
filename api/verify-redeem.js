// api/verify-redeem.js
// 依赖：@vercel/kv
import { createClient } from '@vercel/kv';

// 初始化 Redis 客户端（环境变量由 Vercel 自动注入）
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// 下载链接映射表（resourceId -> 下载地址）
// 建议改为从数据库读取，此处为简化示例
const downloadUrls = {
  'design-pack-101': 'https://your-cdn.com/design-pack.zip',
  // 添加更多资源...
};

export default async function handler(req, res) {
  // 设置 CORS 头，允许前端访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 仅允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, resourceId } = req.body;

  // 参数校验
  if (!code || !resourceId) {
    return res.status(400).json({ success: false, message: '参数缺失' });
  }

  try {
    // 1. 从 Redis 获取该资源的有效兑换码列表（存储在 Set 中）
    const validCodes = await kv.smembers(`valid:${resourceId}`);
    if (!validCodes || !validCodes.includes(code)) {
      return res.status(400).json({ success: false, message: '无效的兑换码' });
    }

    // 2. 检查该兑换码是否已被使用
    const usedKey = `used:${code}`;
    const alreadyUsed = await kv.get(usedKey);
    if (alreadyUsed) {
      return res.status(400).json({ success: false, message: '兑换码已使用' });
    }

    // 3. 标记为已使用（设置过期时间，例如一年，单位：秒）
    await kv.set(usedKey, '1', { ex: 31536000 });

    // 4. 获取下载链接并返回
    const downloadUrl = downloadUrls[resourceId];
    if (!downloadUrl) {
      return res.status(500).json({ success: false, message: '资源下载地址未配置' });
    }

    return res.status(200).json({
      success: true,
      downloadUrl,
    });
  } catch (error) {
    console.error('Redis 操作失败:', error);
    return res.status(500).json({ success: false, message: '服务器内部错误，请稍后重试' });
  }
}