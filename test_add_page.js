// 测试添加和编辑页面的功能
console.log('开始测试添加页面功能...');

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

// 模拟handleAddPage函数
function handleAddPage(pageName) {
    console.log(`添加页面: ${pageName}`);
    
    // 生成URL友好的页面键名
    let pageKey = pageName.trim().toLowerCase();
    pageKey = pageKey.replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
    
    console.log(`生成的页面键名: ${pageKey}`);
    
    // 检查页面是否已存在
    if (pages[pageKey]) {
        console.error('已存在同名页面！');
        return false;
    }
    
    // 创建新页面数据
    pages[pageKey] = {
        pageTitle: pageName + ' - Zhishu的博客',
        content: ['这是' + pageName + '页面的内容。']
    };
    console.log(`创建的页面数据:`, pages[pageKey]);
    
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
    console.log(`更新后的导航链接:`, pages.home.navLinks);
    
    // 保存页面数据到localStorage
    localStorage.setItem('blogPages', JSON.stringify(pages, null, 2));
    console.log('页面数据已保存到localStorage');
    
    return true;
}

// 模拟savePagesToJSON函数
function savePagesToJSON() {
    try {
        localStorage.setItem('blogPages', JSON.stringify(pages, null, 2));
        console.log('页面数据已成功保存到localStorage');
        return true;
    } catch (error) {
        console.error('保存页面数据出错:', error);
        return false;
    }
}

// 模拟loadPages函数
function loadPages() {
    try {
        const savedPages = localStorage.getItem('blogPages');
        if (savedPages) {
            pages = JSON.parse(savedPages);
            console.log('从localStorage加载页面数据成功:', Object.keys(pages));
            return pages;
        } else {
            console.log('localStorage中没有页面数据');
            return {};
        }
    } catch (error) {
        console.error('加载页面数据失败:', error);
        return {};
    }
}

// 测试流程
console.log('\n=== 测试添加galgame页面 ===');
let addResult = handleAddPage('galgame');
if (addResult) {
    console.log('✓ 添加页面成功');
} else {
    console.log('✗ 添加页面失败');
}

console.log('\n=== 测试编辑galgame页面 ===');
// 编辑页面内容
if (pages.galgame) {
    pages.galgame.content = [
        '这是galgame页面的编辑内容。',
        '添加了新的段落。'
    ];
    pages.galgame.pageTitle = 'Galgame分享 - Zhishu的博客';
    console.log('编辑后的页面数据:', pages.galgame);
    
    // 保存编辑后的页面
    let saveResult = savePagesToJSON();
    if (saveResult) {
        console.log('✓ 保存页面成功');
    } else {
        console.log('✗ 保存页面失败');
    }
}

console.log('\n=== 测试重新加载页面 ===');
// 清空pages对象
pages = {};
console.log('清空pages对象后:', pages);

// 重新加载页面数据
pages = loadPages();
if (pages.galgame) {
    console.log('✓ 成功重新加载galgame页面');
    console.log('加载的页面数据:', pages.galgame);
    
    // 检查导航链接是否包含galgame
    if (pages.home && pages.home.navLinks) {
        const hasGalgameLink = pages.home.navLinks.some(link => link.text === 'galgame');
        if (hasGalgameLink) {
            console.log('✓ 导航链接中包含galgame');
        } else {
            console.log('✗ 导航链接中不包含galgame');
        }
    }
} else {
    console.log('✗ 无法重新加载galgame页面');
}

console.log('\n=== 测试完成 ===');
