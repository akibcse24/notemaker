from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock login/dashboard flow to reach editor
        page.goto("http://localhost:5173/login")
        if "/login" in page.url:
            page.click("button:has-text('Continue with Google')")
            page.wait_for_url(lambda url: "/dashboard" in url, timeout=10000)

        # Create Note to get to editor
        page.click("text=New Note")
        page.wait_for_url("**/new")
        page.locator("input[type='file']").set_input_files("test_assets/image.png")
        page.wait_for_selector("img[alt='Preview']")
        page.click("button:has-text('Process AI')")
        page.wait_for_url(lambda url: "/note/" in url, timeout=10000)

        # Wait for editor to load (header is present)
        page.wait_for_selector("header")
        page.wait_for_selector("input[placeholder='Note Title']")

        # Check for new buttons
        print("Checking for Print button...")
        # Debug: Print all button titles
        # buttons = page.locator("button").all()
        # for b in buttons:
        #     print(f"Button: {b.get_attribute('title')}")

        if page.locator("button[title='Print / Save as PDF']").count() > 0:
            print("SUCCESS: Print button found.")
        else:
            print("FAILURE: Print button NOT found.")

        print("Checking for Read Aloud button...")
        if page.locator("button[title='Read Aloud']").count() > 0:
             print("SUCCESS: Read Aloud button found.")
        else:
             print("FAILURE: Read Aloud button NOT found.")

        browser.close()

if __name__ == "__main__":
    run()
