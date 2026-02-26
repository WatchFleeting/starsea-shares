// ==================== 公共函数库 ====================

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 根据类型返回默认 FontAwesome 图标
 */
function getDefaultIcon(type) {
    const map = { 'web': 'fa-globe', 'software': 'fa-download', 'file': 'fa-file-archive', 'article': 'fa-book-open' };
    return map[type] || 'fa-star';
}

/**
 * 获取类型中文名
 */
function getTypeChineseName(type) {
    const map = { 'web': '网页', 'software': '软件', 'file': '文件', 'article': '文章' };
    return map[type] || type;
}

/**
 * 解析 Markdown Front Matter
 */
function parseFrontMatter(content, sourcePath = '') {
    content = content.trim();
    if (!content.startsWith('---')) {
        return {
            meta: {
                title: '未命名',
                description: content.slice(0, 150) + '...',
                type: 'web',
                category: '未分类',
                id: 'id_' + (sourcePath ? sourcePath.replace(/[^a-zA-Z0-9]/g, '_') : Math.random().toString(36).substring(2))
            },
            content
        };
    }

    const lines = content.split('\n');
    let i = 1;
    const meta = {};
    while (i < lines.length && lines[i].trim() !== '---') {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
            const colon = line.indexOf(':');
            if (colon > -1) {
                const key = line.slice(0, colon).trim();
                let value = line.slice(colon + 1).trim();
                if (value.startsWith('[') && value.endsWith(']')) {
                    try { value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '')); } catch { value = []; }
                } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                } else if (value.toLowerCase() === 'true') value = true;
                else if (value.toLowerCase() === 'false') value = false;
                else if (/^-?\d+$/.test(value)) value = Number(value);
                meta[key] = value;
            }
        }
        i++;
    }
    const mainContent = lines.slice(i + 1).join('\n').trim();
    if (!meta.type) meta.type = 'web';
    if (!meta.icon) meta.icon = getDefaultIcon(meta.type);
    if (!meta.date) meta.date = new Date().toISOString().split('T')[0];
    if (!meta.id) {
        meta.id = 'id_' + (sourcePath ? sourcePath.replace(/[^a-zA-Z0-9]/g, '_') : Math.random().toString(36).substring(2));
    }
    return { meta, content: mainContent };
}

/**
 * 加载单个 Markdown 文件
 */
async function loadMarkdownFile(filePath, cacheBuster) {
    const resp = await fetch(filePath + (cacheBuster ? '?v=' + cacheBuster : ''));
    if (!resp.ok) return null;
    const text = await resp.text();
    return parseFrontMatter(text, filePath);
}

/**
 * 加载 data-index.json
 */
async function loadDataIndex(cacheBuster) {
    const url = 'data-index.json' + (cacheBuster ? '?v=' + cacheBuster : '');
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('无法加载数据索引');
    return await resp.json();
}

/**
 * 加载所有卡片资源
 */
async function loadAllResources(cacheBuster = Date.now()) {
    const dataIndex = await loadDataIndex(cacheBuster);
    if (!dataIndex.cards || dataIndex.cards.length === 0) return [];

    const promises = dataIndex.cards.map(path => loadMarkdownFile(path, cacheBuster));
    const results = await Promise.all(promises);
    return results.filter(r => r && !r.meta._error);
}

// ==================== 主题切换 ====================
(function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        if (icon) icon.className = 'fas fa-sun';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const dark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', dark);
        if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    });
})();
