from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver
from urllib.request import Request, urlopen


pp = pprint.PrettyPrinter(indent=4)


def get_source(url):
    wd = webdriver.Chrome("/var/chromedriver/chromedriver")
    try:
        wd.get(url)
        WebDriverWait(wd, 0.5)
        html_page = wd.page_source
        wd.quit()
        return html_page
    except Exception as e:
        wd.quit()
        print(e)


def extract_everything(html_page):
    try:
        htmlsoup = bs(html_page, "html.parser")
        data = dict()
        major = htmlsoup.find(
            "div", {"class": "faculty-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total faculty"})
        for inn in inner:
            data['Total Academic Faculty'] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "inter faculty"})
        for inn in inner:
            data["International Faculty"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total student"})
        for inn in inner:
            data["Total Number of Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent Post Grad Students"] = inn.find("div", {"class": "post"}).find(
                "span", {"class": "perc"}).get_text().strip()
            data["Percent Undergraduate Students"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "int-students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total inter"})
        for inn in inner:
            data["Number of Internal Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent International PostGrad"] = inn.find(
                "div", {"class": "post"}).find("span", {"class": "perc"}).get_text().strip()
            data["Percent International UnderGrad"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
        major = htmlsoup.find("div", {"id": "uni-classifications"})
        inner = major.find_all("li", {"class": "size"})
        for inn in inner:
            data["Size"] = inn.find(
                "span", {"class": "l10 blue right"}).get_text().strip()
        inner = major.find_all("li", {"class": "age"})
        for inn in inner:
            data["Age"] = inn.find(
                "span", {"class": "l10 blue right"}).get_text().strip()
        inner = major.find_all("li", {"class": "dstatus"})
        for inn in inner:
            data["Status"] = inn.find(
                "span", {"class": "l10 blue right"}).get_text().strip()
        inner = major.find_all("li", {"class": "research"})
        for inn in inner:
            data["Research"] = inn.find(
                "span", {"class": "l10 blue right"}).get_text().strip()
        inner = major.find_all("li", {"class": "focus"})
        for inn in inner:
            data["Focus"] = inn.find(
                "span", {"class": "l10 blue right"}).get_text().strip()
        return data
    except Exception as e:
        print(e)
        print("In Extract Everything")
        return {}


def extract_data(path):
    everything = []
    with open(path) as file:
        soup = bs(file.read(), "html.parser")

        table = soup.find("table", {"id": "qs-rankings-indicators"})
        rows = table.find_all("tr")
        count = 0
        for row in rows:
            elements = row.find_all("td")
            if(elements):
                temp = dict()
                temp['Rank'] = elements[0].get_text()
                temp['Name'] = elements[1].get_text()
                temp['URL'] = elements[1].find("a").get("href")
                temp['Overall Score'] = elements[2].get_text()
                temp['Academic Reputation'] = elements[3].get_text()
                temp['Citations Per Paper'] = elements[4].get_text()
                temp['Employer Reputation'] = elements[5].get_text()
                temp['H-Index Citations'] = elements[6].get_text()
                everything.append(temp)
                count += 1
                print(count)

    return everything


def extract_table(url):
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urlopen(req).read()
        data = dict()
        htmlsoup = bs(webpage, "html.parser")
        major = htmlsoup.find(
            "div", {"class": "faculty-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total faculty"})
        for inn in inner:
            data['Total Academic Faculty'] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "inter faculty"})
        for inn in inner:
            data["International Faculty"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total student"})
        for inn in inner:
            data["Total Number of Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent Post Grad Students"] = inn.find("div", {"class": "post"}).find(
                "span", {"class": "perc"}).get_text().strip()
            data["Percent Undergraduate Students"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "int-students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total inter"})
        for inn in inner:
            data["Number of Internal Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent International PostGrad"] = inn.find(
                "div", {"class": "post"}).find("span", {"class": "perc"}).get_text().strip()
            data["Percent International UnderGrad"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
        return data
    except Exception as e:
	    print(e)
	    print("In Extract Everything")
	    return {}


count = 0


def doshit(thing):
    url = thing['URL']
    try:
        #moreshit = extract_everything(get_source(url))
        moreshit = extract_table(url)
        foo = {**thing, **moreshit}
        pp.pprint(foo)
        return foo
    except Exception as e:
        print(e)
        print("Merging " + url)

result = extract_data("QS World University Rankings by Subject 2016 - Economics & Econometrics _ Top Universities.html")
bullshit = list(map(doshit, result))
df = pd.DataFrame(bullshit)
df.to_csv("Output/QS Economics")
print("CHEM E DONE")

# result = extract_data(
#     "Computer Science & Information Systems _ Top Universities.html")
# bullshit = list(map(doshit, result))
# df = pd.DataFrame(bullshit)
# df.to_csv("CompSci.csv")
# print("COMPSCI E DONE")


# result = extract_data(
#     "Mechanical, Aeronautical & Manufacturing Engineering _ Top Universities.html")
# bullshit = list(map(doshit, result))
# df = pd.DataFrame(bullshit)
# df.to_csv("Mechanical Engineering out.csv")
# print("MECH E DONE")

# result = extract_data(
#     "Electrical & Electronic Engineering _ Top Universities.html")
# bullshit = list(map(doshit, result))
# df = pd.DataFrame(bullshit)
# df.to_csv("Electrical Engineering out.csv")
# print("EE DONE")

# result = extract_data(
#     "Electrical & Electronic Engineering _ Top Universities.html")


# result = extract_data("Chemical Engineering _ Top Universities.html")
# df = pd.DataFrame(result)
# df.to_csv("Chemical Engineering out.csv")
# result = extract_data("Mechanical, Aeronautical & Manufacturing Engineering _ Top Universities.html")
# df = pd.DataFrame(result)
# df.to_csv("MAM Engineering out.csv")
# result = extract_data("Computer Science & Information Systems _ Top Universities.html")
# df = pd.DataFrame(result)
# df.to_csv("Computer Science out.csv")
