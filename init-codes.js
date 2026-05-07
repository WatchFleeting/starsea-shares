// ============================================================
// 初始化兑换码脚本
// 用法：node scripts/init-codes.js
// 环境变量：
//   - KV_REST_API_URL
//   - KV_REST_API_TOKEN
// ============================================================

import { createClient } from '@vercel/kv';

// 初始化 KV 客户端
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
    'ai-model-202': [
        'AIFREE2025XYZ',
        'AIPRO123456',
    ],
    // 在此添加更多资源...
};

// 可选：定义下载链接（也可直接在云函数中维护）
const downloadUrls = {
    'design-pack-101': 'https://your-cdn.com/design-pack.zip',
    'ai-model-202': 'https://your-cdn.com/ai-model.zip',
};

async function init() {
    console.log('🚀 开始初始化兑换码到 Vercel KV...\n');

    for (const [resourceId, codes] of Object.entries(resourceCodes)) {
        const validKey = `valid:${resourceId}`;
        
        // 清空原有数据（谨慎操作）
        console.log(`🗑️  清空 ${validKey} 中的旧数据...`);
        await kv.del(validKey);
        
        // 批量添加兑换码到 Set
        if (codes.length > 0) {
            console.log(`📥 导入 ${codes.length} 个兑换码到 ${validKey}`);
            await kv.sadd(validKey, ...codes);
        }
        
        // 可选：同时存储下载链接（如果云函数从这里读取）
        // const urlKey = `url:${resourceId}`;
        // await kv.set(urlKey, downloadUrls[resourceId] || '');
        
        console.log(`✅ 资源 ${resourceId} 初始化完成\n`);
    }

    console.log('🎉 所有兑换码初始化完成！');
    process.exit(0);
}

// 执行
init().catch((err) => {
    console.error('❌ 初始化失败:', err);
    process.exit(1);
});
