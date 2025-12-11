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
            articleCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}">
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
    await loadArticles();
    renderArticleList();
    renderArticleDetail();
});