"""This scraper handles links similar to https://www.mim-compass.com/rankings/"""
import pprint
import pandas as pd
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup as bs

def extractlistitem(listitem):
    school = {}
    header = listitem.find("div",{"class":"li--head"}).find("h2")
    school["School Name"] = header.get_text().strip()
    header = listitem.find("div",{"class":"li--body"})
    link = header.find("a")
    school["URL"] = link.get("href")
    school["Programme Name"] = link.get_text().strip()
    infolist = header.find("ul",{"class":"infos"})
    lists = infolist.find_all("li")
    try:
        for l in lists:
            title = l.find("span").get_text().strip().lower()
            value = l.find("p").get_text().strip().lower()
            school[title] = value
    except IndexError as e:
        print(e)
    pprint.pprint(school)
    return school

def get_list_of_schools(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    outerdiv = soup.find("ol",{"id":"ranking"})
    lists = outerdiv.find_all("li",{"class":"li--ranking"})
    list_of_schools = list(map(extractlistitem,lists))
    return list_of_schools
    
def get_more_data(school):
    url = school["URL"]
    req = Request("https://www.mim-compass.com"+url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    tablerows = soup.find("table",{"class":"program-table"}).find_all("tr")
    try:
        for row in tablerows[3:]:
            title = row.find("th").get_text().strip().lower()
            value = row.find("td").get_text().strip().lower()
            school[title] = value
    except IndexError as e:
        print(e)
    pprint.pprint(school)
    return school


lists = get_list_of_schools("https://www.mim-compass.com/rankings/")
print("PART ONE DONE _____________________________")
foo = list(map(get_more_data,lists))

df = pd.DataFrame(foo)
df.to_csv("../Output/MIMCompass.csv")    