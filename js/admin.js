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

// 自定义模态框DOM元素
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalInput = document.getElementById('modal-input');
const modalConfirmBtn = document.getElementById('modal-confirm');
const modalCancelBtn = document.getElementById('modal-cancel');

// 模态框回调函数
let modalCallback = null;

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
const pageFilterSelect = document.getElementById('page-filter-select');

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
const navLinksContainer = document.getElementById('nav-links');
const aboutPageTitle = document.getElementById('about-page-title');
const aboutSectionTitle = document.getElementById('about-section-title');
const aboutContent = document.getElementById('about-content');
const aboutContactTitle = document.getElementById('about-contact-title');
const contactInfo = document.getElementById('contact-info');
const addAboutParagraphBtn = document.getElementById('add-about-paragraph');
const addContactInfoBtn = document.getElementById('add-contact-info');
const savePageBtn = document.getElementById('save-page-btn');

// 显示自定义模态框
function showModal(title, placeholder = '', callback) {
    modalTitle.textContent = title;
    
    // 恢复默认的输入字段
    modalInput.innerHTML = `
        <input type="text" id="modal-input-field" style="
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        " placeholder="${placeholder}">
    `;
    
    const inputField = document.getElementById('modal-input-field');
    if (inputField) {
        inputField.value = '';
        inputField.placeholder = placeholder;
    }
    
    modalCallback = callback;
    customModal.style.display = 'flex';
    
    if (inputField) {
        inputField.focus();
    }
}

// 隐藏自定义模态框
function hideModal() {
    customModal.style.display = 'none';
    const inputField = document.getElementById('modal-input-field');
    if (inputField) {
        inputField.value = '';
    }
    modalCallback = null;
}

// 处理模态框确认
function handleModalConfirm() {
    if (modalCallback) {
        // 检查是否存在单选按钮组
        const radioButtons = document.querySelectorAll('input[name="page-type"]');
        if (radioButtons.length > 0) {
            // 如果是页面类型选择模态框，获取选中的类型
            const selectedRadio = document.querySelector('input[name="page-type"]:checked');
            modalCallback(selectedRadio ? selectedRadio.value : null);
        } else {
            // 否则，尝试获取输入框内容
            const inputField = document.getElementById('modal-input-field');
            modalCallback(inputField ? inputField.value : null);
        }
    }
    // 只有当不是页面类型选择模态框时才隐藏模态框
    // 页面类型选择模态框会在自己的回调中处理隐藏
    const radioButtons = document.querySelectorAll('input[name="page-type"]');
    if (radioButtons.length === 0) {
        hideModal();
    }
}

// 处理模态框取消
function handleModalCancel() {
    if (modalCallback) {
        modalCallback(null);
    }
    hideModal();
}

