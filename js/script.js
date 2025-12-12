// 从JSON文件加载文章数据
let articles = [];

async function loadArticles() {
    try {
        const response = await fetch('data/articles.json');
        articles = await response.json();
        return articles;
    } catch (error) {
        console.error('加载文章失败:', error);
        return [];
    }
}

// 从JSON文件加载页面数据
let pages = {};

async function loadPages() {
    try {
        const response = await fetch('data/pages.json');
        pages = await response.json();
        return pages;
    } catch (error) {
        console.error('加载页面数据失败:', error);
        return {
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

// 渲染导航栏
function renderNavbar() {
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelector('.nav-links');
    
    if (logo && pages.home && pages.home.logo) {
        const logoData = pages.home.logo;
        
        if (logoData.type === 'image') {
            // 图片LOGO
            logo.innerHTML = `<img src="${logoData.value}" alt="网站LOGO" style="max-height: 40px; vertical-align: middle;">`;
        } else {
            // 文字LOGO
            logo.textContent = logoData.value || logoData;
        }
    }
    
    if (navLinks && pages.home && pages.home.navLinks) {
        navLinks.innerHTML = '';
        pages.home.navLinks.forEach(link => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${link.url}">${link.text}</a>`;
            navLinks.appendChild(li);
        });
    }
}

// 渲染页脚
function renderFooter() {
    const footerText = document.querySelector('.footer p');
    
    if (footerText && pages.home && pages.home.footerText) {
        footerText.innerHTML = pages.home.footerText;
    }
}

// 渲染关于页面
function renderAboutPage() {
    const aboutSection = document.querySelector('.about-section');
    
    if (aboutSection && pages.about) {
        const aboutPage = pages.about;
        
        // 更新页面标题
        document.title = aboutPage.pageTitle;
        
        // 更新关于我标题
        const h2 = aboutSection.querySelector('h2');
        if (h2) {
            h2.textContent = aboutPage.sectionTitle;
        }
        
        // 更新关于内容
        const aboutText = aboutSection.querySelector('.about-text');
        if (aboutText) {
            aboutText.innerHTML = aboutPage.content.map(paragraph => `<p>${paragraph}</p>`).join('');
        }
        
        // 更新联系方式
        const aboutInfo = aboutSection.querySelector('.about-info');
        if (aboutInfo) {
            const h3 = aboutInfo.querySelector('h3');
            if (h3) {
                h3.textContent = aboutPage.contactTitle;
            }
            
            const ul = aboutInfo.querySelector('ul');
            if (ul) {
                ul.innerHTML = aboutPage.contactInfo.map(contact => `<li>${contact.type}：${contact.value}</li>`).join('');
            }
        }
    }
}

// 获取URL参数
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 渲染Markdown内容
function renderMarkdown(markdown) {
    return marked.parse(markdown);
}

// 渲染文章列表
function renderArticleList() {
    const articleList = document.getElementById('blog-list');
    if (articleList) {
        articleList.innerHTML = '';
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'blog-card';
            // 只在有图片时渲染图片标签
            const imageHtml = article.image ? `<img src="${article.image}" alt="${article.title}">` : '';
            articleCard.innerHTML = `
                ${imageHtml}
                <div class="blog-card-content">
                    <h3>${article.title}</h3>
                    <div class="meta">
                        <span>${article.date}</span> • <span>${article.author}</span>
                    </div>
                    <p class="excerpt">${article.excerpt}</p>
                    <a href="post.html?id=${article.id}" class="read-more">阅读更多</a>
                </div>
            `;
            articleList.appendChild(articleCard);
        });
    }
}

// 渲染文章详情
function renderArticleDetail() {
    const blogPost = document.getElementById('blog-post');
    if (blogPost) {
        const articleId = getUrlParam('id');
        const article = articles.find(a => a.id == articleId);
        
        if (article) {
            blogPost.innerHTML = `
                <h2>${article.title}</h2>
                <div class="meta">
                    <span>${article.date}</span> • <span>${article.author}</span>
                </div>
                <div class="content">${renderMarkdown(article.content)}</div>
            `;
            document.title = `${article.title} - Zhishu的博客`;
        } else {
            blogPost.innerHTML = '<h2>文章不存在</h2>';
        }
    }
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', async () => {
    // 并行加载文章和页面数据
    await Promise.all([loadArticles(), loadPages()]);
    
    // 渲染文章列表和详情
    renderArticleList();
    renderArticleDetail();
    
    // 渲染导航栏和页脚（所有页面都需要）
    renderNavbar();
    renderFooter();
    
    // 如果是关于页面，渲染关于页面内容
    if (window.location.pathname.includes('about.html')) {
        renderAboutPage();
    }
});