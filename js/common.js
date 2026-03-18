// ==================== 通用工具函数 ====================
function escapeHtml(unsafe) {
    if (!unsafe) return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getTypeChineseName(type) {
    const map = { web: '网页', software: '软件', file: '文件', article: '文章' };
    return map[type] || type;
}

// ==================== 数据加载 ====================
async function loadDataIndex(cacheBuster = '') {
    const resp = await fetch('data-index.json' + cacheBuster);
    if (!resp.ok) throw new Error('无法加载数据索引');
    return await resp.json();
}

function parseFrontMatter(text, filePath) {
    const lines = text.split('\n');
    if (lines[0] && lines[0].trim() === '---') {
        let endIndex = -1;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                endIndex = i;
                break;
            }
        }
        if (endIndex > 0) {
            const frontMatterLines = lines.slice(1, endIndex).join('\n');
            const content = lines.slice(endIndex + 1).join('\n').trim();
            try {
                const meta = parseYaml(frontMatterLines);
                return { meta, content };
            } catch (e) {
                console.warn(`解析 YAML 失败 ${filePath}:`, e);
                return { meta: { _error: true }, content: text };
            }
        }
    }
    return { meta: {}, content: text };
}

function parseYaml(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    let currentKey = null;
    let currentArray = null;
    lines.forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
                }
                result[key] = value;
                currentKey = null;
            } else if (value === '') {
                currentKey = key;
                currentArray = [];
                result[key] = currentArray;
            } else {
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                result[key] = value;
                currentKey = null;
            }
        } else if (currentKey && line.startsWith('-')) {
            const item = line.slice(1).trim();
            currentArray.push(item);
        }
    });
    return result;
}

async function loadMarkdownFile(filePath, cacheBuster = '') {
    try {
        const resp = await fetch(filePath + cacheBuster);
        if (!resp.ok) return null;
        const text = await resp.text();
        return parseFrontMatter(text, filePath);
    } catch (e) {
        console.warn(`加载 ${filePath} 失败:`, e);
        return null;
    }
}

async function loadAllResources(cacheBuster = '') {
    const dataIndex = await loadDataIndex(cacheBuster);
    if (!dataIndex.cards) return [];
    const promises = dataIndex.cards.map(async path => {
        const parsed = await loadMarkdownFile(path, cacheBuster);
        if (parsed && parsed.meta && !parsed.meta._error) return parsed;
        return null;
    });
    const results = await Promise.all(promises);
    return results.filter(r => r !== null);
}

// ==================== 主题与深色模式 ====================
function initThemeAndDarkMode() {
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') document.body.classList.add('dark-mode');

    const savedTheme = localStorage.getItem('theme') || 'cyan';
    document.body.classList.add(`theme-${savedTheme}`);
    updateThemeDropdownActive(savedTheme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }

    const paletteBtn = document.getElementById('themePaletteBtn');
    const dropdown = document.getElementById('themeDropdown');
    if (paletteBtn && dropdown) {
        paletteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !paletteBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        dropdown.querySelectorAll('.theme-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const theme = opt.dataset.theme;
                if (theme) {
                    document.body.classList.remove('theme-cyan', 'theme-violet', 'theme-mint', 'theme-sunset', 'theme-sakura');
                    document.body.classList.add(`theme-${theme}`);
                    localStorage.setItem('theme', theme);
                    updateThemeDropdownActive(theme);
                    dropdown.classList.remove('show');
                }
            });
        });
    }
}

function updateThemeDropdownActive(theme) {
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
}

// ==================== 公共头部/底部加载 ====================
async function loadHeader(containerSelector = 'body') {
    try {
        const resp = await fetch('header.html');
        if (!resp.ok) throw new Error('头部加载失败');
        const html = await resp.text();
        const container = document.querySelector(containerSelector);
        container.insertAdjacentHTML('afterbegin', html);
        highlightCurrentNav();
        initMobileMenu();
        initThemeAndDarkMode();
    } catch (e) {
        console.warn('头部加载失败，使用备用', e);
    }
}

async function loadFooter(containerSelector = 'body') {
    try {
        const resp = await fetch('footer.html');
        if (!resp.ok) throw new Error('底部加载失败');
        const html = await resp.text();
        const container = document.querySelector(containerSelector);
        container.insertAdjacentHTML('beforeend', html);
    } catch (e) {
        console.warn('底部加载失败', e);
    }
}

function highlightCurrentNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPath);
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        const icon = toggle.querySelector('i');
        icon.className = nav.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
    });
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 700) {
                nav.classList.remove('show');
                toggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    });
}

// ==================== 面包屑 ====================
function renderBreadcrumb(pageType, detailMeta = null) {
    const breadcrumbDiv = document.getElementById('breadcrumb');
    if (!breadcrumbDiv) return;

    let html = '<a href="index.html">首页</a> <i class="fas fa-chevron-right"></i> ';
    const map = {
        index: '首页', web: '网页资源', software: '软件资源', file: '文件资源',
        article: '文章资源', search: '搜索', tags: '标签浏览', hot: '热门排行榜',
        catalog: '全站目录', about: '关于', help: '帮助中心', changelog: '更新日志',
        links: '友情链接', privacy: '隐私政策', terms: '用户协议'
    };
    if (pageType === 'detail' && detailMeta) {
        const typeChinese = getTypeChineseName(detailMeta.type);
        html += `<a href="${detailMeta.type}.html">${typeChinese}</a> <i class="fas fa-chevron-right"></i> `;
        html += `<span>${escapeHtml(detailMeta.title || '详情')}</span>`;
    } else {
        html += `<span>${map[pageType] || pageType}</span>`;
    }
    breadcrumbDiv.innerHTML = html;
}
