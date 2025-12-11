import requests
import json

# 测试数据
test_data = [
    {
        "id": 1,
        "title": "测试文章",
        "date": "2023-06-15",
        "author": "测试作者",
        "excerpt": "这是一篇测试文章",
        "content": "这是测试文章的内容"
    }
]

# 发送PUT请求
try:
    print("正在发送PUT请求...")
    url = "http://localhost:8200/data/articles.json"
    headers = {"Content-Type": "application/json"}
    response = requests.put(url, json=test_data, headers=headers, timeout=10)
    
    print(f"响应状态码: {response.status_code}")
    print(f"响应状态文本: {response.reason}")
    print(f"响应头: {dict(response.headers)}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("请求成功！")
    else:
        print("请求失败！")
        
except Exception as e:
    print(f"请求出错: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()