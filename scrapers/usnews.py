'''Works for pages like https://www.usnews.com/best-graduate-schools/top-science-schools/physics-rankings,
have to download the pages manually for now, though the link is static so in the future could make edits'''

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
        with open("../usnews/"+file) as f:
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
                        except TypeError:
                            print("Skip")
                        except AttributeError:
                            print("Skip"+repr(file))
    return list_of_schools


files = [f for f in listdir("../usnews/") if isfile(join("../usnews/", f))]
foo = extract_schools_and_links(files)
df = pd.DataFrame(foo)
df.to_csv("../Output/USNEWSPhysics.csv",index=False)

