// 博客后台管理系统

// 简单的登录密码（可以修改为你想要的密码）
const ADMIN_PASSWORD = 'admin123';

// 文章数据
let articles = [];
let currentArticle = null;

// 页面数据
let pages = {};
let currentPage = 'home';

// DOM元素
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

// 文章管理DOM元素
const articleForm = document.getElementById('article-form');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const authorInput = document.getElementById('author');
const excerptInput = document.getElementById('excerpt');
const imageInput = document.getElementById('image');
const contentInput = document.getElementById('content');
const idInput = document.getElementById('id');
const saveBtn = document.getElementById('save-btn');
const newBtn = document.getElementById('new-btn');
const deleteBtn = document.getElementById('delete-btn');
const exportBtn = document.getElementById('export-btn');
const articlesList = document.getElementById('articles-list');

// 页面管理DOM元素
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const pageSelect = document.getElementById('page-select');
const addPageBtn = document.getElementById('add-page-btn');
const homePageForm = document.getElementById('home-page-form');
const aboutPageForm = document.getElementById('about-page-form');
const customPageForm = document.getElementById('custom-page-form');
const homePageTitle = document.getElementById('home-page-title');
const homeLogoType = document.getElementById('home-logo-type');
const homeLogoText = document.getElementById('home-logo-text');
const homeLogoImage = document.getElementById('home-logo-image');
const homeLogoTextGroup = document.getElementById('home-logo-text-group');
const homeLogoImageGroup = document.getElementById('home-logo-image-group');
const homeFooter = document.getElementById('home-footer');
const aboutPageTitle = document.getElementById('about-page-title');
const aboutSectionTitle = document.getElementById('about-section-title');
const aboutContent = document.getElementById('about-content');
const aboutContactTitle = document.getElementById('about-contact-title');
const contactInfo = document.getElementById('contact-info');
const addAboutParagraphBtn = document.getElementById('add-about-paragraph');
const addContactInfoBtn = document.getElementById('add-contact-info');
const savePageBtn = document.getElementById('save-page-btn');

// 初始化
function init() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // 绑定文章管理事件
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    saveBtn.addEventListener('click', handleSaveArticle);
    newBtn.addEventListener('click', handleNewArticle);
    deleteBtn.addEventListener('click', handleDeleteArticle);
    exportBtn.addEventListener('click', handleExportArticles);
    
    // 绑定页面管理事件
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabChange);
    });
    pageSelect.addEventListener('change', handlePageSelectChange);
    homeLogoType.addEventListener('change', handleLogoTypeChange);
    addPageBtn.addEventListener('click', handleAddPage);
    addAboutParagraphBtn.addEventListener('click', addAboutParagraph);
    addContactInfoBtn.addEventListener('click', addContactInfo);
    savePageBtn.addEventListener('click', handleSavePage);
    
    // 按Enter键登录
    passwordInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await handleLogin();
        }
    });
    
    // 检查是否已登录
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminSection();
    }
}

// 处理登录
async function handleLogin() {
    if (passwordInput.value === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminSection();
        await loadArticles();
        await loadPages();
    } else {
        showMessage('密码错误，请重新输入！', 'error');
        passwordInput.value = '';
    }
}

// 处理退出
function handleLogout() {
    localStorage.setItem('adminLoggedIn', 'false');
    showLoginSection();
    clearForm();
}

