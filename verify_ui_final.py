from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:5173/login")
        if "/login" in page.url:
            page.click("button:has-text('Continue with Google')")
            page.wait_for_url(lambda url: "/dashboard" in url, timeout=10000)

        page.click("text=New Note")
        page.locator("input[type='file']").set_input_files("test_assets/image.png")
        page.wait_for_selector("img[alt='Preview']")
        page.click("button:has-text('Process AI')")
        page.wait_for_url(lambda url: "/note/" in url, timeout=10000)

        page.wait_for_selector("header")
        page.wait_for_selector(".diagram-component")

        page.screenshot(path="/home/jules/verification/final_features.png")
        print("Screenshot saved.")
        browser.close()

if __name__ == "__main__":
    run()
