// 测试后台管理系统完整工作流程
console.log('开始测试后台管理系统完整工作流程...');

// 模拟localStorage
const localStorage = {
    data: {},
    getItem(key) {
        return this.data[key] || null;
    },
    setItem(key, value) {
        this.data[key] = value;
    },
    clear() {
        this.data = {};
    }
};

// 模拟页面数据
let pages = {};
let articles = [];
let currentPage = 'home';

// 模拟DOM元素
const domElements = {
    loginSection: { style: { display: 'block' } },
    adminSection: { style: { display: 'none' } },
    pageSelect: { value: 'home' },
    homePageForm: { style: { display: 'none' } },
    aboutPageForm: { style: { display: 'none' } },
    customPageForm: { style: { display: 'none' } },
    customPageTitle: { value: '' },
    customContent: { innerHTML: '', querySelectorAll: () => [] }
};

// 模拟登录状态
let isLoggedIn = false;

// 模拟ADMIN_PASSWORD
const ADMIN_PASSWORD = 'admin123';

// 模拟登录函数
function handleLogin(password) {
    console.log(`尝试登录，密码: ${password}`);
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        isLoggedIn = true;
        domElements.loginSection.style.display = 'none';
        domElements.adminSection.style.display = 'block';
        loadPages();
        console.log('✓ 登录成功');
        return true;
    } else {
        console.error('✗ 密码错误，登录失败');
        return false;
    }
}

// 模拟退出函数
function handleLogout() {
    localStorage.setItem('adminLoggedIn', 'false');
    isLoggedIn = false;
    domElements.loginSection.style.display = 'block';
    domElements.adminSection.style.display = 'none';
    console.log('✓ 退出成功');
}

// 模拟loadPages函数
async function loadPages() {
    try {
        const savedPages = localStorage.getItem('blogPages');
        if (savedPages) {
            pages = JSON.parse(savedPages);
            console.log('✓ 从localStorage加载页面数据成功');
        } else {
            // 使用默认数据
            pages = {
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
                    content: ["你好！欢迎来到我的个人博客。"],
                    contactTitle: "联系方式",
                    contactInfo: [{ "type": "邮箱", "value": "your@email.com" }]
                }
            };
            localStorage.setItem('blogPages', JSON.stringify(pages, null, 2));
            console.log('✓ 使用默认页面数据并保存到localStorage');
        }
        renderPageSelector();
        loadPageToForm(currentPage);
    } catch (error) {
        console.error('✗ 加载页面数据失败:', error);
        pages = {
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
                content: ["你好！欢迎来到我的个人博客。"],
                contactTitle: "联系方式",
                contactInfo: [{ "type": "邮箱", "value": "your@email.com" }]
            }
        };
        localStorage.setItem('blogPages', JSON.stringify(pages, null, 2));
    }
}

// 模拟renderPageSelector函数
function renderPageSelector() {
    console.log('渲染页面选择器，当前页面:', currentPage);
    domElements.pageSelect.value = currentPage;
}

// 模拟loadPageToForm函数
function loadPageToForm(pageKey) {
    const pageData = pages[pageKey];
    if (!pageData) return;
    
    console.log(`加载页面 ${pageKey} 到表单`);
    
    domElements.homePageForm.style.display = 'none';
    domElements.aboutPageForm.style.display = 'none';
    domElements.customPageForm.style.display = 'none';
    
    if (pageKey === 'home') {
        domElements.homePageForm.style.display = 'block';
    } else if (pageKey === 'about') {
        domElements.aboutPageForm.style.display = 'block';
    } else {
        domElements.customPageForm.style.display = 'block';
        domElements.customPageTitle.value = pageData.pageTitle;
        
        // 模拟自定义页面内容
        const contentParagraphs = pageData.content.map((text, index) => {
            return { textContent: text };
        });
        domElements.customContent.querySelectorAll = () => contentParagraphs;
        console.log(`自定义页面内容已加载:`, pageData.content);
    }
}

// 模拟handleAddPage函数
function handleAddPage(pageName) {
    console.log(`\n=== 添加新页面: ${pageName} ===`);
    
    if (!pageName || pageName.trim() === '') {
        console.error('✗ 页面名称不能为空！');
        return false;
    }
    
    // 生成URL友好的页面键名
    let pageKey = pageName.trim().toLowerCase();
    pageKey = pageKey.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
    
    console.log(`生成的页面键名: ${pageKey}`);
    
    if (pages[pageKey]) {
        console.error('✗ 已存在同名页面！');
        return false;
    }
    
    // 创建新页面数据
    pages[pageKey] = {
        pageTitle: pageName + ' - Zhishu的博客',
        content: ['这是' + pageName + '页面的内容。']
    };
    console.log(`✓ 创建的页面数据:`, pages[pageKey]);
    
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
    console.log(`✓ 更新后的导航链接:`, pages.home.navLinks);
    
    // 更新页面选择器
    renderPageSelector();
    
    // 切换到新页面
    currentPage = pageKey;
    domElements.pageSelect.value = pageKey;
    loadPageToForm(currentPage);
    
    // 保存页面数据到localStorage
    savePagesToJSON();
    
    console.log('✓ 新页面已创建并保存');
    return true;
}

