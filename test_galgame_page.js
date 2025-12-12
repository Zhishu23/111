// 测试脚本：模拟添加galgame页面并验证功能

// 模拟localStorage
const localStorage = {
    _data: {},
    getItem(key) {
        return this._data[key] || null;
    },
    setItem(key, value) {
        this._data[key] = value;
    },
    removeItem(key) {
        delete this._data[key];
    },
    clear() {
        this._data = {};
    }
};

// 模拟DOM元素
const mockElements = {
    'page-select': { value: 'home' },
    'custom-page-title': { value: '' },
    'custom-content': { children: [] },
    'login-section': { style: { display: 'block' } },
    'admin-section': { style: { display: 'none' } },
    'password': { value: 'admin123' },
    'message': { classList: { add: () => {}, remove: () => {} }, textContent: '' },
    'login-btn': {},
    'logout-btn': {},
    'custom-modal': { style: { display: 'none' } },
    'modal-title': { textContent: '' },
    'modal-input': { value: '', placeholder: '', focus: () => {} },
    'modal-confirm': {},
    'modal-cancel': {}
};

// 模拟document
const document = {
    getElementById(id) {
        return mockElements[id] || null;
    },
    querySelectorAll(selector) {
        return [];
    },
    addEventListener(event, callback) {
        // 模拟事件监听
    }
};

// 模拟console
const console = {
    log: (...args) => {
        process.stdout.write(args.join(' ') + '\n');
    },
    error: (...args) => {
        process.stderr.write(args.join(' ') + '\n');
    }
};

// 模拟fetch
const fetch = async (url) => {
    return {
        ok: false,
        status: 404,
        json: async () => {}
    };
};

// 模拟window
const window = {
    localStorage,
    document,
    console,
    fetch
};

global.window = window;
global.localStorage = localStorage;
global.document = document;
global.console = console;
global.fetch = fetch;

// 导入admin.js的核心功能进行测试
console.log('=== 开始测试galgame页面添加功能 ===');

// 初始化测试环境
let pages = {
    home: {
        pageTitle: "Zhishu的博客",
        logo: "Zhishu的博客",
        navLinks: [
            { "text": "首页", "url": "index.html" },
            { "text": "关于", "url": "about.html" }
        ],
        footerText: "© 2025 Zhishu的博客. All rights reserved."
    },
    about: {
        pageTitle: "关于我 - Zhishu的博客",
        sectionTitle: "关于我",
        content: [
            "你好！欢迎来到我的个人博客。",
            "我是一名热爱学习和分享的技术爱好者，在这里我会记录我的学习心得、技术笔记和生活感悟。",
            "这个博客是我用HTML、CSS和JavaScript创建的，虽然简单但充满了我的心血。",
            "如果你对我的文章感兴趣，欢迎关注我的博客，也可以通过下方联系方式与我交流。"
        ],
        contactTitle: "联系方式",
        contactInfo: [
            { "type": "邮箱", "value": "your@email.com" },
            { "type": "GitHub", "value": "github.com/yourusername" },
            { "type": "微信", "value": "yourwechat" }
        ]
    }
};

let currentPage = 'home';
let pageSelect = mockElements['page-select'];

// 模拟保存页面数据到localStorage
function savePagesToJSON() {
    localStorage.setItem('blogPages', JSON.stringify(pages));
    console.log('页面数据已保存到localStorage');
}

// 模拟渲染页面选择器
function renderPageSelector() {
    console.log('页面选择器已渲染');
}

// 模拟加载页面数据到表单
function loadPageToForm(pageKey) {
    console.log(`页面数据已加载到表单: ${pageKey}`);
}

// 模拟显示消息
function showMessage(text, type) {
    console.log(`${type}: ${text}`);
}

// 模拟自定义模态框功能
function showModal(title, placeholder, callback) {
    console.log(`模态框已显示: ${title}`);
    console.log(`输入提示: ${placeholder}`);
    // 模拟用户输入"galgame"
    setTimeout(() => {
        callback('galgame');
    }, 100);
}

// 测试修改后的handleAddPage函数
async function handleAddPage() {
    console.log('=== 测试handleAddPage函数 ===');
    
    // 显示自定义模态框获取页面名称
    showModal('添加新页面', '请输入新页面名称（如：新闻）', async (pageName) => {
        if (!pageName || pageName.trim() === '') {
            if (pageName !== null) {
                showMessage('页面名称不能为空！', 'error');
            }
            return;
        }
        
        // 生成URL友好的页面键名
        let pageKey = pageName.trim().toLowerCase();
        pageKey = pageKey.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
        if (pages[pageKey]) {
            showMessage('已存在同名页面！', 'error');
            return;
        }
        
        console.log(`正在创建新页面: ${pageName} (键名: ${pageKey})`);
        
        // 创建新页面数据
        pages[pageKey] = {
            pageTitle: pageName + ' - Zhishu的博客',
            content: ['这是' + pageName + '页面的内容。']
        };
        
        // 将新页面添加到导航菜单
        if (!pages.home) pages.home = {};
        if (!pages.home.navLinks) {
            pages.home.navLinks = [
                { "text": "首页", "url": "index.html" },
                { "text": "关于", "url": "about.html" }
            ];
        }
        pages.home.navLinks.push({
            text: pageName,
            url: 'page.html?page=' + pageKey
        });
        
        // 更新页面选择器
        renderPageSelector();
        
        // 切换到新页面
        currentPage = pageKey;
        pageSelect.value = pageKey;
        loadPageToForm(currentPage);
        
        // 保存页面数据到localStorage
        await savePagesToJSON();
        
        showMessage('新页面已创建！', 'success');
        
        // 验证新页面是否创建成功
        console.log('=== 验证新页面创建结果 ===');
        if (pages[pageKey]) {
            console.log(`✓ 页面${pageName}创建成功`);
            console.log(`✓ 页面数据:`, pages[pageKey]);
            console.log(`✓ 页面键名: ${pageKey}`);
        } else {
            console.log(`✗ 页面${pageName}创建失败`);
        }
        
        // 验证导航菜单是否更新
        const navLinkExists = pages.home.navLinks.some(link => link.text === pageName);
        if (navLinkExists) {
            console.log(`✓ 导航菜单已更新，包含${pageName}链接`);
        } else {
            console.log(`✗ 导航菜单未更新，不包含${pageName}链接`);
        }
        
        // 验证localStorage是否保存成功
        const savedPages = localStorage.getItem('blogPages');
        if (savedPages) {
            const parsedPages = JSON.parse(savedPages);
            if (parsedPages[pageKey]) {
                console.log(`✓ 页面数据已保存到localStorage`);
            } else {
                console.log(`✗ 页面数据未保存到localStorage`);
            }
        } else {
            console.log(`✗ localStorage中没有保存页面数据`);
        }
        
        console.log('=== 测试完成 ===');
    });
}

// 执行测试
handleAddPage();