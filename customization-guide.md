# 个人博客客制化教程

## 欢迎来到你的个人博客！

恭喜你成功拥有了一个自己的个人博客网站！这个博客使用HTML、CSS和JavaScript创建，非常适合初学者学习和使用。本教程将详细介绍如何客制化你的博客，让它真正成为你的专属博客。

## 技术栈介绍

- **HTML**：构建网页结构
- **CSS**：设计网页样式
- **JavaScript**：实现交互功能
- **Markdown**：编写文章内容
- **Marked.js**：将Markdown转换为HTML

## 目录结构

你的博客项目包含以下主要文件和文件夹：

```
blog/
├── index.html          # 首页
├── post.html           # 文章详情页
├── about.html          # 关于页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── script.js      # JavaScript文件
└── articles/           # 文章文件夹（未来可用于存储Markdown文件）
```

## 如何修改博客基本信息

### 1. 修改博客名称和标题

**操作文件**：`index.html`, `post.html`, `about.html`

**操作步骤**：

1. 打开任意HTML文件（如`index.html`）
2. 找到`<title>`标签，修改其中的文字：
   ```html
   <title>我的博客</title>  <!-- 修改为你想要的博客名称 -->
   ```
3. 找到导航栏中的logo：
   ```html
   <h1 class="logo">我的博客</h1>  <!-- 修改为你想要的博客名称 -->
   ```
4. 保存文件，刷新浏览器查看效果

### 2. 修改页脚信息

**操作文件**：`index.html`, `post.html`, `about.html`

**操作步骤**：

1. 打开任意HTML文件
2. 找到页脚部分：
   ```html
   <footer class="footer">
       <div class="container">
           <p>&copy; 2025 我的博客. All rights reserved.</p>
       </div>
   </footer>
   ```
3. 修改年份和版权信息
4. 保存文件，刷新浏览器查看效果

## 如何修改博客主题样式

### 1. 修改主题颜色

**操作文件**：`css/style.css`

**操作步骤**：

1. 打开`css/style.css`文件
2. 找到以下部分，修改颜色值：

   ```css
   /* 导航栏背景色 */
   .navbar {
       background-color: #333;  /* 修改为你喜欢的颜色 */
   }

   /* 按钮和链接高亮色 */
   .read-more {
       background-color: #333;  /* 修改为你喜欢的颜色 */
   }

   .read-more:hover {
       background-color: #ff6b6b;  /* 修改为你喜欢的悬停颜色 */
   }

   /* 页脚背景色 */
   .footer {
       background-color: #333;  /* 修改为你喜欢的颜色 */
   }
   ```

3. 保存文件，刷新浏览器查看效果

### 2. 修改字体

**操作文件**：`css/style.css`

**操作步骤**：

1. 打开`css/style.css`文件
2. 找到以下部分，修改字体：
   ```css
   body {
       font-family: 'Arial', sans-serif;  /* 修改为你喜欢的字体 */
   }
   ```

3. 你可以使用Google Fonts来获取更多字体选择，例如：
   ```html
   <!-- 在HTML文件的<head>标签中添加 -->
   <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap" rel="stylesheet">
   ```
   ```css
   /* 在CSS文件中修改 */
   body {
       font-family: 'Noto Sans SC', sans-serif;
   }
   ```

### 3. 修改布局

**操作文件**：`css/style.css`

**操作步骤**：

1. 打开`css/style.css`文件
2. 找到以下部分，修改容器宽度：
   ```css
   .container {
       width: 80%;  /* 修改为你想要的宽度百分比 */
       max-width: 1200px;  /* 修改为你想要的最大宽度 */
   }
   ```

3. 修改文章卡片布局：
   ```css
   .blog-list {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));  /* 修改350px为你想要的卡片宽度 */
       gap: 2rem;  /* 修改为你想要的卡片间距 */
   }
   ```

## 如何添加新文章

**操作文件**：`js/script.js`

**操作步骤**：

