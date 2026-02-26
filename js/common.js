// ==================== 通用工具函数 ====================
function escapeHtml(unsafe) { /* ... 同之前 ... */ }
function getTypeChineseName(type) { /* ... 同之前 ... */ }

// ==================== 数据加载 ====================
async function loadDataIndex(cacheBuster = '') { /* ... 同之前 ... */ }
function parseFrontMatter(text, filePath) { /* ... 同之前 ... */ }
function parseYaml(yaml) { /* ... 同之前 ... */ }
async function loadMarkdownFile(filePath, cacheBuster = '') { /* ... 同之前 ... */ }
async function loadAllResources(cacheBuster = '') { /* ... 同之前 ... */ }

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
    } catch (e) { console.warn('头部加载失败', e); }
}

async function loadFooter(containerSelector = 'body') {
    try {
        const resp = await fetch('footer.html');
        if (!resp.ok) throw new Error('底部加载失败');
        const html = await resp.text();
        const container = document.querySelector(containerSelector);
        container.insertAdjacentHTML('beforeend', html);
    } catch (e) { console.warn('底部加载失败', e); }
}

function highlightCurrentNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPath);
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
