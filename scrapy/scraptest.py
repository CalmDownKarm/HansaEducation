from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver


def get_source(url):
    wd = webdriver.FireFox()
    try:
        wd.get(url)
        html_page = wd.page_source
        wd.quit()
        return html_page
    except Exception as e:
        wd.quit()
        print(e)

print(get_source("https://www.usnews.com/education/best-global-universities/harvard-university-166027"))