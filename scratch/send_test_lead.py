import requests
import json

url = "https://script.google.com/macros/s/AKfycbzmdlW8h5Uhme6QYO_dfmJ7zW6VRjeAZvPybnt9gBXwAM5Uy-OUoh6XCQxRY21fhQah/exec"
payload = {
    "Name": "Antigravity Test",
    "Phone": "03001234567",
    "City": "AI City",
    "URL": "https://aibootcamp.com/checkout.html?gclid=GADS_TEST_12345",
    "Traffic Type": "google_ads",
    "gclid": "GADS_TEST_12345",
    "event_id": "test_id_999"
}

print(f"Sending test lead to {url}...")
try:
    response = requests.post(url, data=json.dumps(payload), headers={'Content-Type': 'application/json'}, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