// 初始化
async function init() {
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
    
    // 绑定模态框事件
    modalConfirmBtn.addEventListener('click', handleModalConfirm);
    modalCancelBtn.addEventListener('click', handleModalCancel);
    
    // 模态框按Enter键确认，按Esc键取消
    document.addEventListener('keydown', (e) => {
        if (customModal.style.display === 'flex') {
            if (e.key === 'Enter') {
                handleModalConfirm();
            } else if (e.key === 'Escape') {
                handleModalCancel();
            }
        }
    });
    
    // 点击模态框外部关闭
    customModal.addEventListener('click', (e) => {
        if (e.target === customModal) {
            hideModal();
        }
    });
    
    // 按Enter键登录
    passwordInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await handleLogin();
        }
    });
    
    // 加载默认页面数据
    await loadPages();
    
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
        
        // 确保页面选择器已渲染并加载当前页面数据
        renderPageSelector();
        loadPageToForm(currentPage);
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
    
    // 如果切换到页面管理标签，确保页面数据已加载并渲染页面选择器
    if (targetTab === 'pages') {
        renderPageSelector();
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

// 填充页面筛选器
function populatePageFilter() {
    if (!pageFilterSelect || !pages) return;
    
    // 清空现有选项，只保留"所有页面"选项
    pageFilterSelect.innerHTML = '<option value="all">所有页面</option>';
    
    // 添加所有文章类型的页面
    Object.values(pages).forEach(page => {
        if (page.type === 'article') {
            const option = document.createElement('option');
            option.value = page.id;
            option.textContent = page.name;
            pageFilterSelect.appendChild(option);
        }
    });
    
    // 添加事件监听器
    pageFilterSelect.addEventListener('change', handlePageFilterChange);
}

// 处理页面筛选器变化
function handlePageFilterChange() {
    renderArticlesList();
}

// 渲染页面选择器
function renderPageSelector() {
    const pageSelect = document.getElementById('page-select');
    if (!pageSelect || !pages) return;
    
    // 保存当前选中的页面
    const currentValue = pageSelect.value;
    
    // 清空现有选项，保留首页和关于页面
    pageSelect.innerHTML = `
        <option value="home">首页</option>
        <option value="about">关于页面</option>
    `;
    
    // 添加所有自定义页面
    Object.keys(pages).forEach(pageKey => {
        if (pageKey !== 'home' && pageKey !== 'about') {
            const option = document.createElement('option');
            option.value = pageKey;
            option.textContent = pages[pageKey].pageTitle || pageKey;
            pageSelect.appendChild(option);
        }
    });
    
    // 恢复之前的选择，如果不存在则选择首页
    if (pageSelect.querySelector(`option[value="${currentValue}"]`)) {
        pageSelect.value = currentValue;
    } else {
        pageSelect.value = currentPage;
    }
    
    // 确保表单显示当前选中页面的内容
    loadPageToForm(pageSelect.value);
}

// 加载页面数据
async function loadPages() {
    try {
        // 从API加载数据
        const response = await fetch('/api/pages');
        if (response.ok) {
            pages = await response.json();
            console.log('从API加载页面数据成功');
        } else {
            // 如果API加载失败，使用默认数据
            pages = {
                home: {
                    id: "home",
                    name: "首页",
                    type: "article",
                    pageTitle: "Zhishu的博客",
                    logo: "Zhishu的博客",
                    navLinks: [
                        { "text": "首页", "url": "index.html" },
                        { "text": "关于", "url": "about.html" }
                    ],
                    footerText: "© 2025 Zhishu的博客. All rights reserved."
                },
                about: {
                    id: "about",
                    name: "关于",
                    type: "article",
                    pageTitle: "关于我 - Zhishu的博客",
                    sectionTitle: "关于我",
                    content: [
                        "你好！欢迎来到我的个人博客。",
                        "我是一名热爱学习和分享的技术爱好者，在这里我会记录我的学习心得、技术笔记和生活感悟。"
                    ]
                }
            };
            console.log('使用默认页面数据');
        }
    } catch (error) {
        console.error('加载页面数据失败:', error);
        // 加载失败时，使用默认数据
        pages = {
            home: {
                id: "home",
                name: "首页",
                type: "article",
                pageTitle: "Zhishu的博客",
                logo: "Zhishu的博客",
                navLinks: [
                    { "text": "首页", "url": "index.html" },
                    { "text": "关于", "url": "about.html" }
                ],
                footerText: "© 2025 Zhishu的博客. All rights reserved."
            },
            about: {
                id: "about",
                name: "关于",
                type: "article",
                pageTitle: "关于我 - Zhishu的博客",
                sectionTitle: "关于我",
                content: [
                    "你好！欢迎来到我的个人博客。",
                    "我是一名热爱学习和分享的技术爱好者，在这里我会记录我的学习心得、技术笔记和生活感悟。"
                ]
            }
        };
    }
    
    // 渲染页面选择器
    renderPageSelector();
    
    // 填充页面筛选器
    populatePageFilter();
}

// 加载页面数据到表单
function loadPageToForm(pageKey) {
    const pageData = pages[pageKey];
    if (!pageData) return;
    
    // 隐藏所有表单
    homePageForm.style.display = 'none';
    aboutPageForm.style.display = 'none';
    customPageForm.style.display = 'none';
    
    if (pageKey === 'home') {
        homePageForm.style.display = 'block';
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
        
        // 渲染导航菜单
        renderNavLinks();
    } else if (pageKey === 'about') {
        aboutPageForm.style.display = 'block';
        aboutPageTitle.value = pageData.pageTitle;
        aboutSectionTitle.value = pageData.sectionTitle;
        aboutContactTitle.value = pageData.contactTitle;
        
        // 渲染关于内容段落
        aboutContent.innerHTML = '';
        (pageData.content || []).forEach((paragraph, index) => {
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
        (pageData.contactInfo || []).forEach((contact, index) => {
            const contactDiv = document.createElement('div');
            contactDiv.className = 'contact-info-item';
            contactDiv.innerHTML = `
                <input type="text" class="contact-type" value="${contact.type}" placeholder="联系方式类型" />
                <input type="text" class="contact-value" value="${contact.value}" placeholder="联系方式值" />
                <button type="button" class="remove-contact-btn" onclick="removeContactInfo(this)">删除</button>
            `;
            contactInfo.appendChild(contactDiv);
        });
    } else {
        // 显示自定义页面表单
        customPageForm.style.display = 'block';
        
        // 设置自定义页面标题
        const customPageTitle = document.getElementById('custom-page-title');
        if (customPageTitle) {
            customPageTitle.value = pageData.pageTitle;
        }
        
        // 渲染自定义页面内容段落
        const customContent = document.getElementById('custom-content');
        if (customContent) {
            customContent.innerHTML = '';
            (pageData.content || []).forEach((paragraph, index) => {
                const paragraphDiv = document.createElement('div');
                paragraphDiv.className = 'form-group';
                paragraphDiv.innerHTML = `
                    <div style="display: flex; gap: 1rem;">
                        <textarea rows="3" class="custom-page-paragraph" style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;">${paragraph}</textarea>
                        <button type="button" class="remove-contact-btn" onclick="removeCustomParagraph(this)">删除</button>
                    </div>
                `;
                customContent.appendChild(paragraphDiv);
            });
        }
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

// 添加自定义页面段落
function addCustomParagraph() {
    const customContent = document.getElementById('custom-content');
    if (!customContent) return;
    
    const paragraphDiv = document.createElement('div');
    paragraphDiv.className = 'form-group';
    paragraphDiv.innerHTML = `
        <div style="display: flex; gap: 1rem;">
            <textarea rows="3" class="custom-page-paragraph" style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;"></textarea>
            <button type="button" class="remove-contact-btn" onclick="removeCustomParagraph(this)">删除</button>
        </div>
    `;
    customContent.appendChild(paragraphDiv);
}

// 删除自定义页面段落
function removeCustomParagraph(button) {
    button.closest('.form-group').remove();
}

// 渲染导航链接
function renderNavLinks() {
    if (!navLinksContainer || !pages.home) return;
    
    navLinksContainer.innerHTML = '';
    
    // 确保 navLinks 是一个数组
    const navLinks = Array.isArray(pages.home.navLinks) ? pages.home.navLinks : [];
    
    navLinks.forEach((link, index) => {
        const linkDiv = document.createElement('div');
        linkDiv.className = 'form-group nav-link-item';
        linkDiv.innerHTML = `
            <div style="display: flex; gap: 1rem;">
                <input type="text" class="nav-link-text" value="${link.text || ''}" placeholder="链接文字" style="flex: 1;">
                <input type="text" class="nav-link-url" value="${link.url || ''}" placeholder="链接URL" style="flex: 1;">
                <button type="button" class="remove-contact-btn" onclick="removeNavLink(this, ${index})">删除</button>
            </div>
        `;
        navLinksContainer.appendChild(linkDiv);
    });
}

// 添加导航链接
function addNavLink() {
    if (!pages.home) pages.home = {};
    if (!pages.home.navLinks) pages.home.navLinks = [];
    
    pages.home.navLinks.push({
        text: '新链接',
        url: '#'
    });
    
    renderNavLinks();
    // 保存导航链接到localStorage
    savePagesToJSON();
}

// 删除导航链接
function removeNavLink(button, index) {
    if (pages.home && pages.home.navLinks) {
        pages.home.navLinks.splice(index, 1);
        renderNavLinks();
        // 保存导航链接到localStorage
        savePagesToJSON();
    }
}

// 保存导航链接
function saveNavLinks() {
    if (!pages.home) pages.home = {};
    if (!pages.home.navLinks) pages.home.navLinks = [];
    
    const navLinkItems = document.querySelectorAll('.nav-link-item');
    pages.home.navLinks = Array.from(navLinkItems).map(item => ({
        text: item.querySelector('.nav-link-text').value.trim(),
        url: item.querySelector('.nav-link-url').value.trim()
    })).filter(link => link.text && link.url);
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

// 显示页面类型选择模态框
function showPageTypeModal(pageName, callback) {
    modalTitle.textContent = '选择页面类型';
    
    // 替换输入框为选择框
    modalInput.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0;">
            <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="radio" name="page-type" value="article" style="margin: 0;"> 文章类页面
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="radio" name="page-type" value="resource" style="margin: 0;"> 资源类页面
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="radio" name="page-type" value="game" style="margin: 0;"> 游戏类页面
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="radio" name="page-type" value="blank" style="margin: 0;"> 空白页面
            </label>
        </div>
    `;
    
    modalCallback = () => {
        const selectedType = document.querySelector('input[name="page-type"]:checked');
        callback(pageName, selectedType ? selectedType.value : null);
        // 恢复输入框并隐藏模态框
        modalInput.innerHTML = '<input type="text" id="modal-input-field" placeholder="" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">';
        hideModal();
    };
    
    customModal.style.display = 'flex';
}

// 处理添加新页面
async function handleAddPage() {
    // 显示自定义模态框获取页面名称
    showModal('添加新页面', '请输入新页面名称（如：新闻）', async (pageName) => {
        if (!pageName || pageName.trim() === '') {
            if (pageName !== null) { // 只有当用户不是点击取消时才显示错误信息
                showMessage('页面名称不能为空！', 'error');
            }
            return;
        }
        
        // 显示页面类型选择模态框
        showPageTypeModal(pageName, async (name, pageTypeValue) => {
            if (!pageTypeValue) {
                return;
            }
        
            // 创建新页面数据
            const newPage = {
                name: name.trim(),
                type: pageTypeValue,
                pageTitle: name.trim() + ' - Zhishu的博客'
            };
            
            try {
                // 使用API创建新页面
                const response = await fetch('/api/pages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newPage)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `创建页面失败: ${response.statusText}`);
                }
                
                // 先获取创建的页面数据，再重新加载所有页面
                const createdPage = await response.json();
                console.log('创建的页面:', createdPage);
                
                // 重新加载所有页面数据
                await loadPages();
                
                // 切换到新页面
                currentPage = createdPage.id;
                
                // 更新页面选择器
                renderPageSelector();
                
                // 等待DOM更新后再设置值和加载表单
                setTimeout(() => {
                    const pageSelectElement = document.getElementById('page-select');
                    if (pageSelectElement) {
                        pageSelectElement.value = currentPage;
                        loadPageToForm(currentPage);
                    }
                }, 100);
                
                showMessage('新页面已创建！', 'success');
            } catch (error) {
                console.error('创建页面失败:', error);
                showMessage(`创建页面失败: ${error.message}`, 'error');
            }
        });
});
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
        
        // 保存导航菜单
        saveNavLinks();
        
        pages.home = {
            ...pages.home,
            pageTitle: homePageTitle.value.trim(),
            logo: logoData,
            footerText: homeFooter.value.trim(),
            navLinks: pages.home.navLinks
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
    } else {
        // 保存自定义页面
        const pageData = pages[currentPage];
        if (pageData) {
            pages[currentPage] = {
                ...pageData,
                pageTitle: document.getElementById('custom-page-title')?.value?.trim() || pageData.pageTitle,
                content: Array.from(document.querySelectorAll('.custom-page-paragraph'))
                    .map(textarea => textarea.value.trim())
                    .filter(text => text !== '') || pageData.content
            };
        }
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

// 保存页面数据到API
async function savePagesToJSON() {
    try {
        // 遍历所有页面并保存
        for (const pageId in pages) {
            const pageData = pages[pageId];
            if (pageData) {
                // 使用PUT请求更新页面
                const response = await fetch(`/api/pages/${pageId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pageData)
                });
                
                if (!response.ok) {
                    throw new Error(`保存页面 ${pageId} 失败: ${response.statusText}`);
                }
            }
        }
        console.log('页面数据已成功保存到API');
        return true;
    } catch (error) {
        console.error('保存页面数据出错:', error);
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
        // 从API加载文章数据
        const response = await fetch('/api/articles');
        if (response.ok) {
            articles = await response.json();
            console.log('从API加载文章数据成功');
        } else {
            console.error('加载文章数据失败:', response.statusText);
            articles = [];
        }
    } catch (error) {
        console.error('加载文章数据出错:', error);
        articles = [];
    }
    renderArticlesList();
}

// 渲染文章列表
function renderArticlesList() {
    articlesList.innerHTML = '';
    
    // 确保 articles 是一个数组
    const validArticles = Array.isArray(articles) ? articles : [];
    
    if (validArticles.length === 0) {
        articlesList.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">暂无文章</div>';
        return;
    }
    
    // 获取当前选中的页面筛选器值
    const selectedPageId = pageFilterSelect ? pageFilterSelect.value : 'all';
    
    // 筛选文章
    let filteredArticles = validArticles;
    if (selectedPageId !== 'all') {
        filteredArticles = validArticles.filter(article => article.pageId === selectedPageId);
    }
    
    if (filteredArticles.length === 0) {
        articlesList.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">该页面暂无文章</div>';
        return;
    }
    
    // 按ID降序排序（最新的文章在前面）
    const sortedArticles = [...filteredArticles].sort((a, b) => b.id - a.id);
    
    sortedArticles.forEach(article => {
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';
        
        // 获取文章所属页面名称
        const pageName = getPageNameById(article.pageId);
        
        articleItem.innerHTML = `
            <h4>${article.title || '无标题'}</h4>
            <div class="meta">
                ${article.date || ''} • ${article.author || '未知作者'} • 
                <span class="page-info">${pageName || '未分配'}</span>
            </div>
            <div class="article-actions">
                <button class="move-btn" data-article-id="${article.id}">移动到页面</button>
            </div>
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
        
        // 绑定移动按钮事件
        const moveBtn = articleItem.querySelector('.move-btn');
        moveBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡，避免选中文章
            handleMoveArticle(article.id);
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
    
    try {
        if (currentArticle) {
            // 更新现有文章
            const response = await fetch(`/api/articles/${currentArticle.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });
            
            if (!response.ok) {
                throw new Error(`更新文章失败: ${response.statusText}`);
            }
            
            // 更新本地数据
            const updatedArticle = await response.json();
            const index = articles.findIndex(a => a.id === currentArticle.id);
            if (index !== -1) {
                articles[index] = updatedArticle;
            }
        } else {
            // 创建新文章前，先获取所有页面列表
            const pagesResponse = await fetch('/api/pages');
            if (!pagesResponse.ok) {
                throw new Error(`获取页面列表失败: ${pagesResponse.statusText}`);
            }
            const allPages = await pagesResponse.json();
            
            // 过滤出文章类页面
            const articlePages = Object.values(allPages).filter(page => page.type === 'article' || page.id === 'home');
            
            // 创建一个Promise来处理模态框的异步选择
            const selectedPageId = await new Promise((resolve) => {
                // 替换输入框为页面选择下拉菜单
                modalInput.innerHTML = `
                    <div style="padding: 1rem;">
                        <h4>选择文章所属页面:</h4>
                        <select id="page-select-for-article" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                            ${articlePages.map(page => `<option value="${page.id}">${page.name}</option>`).join('')}
                        </select>
                    </div>
                `;
                
                modalCallback = () => {
                    const pageSelect = document.getElementById('page-select-for-article');
                    resolve(pageSelect ? pageSelect.value : 'home');
                    // 恢复输入框并隐藏模态框
                    modalInput.innerHTML = '<input type="text" id="modal-input-field" placeholder="" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">';
                    hideModal();
                };
                
                customModal.style.display = 'flex';
            });
            
            // 将选中的页面ID添加到文章数据中
            articleData.pageId = selectedPageId;
            
            // 创建新文章
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });
            
            if (!response.ok) {
                throw new Error(`创建文章失败: ${response.statusText}`);
            }
            
            // 添加到本地数据
            const newArticle = await response.json();
            articles.push(newArticle);
        }
        
        // 显示成功消息
        showMessage(currentArticle ? '文章更新成功！' : '文章添加成功！', 'success');
        
        // 重新渲染文章列表
        renderArticlesList();
        
        // 如果是新文章，加载到表单
        if (!currentArticle) {
            loadArticleToForm(articles[articles.length - 1]);
        }
    } catch (error) {
        console.error('保存文章失败:', error);
        showMessage(`保存文章失败: ${error.message}`, 'error');
    }
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

