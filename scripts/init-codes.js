// scripts/init-codes.js
// 运行前需设置环境变量 KV_REST_API_URL 和 KV_REST_API_TOKEN
import { createClient } from '@vercel/kv';

const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// 配置：为每个资源定义有效兑换码列表
const resourceCodes = {
  'design-pack-101': [
    'R20250321ABCDEF',
    'R20250322GHIJKL',
    'R20250323MNOPQR',
  ],
  // 可添加更多资源...
};

async function init() {
  for (const [resourceId, codes] of Object.entries(resourceCodes)) {
    const key = `valid:${resourceId}`;
    // 清空原有数据（可选）
    await kv.del(key);
    // 批量添加兑换码到 Set
    await kv.sadd(key, ...codes);
    console.log(`资源 ${resourceId} 已初始化 ${codes.length} 个兑换码`);
  }
  process.exit(0);
}

init().catch((err) => {
  console.error('初始化失败:', err);
  process.exit(1);
});