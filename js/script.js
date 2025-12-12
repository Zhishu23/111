// 从API加载文章数据
let articles = [];

async function loadArticles() {
    try {
        // 从API加载数据
        const response = await fetch('/api/articles');
        if (response.ok) {
            articles = await response.json();
            console.log('从API加载文章数据成功');
            return articles;
        } else {
            console.error('从API加载文章数据失败:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        return [];
    }
}

// 从API加载页面数据
let pages = {};

async function loadPages() {
    try {
        // 从API加载数据
        const response = await fetch('/api/pages');
        if (response.ok) {
            pages = await response.json();
            console.log('从API加载页面数据成功');
            return pages;
        } else {
            console.error('从API加载页面数据失败:', response.statusText);
            // 使用默认数据
            pages = {
                home: {
                    pageTitle: "Zhishu的博客",
                    logo: "Zhishu的博客",
                    navLinks: [
                        { "text": "首页", "url": "index.html" },
                        { "text": "关于", "url": "about.html" },
                        { "text": "后台管理", "url": "admin.html" }
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
            return pages;
        }
    } catch (error) {
        console.error('加载页面数据失败:', error);
        // 使用默认数据
        pages = {
            home: {
                pageTitle: "Zhishu的博客",
                logo: "Zhishu的博客",
                navLinks: [
                    { "text": "首页", "url": "index.html" },
                    { "text": "关于", "url": "about.html" },
                    { "text": "后台管理", "url": "admin.html" }
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
        return pages;
    }
}

// 渲染导航栏
function renderNavbar() {
    const logo = document.querySelector('.logo');
    const siteTitle = document.querySelector('.site-title');
    const navLinks = document.querySelector('.nav-links');
    
    // 确保pages.home存在
    if (!pages.home) {
        pages.home = {
            pageTitle: "Zhishu的博客",
            logo: "Zhishu的博客",
            navLinks: [
                { "text": "首页", "url": "index.html" },
                { "text": "关于", "url": "about.html" },
                { "text": "后台管理", "url": "admin.html" }
            ],
            footerText: "© 2025 Zhishu的博客. All rights reserved."
        };
    }
    
    // 确保logo存在
    if (!pages.home.logo) {
        pages.home.logo = "Zhishu的博客";
    }
    
    // 确保导航链接存在
    if (!pages.home.navLinks || pages.home.navLinks.length === 0) {
        pages.home.navLinks = [
            { "text": "首页", "url": "index.html" },
            { "text": "关于", "url": "about.html" },
            { "text": "后台管理", "url": "admin.html" }
        ];
    }
    
    if (logo) {
        const logoData = pages.home.logo;
        
        if (typeof logoData === 'object' && logoData.type) {
            if (logoData.type === 'image') {
                // 图片LOGO
                logo.innerHTML = `<img src="${logoData.value || ''}" alt="网站LOGO" style="max-height: 60px; width: auto; vertical-align: middle;">`;
            } else {
                // 文字LOGO
                logo.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold;">${logoData.value || 'Zhishu的博客'}</span>`;
            }
        } else {
            // 旧格式的LOGO
            logo.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold;">${logoData || 'Zhishu的博客'}</span>`;
        }
    }
    
    // 更新网站标题
    if (siteTitle) {
        siteTitle.textContent = pages.home.pageTitle || 'Zhishu的博客';
    }
    
    if (navLinks) {
        navLinks.innerHTML = '';
        pages.home.navLinks.forEach(link => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${link.url || '#'}">${link.text || '链接'}</a>`;
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
        
        // 只显示属于首页的文章
        const homeArticles = articles.filter(article => article.pageId === 'home');
        
        homeArticles.forEach(article => {
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

// 渲染自定义页面
function renderCustomPage() {
    const customPageSection = document.querySelector('.custom-page-section');
    
    if (customPageSection) {
        // 获取页面键
        let pageKey = getUrlParam('page');
        
        if (pageKey && pages[pageKey]) {
            const pageData = pages[pageKey];
            
            // 更新页面标题
            document.title = pageData.pageTitle;
            
            // 更新页面主标题
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = pageData.pageTitle;
            }
            
            // 更新页面内容
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                if (pageData.type === 'article') {
                    // 如果是文章类页面，显示文章列表
                    const pageArticles = articles.filter(article => article.pageId === pageKey);
                    
                    if (pageArticles.length === 0) {
                        pageContent.innerHTML = '<p>该页面暂无文章。</p>';
                    } else {
                        // 渲染文章列表，与首页结构类似
                        pageContent.innerHTML = `<div id="blog-list" class="blog-list"></div>`;
                        const articleList = document.getElementById('blog-list');
                        
                        pageArticles.forEach(article => {
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
                } else {
                    // 如果是其他类型页面，显示静态内容
                    // 确保content是数组，如果不是则转换为数组
                    const contentArray = Array.isArray(pageData.content) ? pageData.content : [pageData.content];
                    pageContent.innerHTML = contentArray.map(paragraph => `<p>${paragraph}</p>`).join('');
                }
            }
        } else {
            // 页面不存在
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = '页面不存在';
            }
            
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = '<p>您访问的页面不存在或已被删除。</p>';
            }
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
    
    // 如果是自定义页面，渲染自定义页面内容
    if (window.location.pathname.includes('page.html')) {
        renderCustomPage();
    }
});