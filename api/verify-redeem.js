// 部署到 Vercel 的云函数

// 预定义的有效兑换码（按资源 ID 分组）
const validCodes = {
  'design-pack-101': ['R20250321ABCDEF', 'R20250322GHIJKL'],
  'ai-model-202': ['AIFREE2025XYZ', 'AIPRO123456']
};

// 资源对应的下载链接
const downloadUrls = {
  'design-pack-101': 'https://your-cdn.com/design-pack.zip',
  'ai-model-202': 'https://your-cdn.com/ai-model.zip'
};

// 已使用的兑换码（生产环境请用数据库）
const usedCodes = new Set();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { code, resourceId } = req.body;
  if (!code || !resourceId) return res.status(400).json({ success: false, message: '参数缺失' });

  const validList = validCodes[resourceId];
  if (!validList) return res.status(400).json({ success: false, message: '无效的资源ID' });

  if (!validList.includes(code)) return res.status(400).json({ success: false, message: '无效的兑换码' });

  if (usedCodes.has(code)) return res.status(400).json({ success: false, message: '兑换码已使用' });

  usedCodes.add(code);
  const downloadUrl = downloadUrls[resourceId] || null;
  return res.json({ success: true, downloadUrl });
}    return res.status(400).json({ success: false, message: '无效的资源 ID' });
  }

  // 检查兑换码是否在合法列表中
  if (!validCodes[resourceId].includes(code)) {
    return res.status(400).json({ success: false, message: '无效的兑换码' });
  }

  // 检查兑换码是否已被使用
  const usedKey = `redeem:used:${resourceId}`;
  const alreadyUsed = await kv.sismember(usedKey, code);
  if (alreadyUsed) {
    return res.status(400).json({ success: false, message: '兑换码已使用' });
  }

  // 标记为已使用
  await kv.sadd(usedKey, code);

  // 返回下载链接
  const downloadUrl = downloadUrls[resourceId] || null;
  return res.json({ success: true, downloadUrl });
}
