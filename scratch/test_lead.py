import requests
import json

url = "https://aivideobootcamp.online/api/capi"
payload = {
    "event_name": "Lead",
    "event_id": "test_evt_123",
    "event_source_url": "https://aivideobootcamp.online/test",
    "gclid": "GCLID_TEST_12345",
    "user_data": {
        "fn": "Test User",
        "ph": "923458996578",
        "em": "test@example.com",
        "city": "Karachi"
    },
    "custom_data": {
        "traffic_type": "paid"
    }
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(payload), headers=headers)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
