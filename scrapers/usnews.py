from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen
from os import listdir
from os.path import isfile, join
import requests


pp = pprint.PrettyPrinter(indent=4)


def extract_schools_and_links(files):
    list_of_schools = []
    for file in files:
        with open("../USNEWS/"+file) as f:
            soup = bs(f.read(), "html.parser")
            if soup:
                print("FOUND SOUP")
                main = soup.find("table",{"class":"ranking-data"})
                if main:
                    print("FOUND MAIN")
                    rows = main.find_all("tr")
                    for row in rows:
                        print("FOUND A SCHOOL")
                        school = {}
                        tds = row.find_all("td")
                        try:
                            innderdiv = tds[0].find("div").find("span",{"class":"rankscore-bronze"})
                            if innderdiv:
                                school["Rank"] = innderdiv.get_text().strip()
                            innderdiv = tds[1].find("a")
                            if innderdiv:
                                school["URL"] = innderdiv.get("href").strip()
                                school["Name"] = innderdiv.get_text().strip()
                            innderdiv = row.find("p",{"class":"location"})
                            if innderdiv:
                                school["Location"] = innderdiv.get_text().strip()
                            list_of_schools.append(school)
                        except IndexError:
                            print("Skip")
    return list_of_schools


files = [f for f in listdir("../USNEWS/") if isfile(join("../USNEWS/", f))]
foo = extract_schools_and_links(files)
df = pd.DataFrame(foo)
df.to_csv("../Output/USNEWSAI.csv",index=False)

