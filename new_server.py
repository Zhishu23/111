#!/usr/bin/env python3

from flask import Flask, jsonify, request, send_from_directory
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)

# 设置数据文件路径
DATA_DIR = 'data'
ARTICLES_FILE = os.path.join(DATA_DIR, 'articles.json')
PAGES_FILE = os.path.join(DATA_DIR, 'pages.json')
UI_CONFIG_FILE = os.path.join(DATA_DIR, 'ui_config.json')

# 确保数据目录存在
os.makedirs(DATA_DIR, exist_ok=True)

# 初始化数据文件
def init_data_files():
    # 初始化文章文件
    if not os.path.exists(ARTICLES_FILE):
        with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    
    # 初始化页面文件
    if not os.path.exists(PAGES_FILE):
        default_pages = {
            "home": {
                "id": "home",
                "name": "首页",
                "type": "article",
                "pageTitle": "Zhishu的博客",
                "logo": {
                    "type": "text",
                    "value": "Zhishu的博客"
                },
                "navLinks": [
                    {"text": "首页", "url": "index.html"},
                    {"text": "关于", "url": "about.html"},
                    {"text": "后台管理", "url": "admin.html"}
                ],
                "footerText": "© 2025 Zhishu的博客. All rights reserved.",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            },
            "about": {
                "id": "about",
                "name": "关于",
                "type": "blank",
                "pageTitle": "关于我 - Zhishu的博客",
                "content": [
                    "你好！欢迎来到我的个人博客。",
                    "我是一名热爱学习和分享的技术爱好者，在这里我会记录我的学习心得、技术笔记和生活感悟。"
                ],
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            }
        }
        with open(PAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_pages, f, ensure_ascii=False, indent=2)
    
    # 初始化UI配置文件
    if not os.path.exists(UI_CONFIG_FILE):
        default_ui = {
            "theme": "light",
            "colors": {
                "primary": "#3498db",
                "secondary": "#2ecc71",
                "background": "#ffffff",
                "text": "#333333"
            },
            "layout": {
                "sidebar": False,
                "footer": True,
                "breadcrumb": False
            }
        }
        with open(UI_CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_ui, f, ensure_ascii=False, indent=2)

