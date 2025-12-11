#!/usr/bin/env python3

import http.server
import socketserver
import json
import os

PORT = 8300
ARTICLES_FILE = 'data/articles.json'
PAGES_FILE = 'data/pages.json'

# 创建一个自定义的请求处理器类
class BlogRequestHandler(http.server.SimpleHTTPRequestHandler):
    # 处理CORS请求
    def end_headers(self):
        # 添加CORS头部
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()
        return
    def do_PUT(self):
        """处理PUT请求，用于保存文章或页面数据到JSON文件"""
        print(f"收到PUT请求: {self.path}")
        
        # 处理文章数据
        if self.path == '/data/articles.json':
            try:
                # 获取请求体长度
                content_length = int(self.headers.get('Content-Length', 0))
                print(f"请求体长度: {content_length}")
                
                # 读取请求体内容
                body = self.rfile.read(content_length)
                print(f"请求体内容: {body.decode('utf-8')[:100]}...")
                
                # 解析JSON数据
                articles = json.loads(body)
                print(f"解析后的文章数量: {len(articles)}")
                
                # 确保data目录存在
                os.makedirs('data', exist_ok=True)
                print(f"data目录已存在或创建成功")
                
                # 将数据写入JSON文件
                with open(ARTICLES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(articles, f, ensure_ascii=False, indent=2)
                print(f"数据已成功写入: {ARTICLES_FILE}")
                
                # 发送成功响应
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'OK')
                return
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                print(f"处理PUT请求时出错: {error_msg}")
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(error_msg.encode('utf-8'))
                return
        
        # 处理页面数据
        elif self.path == '/data/pages.json':
            try:
                # 获取请求体长度
                content_length = int(self.headers.get('Content-Length', 0))
                print(f"请求体长度: {content_length}")
                
                # 读取请求体内容
                body = self.rfile.read(content_length)
                print(f"请求体内容: {body.decode('utf-8')[:100]}...")
                
                # 解析JSON数据
                pages = json.loads(body)
                print(f"解析后的页面数量: {len(pages)}")
                
                # 确保data目录存在
                os.makedirs('data', exist_ok=True)
                print(f"data目录已存在或创建成功")
                
                # 将数据写入JSON文件
                with open(PAGES_FILE, 'w', encoding='utf-8') as f:
                    json.dump(pages, f, ensure_ascii=False, indent=2)
                print(f"数据已成功写入: {PAGES_FILE}")
                
                # 发送成功响应
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'OK')
                return
            except Exception as e:
                error_msg = f"Error: {str(e)}"
                print(f"处理PUT请求时出错: {error_msg}")
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(error_msg.encode('utf-8'))
                return
        
        # 对于其他PUT请求，返回404
        self.send_response(404)
        self.end_headers()
    
    def do_POST(self):
        """处理POST请求，也用于保存文章到JSON文件"""
        # 复用PUT请求的处理逻辑
        return self.do_PUT()

# 启动服务器
with socketserver.TCPServer(("", PORT), BlogRequestHandler) as httpd:
    print(f"\n博客服务器已启动！")
    print(f"访问地址: http://localhost:{PORT}")
    print(f"后台管理: http://localhost:{PORT}/admin.html")
    print(f"按 Ctrl+C 停止服务器\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
