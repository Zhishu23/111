import json
import os
from datetime import datetime

# 文章文件路径
ARTICLES_FILE = os.path.join('data', 'articles.json')

# 读取现有文章数据
with open(ARTICLES_FILE, 'r', encoding='utf-8') as f:
    articles = json.load(f)

# 为没有pageId字段的文章添加默认值
something_updated = False
for article in articles:
    if 'pageId' not in article:
        article['pageId'] = 'home'
        article['updatedAt'] = datetime.now().isoformat()
        something_updated = True
    # 确保所有文章都有createdAt字段
    if 'createdAt' not in article:
        article['createdAt'] = datetime.now().isoformat()
        something_updated = True

# 如果有更新，保存数据
if something_updated:
    with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    print(f"已更新 {len(articles)} 篇文章，添加了pageId字段")
else:
    print("所有文章都已经有pageId字段，不需要更新")
