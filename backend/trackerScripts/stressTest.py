import time
import requests
import csv
from datetime import datetime

# Replace with your session ID
session_id = ""

# URL to be tested
url = f"https://hst-api.wialon.com/wialon/ajax.html?svc=core/search_items&params=%7B%22spec%22%3A%7B%22itemsType%22%3A%22avl_unit%22%2C%22propName%22%3A%22sys_name%22%2C%22propValueMask%22%3A%22*%22%2C%22sortType%22%3A%22sys_name%22%7D%2C%22force%22%3A1%2C%22flags%22%3A1%2C%22from%22%3A0%2C%22to%22%3A0%7D&sid={session_id}"

# Number of requests
num_requests = 1000
interval = 5  # seconds

# CSV file to store results
csv_file = "stress_test_results.csv"

def log_results(response_time, error=None):
    with open(csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([datetime.now(), response_time, error])

def main():
    # Create or clear the CSV file
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp", "Response Time (ms)", "Error"])

    for i in range(num_requests):
        start_time = time.time()
        try:
            response = requests.get(url)
            response_time = (time.time() - start_time) * 1000  # in milliseconds
            if response.status_code != 200:
                log_results(response_time, f"HTTP {response.status_code}")
            else:
                print(response.text)
                log_results(response_time)
        except requests.RequestException as e:
            response_time = (time.time() - start_time) * 1000  # in milliseconds
            log_results(response_time, str(e))
        
        print(f"Request {i+1}/{num_requests} completed.")
        time.sleep(interval)

if __name__ == "__main__":
    main()
