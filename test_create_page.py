import requests

# 测试创建新页面
new_page_data = {
    "name": "测试页面",
    "type": "blank",
    "pageTitle": "测试页面 - Zhishu的博客"
}

try:
    response = requests.post('http://localhost:5000/api/pages', json=new_page_data)
    print(f'Response status: {response.status_code}')
    print(f'Response data: {response.json()}')
    
    # 检查创建的页面是否包含所有必要字段
    created_page = response.json()
    print('\n验证页面字段:')
    print(f'  content存在: {"content" in created_page}')
    print(f'  content类型: {type(created_page["content"])}')
    print(f'  sectionTitle存在: {"sectionTitle" in created_page}')
    print(f'  contactTitle存在: {"contactTitle" in created_page}')
    print(f'  contactInfo存在: {"contactInfo" in created_page}')
    print(f'  contactInfo类型: {type(created_page["contactInfo"])}')
    
except Exception as e:
    print(f'Error: {e}')