# 加载数据
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存数据
def save_data(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# CORS中间件
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# 静态文件服务
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# 页面管理API

# 获取所有页面
@app.route('/api/pages', methods=['GET'])
def get_pages():
    pages = load_data(PAGES_FILE)
    return jsonify(pages)

# 获取单个页面
@app.route('/api/pages/<page_id>', methods=['GET'])
def get_page(page_id):
    pages = load_data(PAGES_FILE)
    if page_id in pages:
        return jsonify(pages[page_id])
    return jsonify({'error': 'Page not found'}), 404

# 创建新页面
@app.route('/api/pages', methods=['POST'])
def create_page():
    pages = load_data(PAGES_FILE)
    new_page = request.json
    
    # 验证必填字段
    if 'name' not in new_page:
        return jsonify({'error': 'Name is required'}), 400
    
    if 'type' not in new_page or new_page['type'] not in ['article', 'resource', 'game', 'blank']:
        return jsonify({'error': 'Type is required and must be one of: article, resource, game, blank'}), 400
    
    # 生成唯一ID
    if 'id' not in new_page:
        new_page['id'] = str(uuid.uuid4())[:8]
    
    # 设置默认值
    if 'pageTitle' not in new_page:
        new_page['pageTitle'] = new_page['name'] + ' - Zhishu的博客'
    
    # 设置创建和更新时间
    new_page['createdAt'] = datetime.now().isoformat()
    new_page['updatedAt'] = datetime.now().isoformat()
    
    # 根据页面类型设置默认字段
    if new_page['type'] == 'article':
        if 'logo' not in new_page:
            new_page['logo'] = {
                'type': 'text',
                'value': new_page['name']
            }
        if 'navLinks' not in new_page:
            new_page['navLinks'] = []
        if 'footerText' not in new_page:
            new_page['footerText'] = f'© 2025 {new_page["name"]}. All rights reserved.'
        # 确保内容字段存在
        if 'content' not in new_page:
            new_page['content'] = [f'这是{new_page["name"]}页面的内容。']
    elif new_page['type'] == 'resource':
        if 'resources' not in new_page:
            new_page['resources'] = []
        # 确保内容字段存在
        if 'content' not in new_page:
            new_page['content'] = [f'这是{new_page["name"]}资源页面的内容。']
    elif new_page['type'] == 'game':
        if 'games' not in new_page:
            new_page['games'] = []
        # 确保内容字段存在
        if 'content' not in new_page:
            new_page['content'] = [f'这是{new_page["name"]}游戏页面的内容。']
    elif new_page['type'] == 'blank':
        if 'content' not in new_page:
            new_page['content'] = [f'这是{new_page["name"]}页面的内容。']
        # 为类似about的页面添加额外字段
        if 'sectionTitle' not in new_page:
            new_page['sectionTitle'] = new_page['name']
        if 'contactTitle' not in new_page:
            new_page['contactTitle'] = '联系方式'
        if 'contactInfo' not in new_page:
            new_page['contactInfo'] = []
    
    # 确保所有页面都有基本的内容字段
    if 'content' not in new_page:
        new_page['content'] = [f'这是{new_page["name"]}页面的内容。']
    
    # 添加到导航菜单
    if new_page['id'] != 'home':
        if 'home' in pages:
            if 'navLinks' not in pages['home']:
                pages['home']['navLinks'] = []
            pages['home']['navLinks'].append({
                'text': new_page['name'],
                'url': f'page.html?page={new_page["id"]}'
            })
            pages['home']['updatedAt'] = datetime.now().isoformat()
    
    # 保存新页面
    pages[new_page['id']] = new_page
    save_data(PAGES_FILE, pages)
    
    return jsonify(new_page), 201

# 更新页面
@app.route('/api/pages/<page_id>', methods=['PUT'])
def update_page(page_id):
    pages = load_data(PAGES_FILE)
    if page_id not in pages:
        return jsonify({'error': 'Page not found'}), 404
    
    updated_page = request.json
    updated_page['updatedAt'] = datetime.now().isoformat()
    
    # 合并更新
    pages[page_id].update(updated_page)
    
    save_data(PAGES_FILE, pages)
    return jsonify(pages[page_id])

# 删除页面
@app.route('/api/pages/<page_id>', methods=['DELETE'])
def delete_page(page_id):
    pages = load_data(PAGES_FILE)
    if page_id not in pages:
        return jsonify({'error': 'Page not found'}), 404
    
    # 从导航菜单中移除
    if 'home' in pages and 'navLinks' in pages['home']:
        pages['home']['navLinks'] = [
            link for link in pages['home']['navLinks'] 
            if not link['url'].endswith(f'page={page_id}')
        ]
        pages['home']['updatedAt'] = datetime.now().isoformat()
    
    del pages[page_id]
    save_data(PAGES_FILE, pages)
    
    return jsonify({'message': 'Page deleted successfully'})

# 文章管理API

# 获取所有文章
@app.route('/api/articles', methods=['GET'])
def get_articles():
    articles = load_data(ARTICLES_FILE)
    return jsonify(articles)

# 获取单个文章
@app.route('/api/articles/<article_id>', methods=['GET'])
def get_article(article_id):
    articles = load_data(ARTICLES_FILE)
    for article in articles:
        if str(article['id']) == article_id:
            return jsonify(article)
    return jsonify({'error': 'Article not found'}), 404

# 获取特定页面的文章
@app.route('/api/pages/<page_id>/articles', methods=['GET'])
def get_articles_by_page(page_id):
    articles = load_data(ARTICLES_FILE)
    # 筛选出关联到该页面的文章
    page_articles = [article for article in articles if article.get('pageId') == page_id]
    return jsonify(page_articles)

# 创建新文章
@app.route('/api/articles', methods=['POST'])
def create_article():
    articles = load_data(ARTICLES_FILE)
    new_article = request.json
    
    # 验证必填字段
    if 'title' not in new_article or 'content' not in new_article:
        return jsonify({'error': 'Title and content are required'}), 400
    
    # 生成唯一ID和日期
    new_article['id'] = int(datetime.now().timestamp() * 1000)
    new_article['date'] = datetime.now().strftime('%Y-%m-%d')
    new_article['createdAt'] = datetime.now().isoformat()
    new_article['updatedAt'] = datetime.now().isoformat()
    
    # 设置默认值
    if 'author' not in new_article:
        new_article['author'] = 'Zhishu'
    if 'excerpt' not in new_article:
        new_article['excerpt'] = new_article['content'][:100] + '...'
    if 'image' not in new_article:
        new_article['image'] = None
    # 添加页面关联字段，默认关联到首页
    if 'pageId' not in new_article:
        new_article['pageId'] = 'home'
    
    articles.append(new_article)
    save_data(ARTICLES_FILE, articles)
    
    return jsonify(new_article), 201

# 更新文章
@app.route('/api/articles/<article_id>', methods=['PUT'])
def update_article(article_id):
    articles = load_data(ARTICLES_FILE)
    
    for i, article in enumerate(articles):
        if str(article['id']) == article_id:
            articles[i].update(request.json)
            articles[i]['updatedAt'] = datetime.now().isoformat()
            save_data(ARTICLES_FILE, articles)
            return jsonify(articles[i])
    
    return jsonify({'error': 'Article not found'}), 404

# 删除文章
@app.route('/api/articles/<article_id>', methods=['DELETE'])
def delete_article(article_id):
    articles = load_data(ARTICLES_FILE)
    
    for i, article in enumerate(articles):
        if str(article['id']) == article_id:
            del articles[i]
            save_data(ARTICLES_FILE, articles)
            return jsonify({'message': 'Article deleted successfully'})
    
    return jsonify({'error': 'Article not found'}), 404

# 更新文章的页面关联
@app.route('/api/articles/<article_id>/page', methods=['PUT'])
def update_article_page(article_id):
    articles = load_data(ARTICLES_FILE)
    data = request.json
    
    for i, article in enumerate(articles):
        if str(article['id']) == article_id:
            if 'pageId' in data:
                articles[i]['pageId'] = data['pageId']
                articles[i]['updatedAt'] = datetime.now().isoformat()
                save_data(ARTICLES_FILE, articles)
                return jsonify(articles[i])
            return jsonify({'error': 'pageId is required'}), 400
    
    return jsonify({'error': 'Article not found'}), 404

# UI管理API

# 获取UI配置
@app.route('/api/ui', methods=['GET'])
def get_ui_config():
    ui_config = load_data(UI_CONFIG_FILE)
    return jsonify(ui_config)

# 更新UI配置
@app.route('/api/ui', methods=['PUT'])
def update_ui_config():
    ui_config = load_data(UI_CONFIG_FILE)
    ui_config.update(request.json)
    save_data(UI_CONFIG_FILE, ui_config)
    return jsonify(ui_config)

if __name__ == '__main__':
    init_data_files()
    print("\n博客服务器已启动！")
    print("访问地址: http://localhost:5000")
    print("后台管理: http://localhost:5000/admin.html")
    print("按 Ctrl+C 停止服务器\n")
    app.run(debug=True, port=5000)