1. 打开`js/script.js`文件
2. 找到`articles`数组
3. 在数组中添加一个新的文章对象，格式如下：

   ```javascript
   {
       id: 4,  // 唯一ID，比现有最大ID大1
       title: "新文章标题",  // 文章标题
       date: "2025-12-11",  // 发布日期
       author: "你的名字",  // 作者名字
       excerpt: "这是文章的摘要...",  // 文章摘要（显示在首页）
       image: "图片URL",  // 文章封面图片链接
       content: `# 文章标题

   ## 二级标题

   文章内容...`  // 完整的Markdown格式文章内容
   }
   ```

4. 保存文件，刷新浏览器查看效果

**注意**：
- 图片可以使用Unsplash等免费图片网站的链接
- 文章内容使用Markdown格式编写
- ID必须唯一，不能与现有文章重复

## 如何修改关于页面

**操作文件**：`about.html`

**操作步骤**：

1. 打开`about.html`文件
2. 找到`<div class="about-text">`部分，修改个人介绍文字
3. 找到`<div class="about-info">`部分，修改联系方式：
   ```html
   <div class="about-info">
       <h3>联系方式</h3>
       <ul>
           <li>邮箱：your@email.com</li>  <!-- 修改为你的邮箱 -->
           <li>GitHub：github.com/yourusername</li>  <!-- 修改为你的GitHub -->
           <li>微信：yourwechat</li>  <!-- 修改为你的微信 -->
       </ul>
   </div>
   ```

4. 保存文件，刷新浏览器查看效果

## Markdown语法简单介绍

Markdown是一种简单的标记语言，用于编写格式化文本。以下是常用的Markdown语法：

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 段落和强调
```markdown
普通段落

**粗体文本**

*斜体文本*

~~删除线文本~~
```

### 列表
```markdown
无序列表：
- 项目1
- 项目2
- 项目3

有序列表：
1. 第一步
2. 第二步
3. 第三步
```

### 链接和图片
```markdown
[链接文本](链接URL)

![图片描述](图片URL)
```

### 代码
```markdown
行内代码：`console.log("Hello World!")`

代码块：
```javascript
function hello() {
    console.log("Hello World!");
}
```
```

### 引用
```markdown
> 这是一段引用文字
```

## 如何部署你的博客到互联网

### 方案1：GitHub Pages（免费）

1. 在GitHub上创建一个新的仓库
2. 将你的博客文件上传到仓库
3. 在仓库设置中启用GitHub Pages
4. 选择主分支作为源
5. 访问分配的GitHub Pages URL

### 方案2：Netlify（免费）

1. 访问[Netlify](https://www.netlify.com/)
2. 使用GitHub账号登录
3. 选择你的博客仓库
4. 点击"Deploy site"
5. 等待部署完成，访问分配的Netlify URL

### 方案3：购买域名和服务器

如果你想要一个自定义域名和更灵活的配置，可以购买域名和服务器，然后将文件上传到服务器。

## 常见问题解答

### Q: 我需要安装什么软件来编辑博客文件？
A: 你可以使用任意文本编辑器，如VS Code、Sublime Text、Notepad++等。推荐使用VS Code，它有很多有用的扩展。

### Q: 如何在本地预览博客？
A: 直接用浏览器打开`index.html`文件即可预览。

### Q: 如何添加更多页面？
A: 可以复制现有的HTML文件，修改其中的内容，然后在导航栏中添加链接。

### Q: 如何添加评论功能？
A: 可以使用Disqus、Gitalk等第三方评论系统，按照它们的文档添加到你的博客中。

### Q: 如何添加搜索功能？
A: 可以使用JavaScript实现简单的搜索功能，或者使用Algolia等第三方搜索服务。

## 进阶建议

1. **学习基本的HTML/CSS/JavaScript**：这将帮助你更好地理解和修改你的博客
2. **使用版本控制**：学习使用Git来管理你的博客代码
3. **尝试新的样式**：修改CSS文件，尝试不同的颜色、字体和布局
4. **添加新功能**：如分类、标签、归档等
5. **定期更新**：坚持写博客，定期更新内容

## 总结

恭喜你完成了博客的客制化！现在你的博客已经成为了真正属于你的个人博客。记住，学习编程是一个持续的过程，不要害怕尝试新的东西。如果你遇到问题，可以查阅相关文档或在互联网上搜索解决方案。

祝你博客越办越好！