# 后台系统设计文档

## 1. 系统架构

### 1.1 整体架构
- **前端**：HTML + CSS + JavaScript
- **后端**：Flask (Python)
- **数据存储**：JSON文件（可扩展为数据库）
- **API**：RESTful API

### 1.2 核心功能模块
1. **页面管理**：支持文章类、资源类、游戏类、空白页面的创建和管理
2. **文章管理**：支持文章的增删改查操作
3. **UI管理**：支持界面样式的动态调整

## 2. 数据模型

### 2.1 页面数据模型

#### 公共字段
```javascript
{
  "id": "string", // 页面唯一标识
  "name": "string", // 页面名称
  "type": "string", // 页面类型：article | resource | game | blank
  "pageTitle": "string", // 页面标题
  "createdAt": "string", // 创建时间
  "updatedAt": "string" // 更新时间
}
```

#### 文章类页面 (article)
```javascript
{
  ...公共字段,
  "logo": { // 页面Logo
    "type": "string", // text | image
    "value": "string" // 文本内容或图片URL
  },
  "navLinks": [ // 导航链接
    {
      "text": "string",
      "url": "string"
    }
  ],
  "footerText": "string" // 页脚文本
}
```

#### 资源类页面 (resource)
```javascript
{
  ...公共字段,
  "resources": [ // 资源列表
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "type": "string", // 文件类型
      "size": "string" // 文件大小
    }
  ]
}
```

#### 游戏类页面 (game)
```javascript
{
  ...公共字段,
  "games": [ // 游戏列表
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "coverImage": "string",
      "screenshots": ["string"], // 截图URL列表
      "url": "string", // 游戏链接
      "tags": ["string"] // 标签
    }
  ]
}
```

#### 空白页面 (blank)
```javascript
{
  ...公共字段,
  "content": ["string"] // 页面内容段落
}
```

### 2.2 文章数据模型
```javascript
{
  "id": "number", // 文章唯一标识
  "title": "string", // 文章标题
  "date": "string", // 发布日期
  "author": "string", // 作者
  "excerpt": "string", // 摘要
  "image": "string", // 封面图片
  "content": "string", // 文章内容
  "createdAt": "string", // 创建时间
  "updatedAt": "string" // 更新时间
}
```

### 2.3 UI配置数据模型
```javascript
{
  "theme": "string", // 主题：light | dark
  "colors": {
    "primary": "string", // 主色调
    "secondary": "string", // 次要色调
    "background": "string", // 背景色
    "text": "string" // 文本色
  },
  "layout": {
    "sidebar": "boolean", // 是否显示侧边栏
    "footer": "boolean", // 是否显示页脚
    "breadcrumb": "boolean" // 是否显示面包屑
  }
}
```

## 3. API接口设计

### 3.1 页面管理API

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/pages` | GET | 获取所有页面 |
| `/api/pages/<page_id>` | GET | 获取单个页面 |
| `/api/pages` | POST | 创建新页面 |
| `/api/pages/<page_id>` | PUT | 更新页面 |
| `/api/pages/<page_id>` | DELETE | 删除页面 |

### 3.2 文章管理API

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/articles` | GET | 获取所有文章 |
| `/api/articles/<article_id>` | GET | 获取单个文章 |
| `/api/articles` | POST | 创建新文章 |
| `/api/articles/<article_id>` | PUT | 更新文章 |
| `/api/articles/<article_id>` | DELETE | 删除文章 |

### 3.3 UI管理API

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/ui` | GET | 获取UI配置 |
| `/api/ui` | PUT | 更新UI配置 |

## 4. 前端数据交互流程

1. **页面加载**：前端通过fetch API从后端获取页面数据
2. **数据展示**：根据页面类型渲染不同的页面内容
3. **用户操作**：用户通过管理界面进行增删改查操作
4. **数据同步**：前端通过API将数据同步到后端
5. **实时更新**：后端返回更新后的数据，前端实时更新界面

## 5. 安装和运行

### 5.1 后端依赖
- Python 3.6+
- Flask
- uuid

### 5.2 安装步骤
1. 安装Python 3.6+
2. 安装依赖：`pip install -r requirements.txt`
3. 运行后端：`python new_server.py`

### 5.3 访问地址
- 前台访问：http://localhost:5000
- 后台管理：http://localhost:5000/admin.html

## 6. 未来扩展

1. **数据库支持**：将JSON文件存储扩展为SQLite或MySQL数据库
2. **用户认证**：添加用户认证和权限管理功能
3. **文件上传**：支持图片和文件的上传功能
4. **搜索功能**：添加文章和资源的搜索功能
5. **分页功能**：支持文章和资源的分页展示