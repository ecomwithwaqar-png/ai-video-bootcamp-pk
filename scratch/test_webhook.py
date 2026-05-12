import requests
import json

url = "https://script.google.com/macros/s/AKfycbzel9J5ZY8C2ZIhYCt23TlMhkxQ_FgiLU7qvXHZLGApSFKExgqRjuhO5z5m-qoyQtaVbA/exec"
data = {
    "name": "Antigravity Python Test",
    "phone": "923001234567",
    "city": "Islamabad",
    "gclid": "PYTHON_TEST_888"
}

try:
    # Google Apps Script follows redirects (302) on POST
    response = requests.post(url, json=data, allow_redirects=True)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