// 保存文章到localStorage (已废弃，使用API)
async function saveArticlesToJSON() {
    // 这个函数已经不再使用，文章数据通过API直接保存
    return true;
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
        // 使用API删除文章
        const response = await fetch(`/api/articles/${currentArticle.id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`删除文章失败: ${response.statusText}`);
        }
        
        // 从本地数据中删除
        const index = articles.findIndex(a => a.id === currentArticle.id);
        if (index !== -1) {
            articles.splice(index, 1);
        }
        
        // 显示成功消息
        showMessage('文章删除成功！', 'success');
        
        // 重新渲染文章列表
        renderArticlesList();
        
        // 清空表单
        clearForm();
    } catch (error) {
        console.error('删除文章失败:', error);
        showMessage(`删除文章失败: ${error.message}`, 'error');
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

// 根据页面ID获取页面名称
function getPageNameById(pageId) {
    if (!pages || typeof pages !== 'object') {
        return '未知页面';
    }
    
    if (pageId in pages) {
        return pages[pageId].name;
    }
    
    return '未知页面';
}

// 处理移动文章
async function handleMoveArticle(articleId) {
    try {
        // 获取所有页面列表
        const pagesResponse = await fetch('/api/pages');
        if (!pagesResponse.ok) {
            throw new Error(`获取页面列表失败: ${pagesResponse.statusText}`);
        }
        const allPages = await pagesResponse.json();
        
        // 获取文章当前信息
        const articleResponse = await fetch(`/api/articles/${articleId}`);
        if (!articleResponse.ok) {
            throw new Error(`获取文章信息失败: ${articleResponse.statusText}`);
        }
        const article = await articleResponse.json();
        
        // 创建一个Promise来处理模态框的异步选择
        const selectedPageId = await new Promise((resolve) => {
            // 替换输入框为页面选择下拉菜单
            modalTitle.textContent = '选择目标页面';
            modalInput.innerHTML = `
                <div style="padding: 1rem;">
                    <h4>将文章 "${article.title}" 移动到:</h4>
                    <select id="target-page-select" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">
                        ${Object.values(allPages).filter(page => page.type === 'article' || page.id === 'home')
                            .map(page => `<option value="${page.id}" ${page.id === article.pageId ? 'selected' : ''}>${page.name}</option>`).join('')}
                    </select>
                </div>
            `;
            
            modalCallback = () => {
                const pageSelect = document.getElementById('target-page-select');
                resolve(pageSelect ? pageSelect.value : null);
                // 恢复输入框并隐藏模态框
                modalInput.innerHTML = '<input type="text" id="modal-input-field" placeholder="" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;">';
                hideModal();
            };
            
            customModal.style.display = 'flex';
        });
        
        if (!selectedPageId || selectedPageId === article.pageId) {
            return; // 用户取消或选择了相同页面
        }
        
        // 更新文章的页面关联
        const updateResponse = await fetch(`/api/articles/${articleId}/page`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pageId: selectedPageId })
        });
        
        if (!updateResponse.ok) {
            throw new Error(`移动文章失败: ${updateResponse.statusText}`);
        }
        
        // 更新本地数据
        const updatedArticle = await updateResponse.json();
        const index = articles.findIndex(a => a.id === articleId);
        if (index !== -1) {
            articles[index] = updatedArticle;
        }
        
        // 显示成功消息
        showMessage('文章已成功移动到新页面！', 'success');
        
        // 重新渲染文章列表
        renderArticlesList();
        
        // 如果当前表单中加载的是被移动的文章，更新表单信息
        if (currentArticle && currentArticle.id === articleId) {
            loadArticleToForm(updatedArticle);
        }
        
    } catch (error) {
        console.error('移动文章失败:', error);
        showMessage(`移动文章失败: ${error.message}`, 'error');
    }
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