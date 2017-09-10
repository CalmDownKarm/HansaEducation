"""Handles parsing the CS Ranking Website - Copy the ranked element table to a file 
and then using beautifulsoup to parse it"""
import pandas as pd
import pprint
from bs4 import BeautifulSoup as bs
from os import listdir
from os.path import isfile, join

def extract_table_data(file):
    list_of_schools = []
    with open(file) as f:
        soup = bs(f.read(),"html.parser")
        if soup:
            rows = soup.find_all("tr")
            for row in rows:
                tds = row.find_all("td")
                try:
                    if(len(tds)==4):
                        school = {}
                        school["Rank"] = tds[0].get_text().strip()
                        school["Name"] = tds[1].get_text().strip()[1:-2]
                        school["Avg Publication Count"] = tds[2].get_text().strip()
                        school["Num. Published Faculty"] = tds[3].get_text().strip()
                        if(school["Rank"]):
                            pprint.pprint(school)
                            list_of_schools.append(school)
                except IndexError:
                    print("skipped one")
        else:
            print("No soup for you")
    return list_of_schools

files = [join("../CSRankings/", f) for f in listdir("../CSRankings/") if isfile(join("../CSRankings", f))]
data = extract_table_data(files[0])
df = pd.DataFrame(data)
df.to_csv("../Output/CSRankingsCSV.csv")