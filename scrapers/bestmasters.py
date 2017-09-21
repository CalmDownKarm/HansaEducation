"""This script is used for pages similar to view-source:http://www.best-masters.com/ranking-master-international-management.html """

import pprint
import pandas as pd
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup as bs

def get_links(url):
    """Function takes in a url and extracts all ranking table list links"""
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    outerdivs = soup.find_all("div",{"class":"col-sm-4 zone-block"})
    links = [div.find("a").get("href") for div in outerdivs]    
    return links

def get_data_from_ranking_table(url):
    """for links of rankings tables, extract information about schools """
    list_of_schools = []
    req = Request('http://www.best-masters.com'+url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    if soup:
        outer = soup.find("div",{"id":"header"})
        filetitle = outer.get_text().strip().lower()
        if filetitle:
            print(filetitle)
        else:
            print("can't find filetitle")
        table = soup.find("table",{"class":"program-list"})
        rows = table.find_all("tr")
        for row in rows:
            school = {}
            tds = row.find_all("td")
            try:
                school["Country"] = tds[0].get_text().strip()
                school["Rank"] = tds[1].get_text().strip()
                pees = tds[2].find_all("p")
                school["Course Name"] = pees[0].get_text().strip()
                school["College Name"] = pees[1].get_text().strip()
                list_of_schools.append(school)
                pprint.pprint(school)
            except IndexError as e:
                print(e)        
        df = pd.DataFrame(list_of_schools)
        df.to_csv("../Output"+filetitle+".csv")
    else:
        print("NO SOUP")
    return


courses = get_links("http://www.best-masters.com/ranking-master-international-management.html")
for x in courses:
    get_data_from_ranking_table(x)