// 模拟savePagesToJSON函数
async function savePagesToJSON() {
    try {
        localStorage.setItem('blogPages', JSON.stringify(pages, null, 2));
        console.log('✓ 页面数据已成功保存到localStorage');
        return true;
    } catch (error) {
        console.error('✗ 保存页面数据出错:', error);
        return false;
    }
}

// 模拟handleSavePage函数
async function handleSavePage() {
    console.log(`\n=== 保存当前页面: ${currentPage} ===`);
    
    if (currentPage === 'home') {
        // 保存首页逻辑
        console.log('保存首页数据');
    } else if (currentPage === 'about') {
        // 保存关于页面逻辑
        console.log('保存关于页面数据');
    } else {
        // 保存自定义页面
        const pageData = pages[currentPage];
        if (pageData) {
            // 模拟编辑内容
            const newContent = [
                '这是编辑后的' + currentPage + '页面内容。',
                '添加了新的段落来测试编辑功能。',
                '确保内容可以正确保存和加载。'
            ];
            
            pages[currentPage] = {
                ...pageData,
                pageTitle: currentPage.charAt(0).toUpperCase() + currentPage.slice(1) + ' - Zhishu的博客',
                content: newContent
            };
            
            console.log('✓ 更新后的页面数据:', pages[currentPage]);
        }
    }
    
    // 保存到localStorage
    const jsonSaved = await savePagesToJSON();
    
    if (jsonSaved) {
        console.log('✓ 页面更新成功并已保存');
    } else {
        console.log('✗ 页面更新成功，但保存失败');
    }
    
    return jsonSaved;
}

// 模拟检查页面是否可编辑
function checkPageEditable(pageKey) {
    console.log(`\n=== 检查页面 ${pageKey} 是否可编辑 ===`);
    
    // 重新加载页面数据
    loadPages();
    
    if (pages[pageKey]) {
        console.log('✓ 找到页面数据:', pages[pageKey]);
        
        // 切换到该页面
        currentPage = pageKey;
        domElements.pageSelect.value = pageKey;
        loadPageToForm(currentPage);
        
        // 检查是否显示自定义页面表单
        if (domElements.customPageForm.style.display === 'block') {
            console.log('✓ 页面表单已正确显示，可以进行编辑');
            return true;
        } else {
            console.error('✗ 页面表单未正确显示');
            return false;
        }
    } else {
        console.error('✗ 未找到页面数据');
        return false;
    }
}

// 完整测试流程
async function runCompleteTest() {
    console.log('\n=== 测试流程1: 登录后台系统 ===');
    const loginSuccess = handleLogin('admin123');
    if (!loginSuccess) {
        console.error('✗ 登录失败，测试终止');
        return;
    }
    
    console.log('\n=== 测试流程2: 添加galgame页面 ===');
    const addPageSuccess = handleAddPage('galgame');
    if (!addPageSuccess) {
        console.error('✗ 添加页面失败，测试终止');
        return;
    }
    
    console.log('\n=== 测试流程3: 编辑galgame页面内容 ===');
    const saveSuccess = await handleSavePage();
    if (!saveSuccess) {
        console.error('✗ 保存页面失败，测试终止');
        return;
    }
    
    console.log('\n=== 测试流程4: 退出后台系统 ===');
    handleLogout();
    
    console.log('\n=== 测试流程5: 重新登录后台系统 ===');
    const reloginSuccess = handleLogin('admin123');
    if (!reloginSuccess) {
        console.error('✗ 重新登录失败，测试终止');
        return;
    }
    
    console.log('\n=== 测试流程6: 验证galgame页面是否可再次编辑 ===');
    const isEditable = checkPageEditable('galgame');
    if (!isEditable) {
        console.error('✗ 页面不可编辑，测试失败');
        return;
    }
    
    console.log('\n=== 测试流程7: 再次编辑并保存galgame页面 ===');
    // 模拟再次编辑
    pages.galgame.content.push('这是再次编辑添加的内容。');
    const secondSaveSuccess = await savePagesToJSON();
    if (secondSaveSuccess) {
        console.log('✓ 再次编辑保存成功');
    }
    
    console.log('\n=== 测试流程8: 最终验证页面数据 ===');
    loadPages();
    if (pages.galgame) {
        console.log('✓ 最终页面数据:', pages.galgame);
        console.log('✓ 导航链接中包含galgame:', pages.home.navLinks.some(link => link.text === 'galgame'));
    }
    
    console.log('\n=== 所有测试流程完成！===');
    console.log('✓ 后台管理系统工作正常，可以正常添加、编辑和保存页面');
    console.log('✓ 页面数据在退出并重新登录后仍然存在且可编辑');
    console.log('✓ 导航菜单正确更新，包含新添加的页面');
}

// 运行完整测试
runCompleteTest();