// 处理标签页切换
function handleTabChange(e) {
    const targetTab = e.target.dataset.tab;
    
    // 更新标签按钮状态
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // 更新标签内容显示
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${targetTab}-tab`).classList.add('active');
    
    // 如果切换到页面管理标签，确保页面数据已加载
    if (targetTab === 'pages' && Object.keys(pages).length > 0) {
        loadPageToForm(currentPage);
    }
}

// 处理页面选择切换
function handlePageSelectChange(e) {
    currentPage = e.target.value;
    
    // 显示对应页面的表单
    homePageForm.style.display = currentPage === 'home' ? 'block' : 'none';
    aboutPageForm.style.display = currentPage === 'about' ? 'block' : 'none';
    
    // 加载选中页面的数据
    loadPageToForm(currentPage);
}

// 加载页面数据
async function loadPages() {
    try {
        // 从JSON文件加载数据
        const response = await fetch('data/pages.json');
        if (response.ok) {
            pages = await response.json();
        } else {
            // 如果JSON文件不存在或加载失败，使用默认数据
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
        }
    } catch (error) {
        console.error('加载页面数据失败:', error);
        // 加载失败时，使用默认数据
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
    }
}

// 加载页面数据到表单
function loadPageToForm(pageKey) {
    const pageData = pages[pageKey];
    if (!pageData) return;
    
    if (pageKey === 'home') {
        homePageTitle.value = pageData.pageTitle;
        
        // 处理LOGO
        if (pageData.logo && pageData.logo.type === 'image') {
            homeLogoType.value = 'image';
            homeLogoText.value = '';
            homeLogoImage.value = pageData.logo.value || '';
            homeLogoTextGroup.style.display = 'none';
            homeLogoImageGroup.style.display = 'block';
        } else {
            homeLogoType.value = 'text';
            homeLogoText.value = pageData.logo ? (pageData.logo.value || pageData.logo) : '';
            homeLogoImage.value = '';
            homeLogoTextGroup.style.display = 'block';
            homeLogoImageGroup.style.display = 'none';
        }
        
        homeFooter.value = pageData.footerText;
    } else if (pageKey === 'about') {
        aboutPageTitle.value = pageData.pageTitle;
        aboutSectionTitle.value = pageData.sectionTitle;
        aboutContactTitle.value = pageData.contactTitle;
        
        // 渲染关于内容段落
        aboutContent.innerHTML = '';
        pageData.content.forEach((paragraph, index) => {
            const paragraphDiv = document.createElement('div');
            paragraphDiv.className = 'form-group';
            paragraphDiv.innerHTML = `
                <div style="display: flex; gap: 1rem;">
                    <textarea rows="3" class="about-paragraph" style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;">${paragraph}</textarea>
                    <button type="button" class="remove-contact-btn" onclick="removeAboutParagraph(this)">删除</button>
                </div>
            `;
            aboutContent.appendChild(paragraphDiv);
        });
        
        // 渲染联系方式
        contactInfo.innerHTML = '';
        pageData.contactInfo.forEach((contact, index) => {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-info-item';
            contactDiv.innerHTML = `
                <input type="text" class="contact-type" value="${contact.type}" placeholder="联系方式类型" />
                <input type="text" class="contact-value" value="${contact.value}" placeholder="联系方式值" />
                <button type="button" class="remove-contact-btn" onclick="removeContactInfo(this)">删除</button>
            `;
            contactInfo.appendChild(contactDiv);
        });
    }
}

// 添加关于页面段落
function addAboutParagraph() {
    const paragraphDiv = document.createElement('div');
    paragraphDiv.className = 'form-group';
    paragraphDiv.innerHTML = `
        <div style="display: flex; gap: 1rem;">
            <textarea rows="3" class="about-paragraph" style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;"></textarea>
            <button type="button" class="remove-contact-btn" onclick="removeAboutParagraph(this)">删除</button>
        </div>
    `;
    aboutContent.appendChild(paragraphDiv);
}

// 删除关于页面段落
function removeAboutParagraph(button) {
    button.closest('.form-group').remove();
}

// 添加联系方式
function addContactInfo() {
    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact-info-item';
    contactDiv.innerHTML = `
        <input type="text" class="contact-type" placeholder="联系方式类型" />
        <input type="text" class="contact-value" placeholder="联系方式值" />
        <button type="button" class="remove-contact-btn" onclick="removeContactInfo(this)">删除</button>
    `;
    contactInfo.appendChild(contactDiv);
}

// 删除联系方式
function removeContactInfo(button) {
    button.closest('.contact-info-item').remove();
}

// 处理LOGO类型切换
function handleLogoTypeChange(e) {
    const logoType = e.target.value;
    if (logoType === 'text') {
        homeLogoTextGroup.style.display = 'block';
        homeLogoImageGroup.style.display = 'none';
    } else {
        homeLogoTextGroup.style.display = 'none';
        homeLogoImageGroup.style.display = 'block';
    }
}

// 处理添加新页面
function handleAddPage() {
    const pageName = prompt('请输入新页面名称（如：news）：');
    if (!pageName || pageName.trim() === '') {
        showMessage('页面名称不能为空！', 'error');
        return;
    }
    
    const pageKey = pageName.trim().toLowerCase();
    if (pages[pageKey]) {
        showMessage('已存在同名页面！', 'error');
        return;
    }
    
    // 创建新页面数据
    pages[pageKey] = {
        pageTitle: pageName + ' - Zhishu的博客',
        content: ['这是' + pageName + '页面的内容。']
    };
    
    // 添加到页面选择器
    const option = document.createElement('option');
    option.value = pageKey;
    option.textContent = pageName;
    pageSelect.appendChild(option);
    
    // 切换到新页面
    pageSelect.value = pageKey;
    handlePageSelectChange({ target: { value: pageKey } });
    
    showMessage('新页面已创建！', 'success');
}

// 处理保存页面
async function handleSavePage() {
    if (currentPage === 'home') {
        // 保存LOGO设置
        const logoType = homeLogoType.value;
        let logoData;
        
        if (logoType === 'text') {
            logoData = {
                type: 'text',
                value: homeLogoText.value.trim()
            };
        } else {
            logoData = {
                type: 'image',
                value: homeLogoImage.value.trim()
            };
        }
        
        pages.home = {
            ...pages.home,
            pageTitle: homePageTitle.value.trim(),
            logo: logoData,
            footerText: homeFooter.value.trim()
        };
    } else if (currentPage === 'about') {
        // 获取所有段落内容
        const paragraphTexts = Array.from(document.querySelectorAll('.about-paragraph'))
            .map(textarea => textarea.value.trim())
            .filter(text => text !== '');
        
        // 获取所有联系方式
        const contactInfoItems = Array.from(document.querySelectorAll('.contact-info-item'))
            .map(item => {
                const type = item.querySelector('.contact-type').value.trim();
                const value = item.querySelector('.contact-value').value.trim();
                return { type, value };
            })
            .filter(contact => contact.type !== '' && contact.value !== '');
        
        pages.about = {
            ...pages.about,
            pageTitle: aboutPageTitle.value.trim(),
            sectionTitle: aboutSectionTitle.value.trim(),
            content: paragraphTexts,
            contactTitle: aboutContactTitle.value.trim(),
            contactInfo: contactInfoItems
        };
    }
    
    // 保存到JSON文件
    const jsonSaved = await savePagesToJSON();
    
    // 显示消息
    if (jsonSaved) {
        showMessage('页面更新成功并已自动同步到博客！', 'success');
    } else {
        showMessage('页面更新成功，但同步到博客失败！', 'warning');
    }
}

// 保存页面数据到JSON文件
async function savePagesToJSON() {
    try {
        // 确保使用当前服务器的URL
        const serverUrl = window.location.origin;
        const pagesUrl = `${serverUrl}/data/pages.json`;
        
        console.log('尝试保存页面数据到JSON文件...');
        console.log('请求URL:', pagesUrl);
        console.log('请求数据:', pages);
        
        const response = await fetch(pagesUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pages, null, 2)
        });
        
        console.log('服务器响应状态:', response.status, response.statusText);
        
        // 获取完整响应内容
        const responseText = await response.text();
        console.log('服务器响应内容:', responseText);
        
        if (response.ok) {
            console.log('页面数据已成功保存到JSON文件');
            return true;
        } else {
            console.error('保存到JSON文件失败:', response.statusText);
            console.error('响应内容:', responseText);
            return false;
        }
    } catch (error) {
        console.error('保存到JSON文件出错:', error);
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
        return false;
    }
}

// 显示登录界面
function showLoginSection() {
    loginSection.style.display = 'block';
    adminSection.style.display = 'none';
    passwordInput.value = '';
    hideMessage();
}

// 显示管理界面
function showAdminSection() {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    hideMessage();
}

// 加载文章
async function loadArticles() {
    try {
        // 从JSON文件加载数据
        const response = await fetch('data/articles.json');
        if (response.ok) {
            articles = await response.json();
        } else {
            // 如果JSON文件不存在或加载失败，尝试从localStorage加载
            const savedArticles = localStorage.getItem('blogArticles');
            if (savedArticles) {
                articles = JSON.parse(savedArticles);
            }
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        // 加载失败时，尝试从localStorage加载
        const savedArticles = localStorage.getItem('blogArticles');
        if (savedArticles) {
            articles = JSON.parse(savedArticles);
        }
    }
    renderArticlesList();
}

// 渲染文章列表
function renderArticlesList() {
    articlesList.innerHTML = '';
    
    if (articles.length === 0) {
        articlesList.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">暂无文章</div>';
        return;
    }
    
    // 按ID降序排序（最新的文章在前面）
    const sortedArticles = [...articles].sort((a, b) => b.id - a.id);
    
    sortedArticles.forEach(article => {
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';
        articleItem.innerHTML = `
            <h4>${article.title}</h4>
            <div class="meta">${article.date} • ${article.author}</div>
        `;
        
        articleItem.addEventListener('click', () => {
            // 移除之前选中的文章
            document.querySelectorAll('.article-item').forEach(item => {
                item.classList.remove('selected');
            });
            // 选中当前文章
            articleItem.classList.add('selected');
            // 加载文章到表单
            loadArticleToForm(article);
        });
        
        articlesList.appendChild(articleItem);
    });
}

// 加载文章到表单
function loadArticleToForm(article) {
    currentArticle = article;
    idInput.value = article.id;
    titleInput.value = article.title;
    dateInput.value = article.date;
    authorInput.value = article.author;
    excerptInput.value = article.excerpt;
    imageInput.value = article.image || '';
    contentInput.value = article.content;
}

// 清空表单
function clearForm() {
    currentArticle = null;
    idInput.value = '';
    titleInput.value = '';
    dateInput.value = new Date().toISOString().split('T')[0];
    authorInput.value = 'Zhishu'; // 默认作者名
    excerptInput.value = '';
    imageInput.value = '';
    contentInput.value = '';
    
    // 移除所有选中状态
    document.querySelectorAll('.article-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// 处理保存文章
async function handleSaveArticle() {
    // 验证表单
    if (!titleInput.value.trim() || !contentInput.value.trim()) {
        showMessage('标题和内容不能为空！', 'error');
        return;
    }
    
    const articleData = {
        title: titleInput.value.trim(),
        date: dateInput.value,
        author: authorInput.value.trim(),
        excerpt: excerptInput.value.trim(),
        image: imageInput.value.trim() || null,
        content: contentInput.value.trim()
    };
    
    if (currentArticle) {
        // 更新现有文章
        articleData.id = currentArticle.id;
        const index = articles.findIndex(a => a.id === currentArticle.id);
        if (index !== -1) {
            articles[index] = articleData;
        }
    } else {
        // 创建新文章
        articleData.id = Date.now(); // 使用时间戳作为唯一ID
        articles.push(articleData);
    }
    
    // 保存到localStorage
    saveArticlesToLocalStorage();
    
    // 保存到JSON文件
    const jsonSaved = await saveArticlesToJSON();
    
    // 显示消息
    if (jsonSaved) {
        showMessage(currentArticle ? '文章更新成功并已自动同步到博客！' : '文章添加成功并已自动同步到博客！', 'success');
    } else {
        showMessage(currentArticle ? '文章更新成功，但同步到博客失败！' : '文章添加成功，但同步到博客失败！', 'warning');
    }
    
    // 重新渲染文章列表
    renderArticlesList();
}

// 处理新建文章
function handleNewArticle() {
    clearForm();
    hideMessage();
}

// 保存文章到localStorage
function saveArticlesToLocalStorage() {
    localStorage.setItem('blogArticles', JSON.stringify(articles));
}

// 保存文章到JSON文件
async function saveArticlesToJSON() {
    try {
        // 直接更新articles.json文件
        console.log('尝试保存文章到JSON文件...');
        
        // 确保使用当前服务器的URL
        const serverUrl = window.location.origin;
        const articlesUrl = `${serverUrl}/data/articles.json`;
        
        console.log('请求URL:', articlesUrl);
        console.log('请求数据数量:', articles.length);
        console.log('请求数据预览:', JSON.stringify(articles, null, 2).substring(0, 100) + '...');
        
        const response = await fetch(articlesUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articles, null, 2)
        });
        
        console.log('服务器响应状态:', response.status, response.statusText);
        
        // 获取完整响应内容
        const responseText = await response.text();
        console.log('服务器响应内容:', responseText);
        
        if (response.ok) {
            console.log('文章已成功保存到JSON文件');
            return true;
        } else {
            console.error('保存到JSON文件失败:', response.statusText);
            console.error('响应内容:', responseText);
            return false;
        }
    } catch (error) {
        console.error('保存到JSON文件出错:', error);
        console.error('错误类型:', error.name);
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
        return false;
    }
}

// 导出文章数据为JSON文件（替代方案）
function exportArticlesToJSON() {
    const jsonString = JSON.stringify(articles, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'articles.json';
    
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('文章数据已导出为JSON文件！请将此文件替换到data目录中。', 'success');
}

// 处理删除文章
async function handleDeleteArticle() {
    // 检查是否有选中的文章
    if (!currentArticle) {
        showMessage('请先选择要删除的文章！', 'error');
        return;
    }
    
    // 显示确认对话框
    const confirmed = confirm('确定要删除这篇文章吗？此操作不可恢复！');
    if (!confirmed) {
        return;
    }
    
    try {
        // 从文章数组中删除文章
        const index = articles.findIndex(a => a.id === currentArticle.id);
        if (index !== -1) {
            articles.splice(index, 1);
        }
        
        // 保存到localStorage
        saveArticlesToLocalStorage();
        
        // 保存到JSON文件
        const jsonSaved = await saveArticlesToJSON();
        
        // 显示消息
        if (jsonSaved) {
            showMessage('文章删除成功并已自动同步到博客！', 'success');
        } else {
            showMessage('文章删除成功，但同步到博客失败！', 'warning');
        }
        
        // 重新渲染文章列表
        renderArticlesList();
        
        // 清空表单
        clearForm();
    } catch (error) {
        console.error('删除文章出错:', error);
        showMessage('删除文章失败！', 'error');
    }
}

// 处理导出文章
function handleExportArticles() {
    if (articles.length === 0) {
        showMessage('没有文章可以导出！', 'error');
        return;
    }
    
    // 导出为JSON文件
    exportArticlesToJSON();
}

// 显示消息
function showMessage(text, type = 'success') {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    
    // 3秒后自动隐藏
    setTimeout(hideMessage, 3000);
}

// 隐藏消息
function hideMessage() {
    message.style.display = 'none';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);