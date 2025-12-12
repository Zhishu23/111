import requests

try:
    r = requests.get('http://localhost:5000/api/pages')
    print(f'Server status: {r.status_code}')
    print(f'Response: {r.json()}')
except Exception as e:
    print(f'Server error: {e}')