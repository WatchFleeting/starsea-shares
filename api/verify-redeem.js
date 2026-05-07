// ============================================================
// 兑换码验证云函数 (Vercel Serverless Function)
// 部署路径：api/verify-redeem.js
// 环境变量要求：
//   - KV_REST_API_URL
//   - KV_REST_API_TOKEN
// 若无 KV 配置，将回退到内存存储（仅开发测试用，生产不推荐）
// ============================================================

import { createClient } from '@vercel/kv';

// 初始化 KV 客户端
let kv;
try {
    kv = createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
    });
} catch (error) {
    console.error('KV 初始化失败，将使用内存存储（仅用于测试）', error);
    kv = null;
}

// 内存回退存储（仅当 KV 不可用时使用，重启后数据丢失）
const memoryValidCodes = {
    'design-pack-101': ['R20250321ABCDEF', 'R20250322GHIJKL'],
    'ai-model-202': ['AIFREE2025XYZ', 'AIPRO123456']
};
const memoryUsedCodes = new Set();
const memoryDownloadUrls = {
    'design-pack-101': 'https://your-cdn.com/design-pack.zip',
    'ai-model-202': 'https://your-cdn.com/ai-model.zip'
};

// ==================== 辅助函数 ====================

/**
 * 获取指定资源的有效兑换码列表
 */
async function getValidCodes(resourceId) {
    if (kv) {
        try {
            const key = `valid:${resourceId}`;
            const codes = await kv.smembers(key);
            return codes || [];
        } catch (error) {
            console.error(`KV 读取 valid:${resourceId} 失败`, error);
            return memoryValidCodes[resourceId] || [];
        }
    } else {
        return memoryValidCodes[resourceId] || [];
    }
}

/**
 * 检查兑换码是否已被使用
 */
async function isCodeUsed(resourceId, code) {
    if (kv) {
        try {
            const usedKey = `used:${resourceId}`;
            return await kv.sismember(usedKey, code);
        } catch (error) {
            console.error(`KV 读取 used:${resourceId} 失败`, error);
            return memoryUsedCodes.has(`${resourceId}:${code}`);
        }
    } else {
        return memoryUsedCodes.has(`${resourceId}:${code}`);
    }
}

/**
 * 标记兑换码为已使用
 */
async function markCodeUsed(resourceId, code) {
    if (kv) {
        try {
            const usedKey = `used:${resourceId}`;
            await kv.sadd(usedKey, code);
        } catch (error) {
            console.error(`KV 写入 used:${resourceId} 失败`, error);
            memoryUsedCodes.add(`${resourceId}:${code}`);
        }
    } else {
        memoryUsedCodes.add(`${resourceId}:${code}`);
    }
}

/**
 * 获取资源对应的下载链接
 */
function getDownloadUrl(resourceId) {
    // 可以从 KV 读取，这里为简化直接返回硬编码映射（可自行扩展）
    const urlMap = {
        'design-pack-101': 'https://your-cdn.com/design-pack.zip',
        'ai-model-202': 'https://your-cdn.com/ai-model.zip'
    };
    return urlMap[resourceId] || null;
}

// ==================== 主处理函数 ====================

export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 只接受 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: '方法不允许' });
    }

    // 解析请求体
    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
        return res.status(400).json({ success: false, message: '无效的 JSON 格式' });
    }

    const { code, resourceId } = body;
    if (!code || !resourceId) {
        return res.status(400).json({ success: false, message: '缺少参数 code 或 resourceId' });
    }

    // 获取该资源的有效兑换码列表
    const validCodes = await getValidCodes(resourceId);
    if (validCodes.length === 0) {
        return res.status(400).json({ success: false, message: '无效的资源 ID' });
    }

    // 验证兑换码是否合法
    if (!validCodes.includes(code)) {
        return res.status(400).json({ success: false, message: '无效的兑换码' });
    }

    // 检查是否已被使用
    const used = await isCodeUsed(resourceId, code);
    if (used) {
        return res.status(400).json({ success: false, message: '兑换码已使用' });
    }

    // 标记为已使用
    await markCodeUsed(resourceId, code);

    // 获取下载链接
    const downloadUrl = getDownloadUrl(resourceId);
    if (!downloadUrl) {
        return res.status(500).json({ success: false, message: '未配置下载链接，请联系管理员' });
    }

    return res.status(200).json({ success: true, downloadUrl });
}
