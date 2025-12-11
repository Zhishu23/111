// 博客后台管理系统

// 简单的登录密码（可以修改为你想要的密码）
const ADMIN_PASSWORD = 'admin123';

// 文章数据
let articles = [];
let currentArticle = null;

// DOM元素
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
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
const exportBtn = document.getElementById('export-btn');
const articlesList = document.getElementById('articles-list');

// 初始化
function init() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // 绑定事件
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    saveBtn.addEventListener('click', handleSaveArticle);
    newBtn.addEventListener('click', handleNewArticle);
    exportBtn.addEventListener('click', handleExportArticles);
    
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