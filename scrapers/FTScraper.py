""" This scraper works for FT links - copy paste the table itself into a seperate file, since this is really 
only useful for management degrees so no need to automate everything"""

import pprint
import pandas as pd
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup as bs

def extractrow(row):
    school = {}
    tds = row.find_all("td")
    try:
        for td in tds:
            # Ft Tables have em tag information that we don't want
            ems = td.find("em")
            try:
                ems = ems.extract()
            except:
                pass
        school["2017 Rank"] = tds[0].get_text().strip()
        school["2016 Rank"] = tds[1].get_text().strip()
        school["2015 Rank"] = tds[2].get_text().strip()
        school["3 Year Average"] = tds[3].get_text().strip()
        school["School Name"] = tds[4].get_text().strip()
        school["URL"] = tds[4].find("a").get("href")
        school["Country"] = tds[5].get_text().strip()
        school["Programme Name"] = tds[6].get_text().strip()
        school["Salary Today US$"] = tds[7].get_text().strip()
        school["Weighted Salary US$"] = tds[8].get_text().strip()
        school["Salary Percentage Inc"] = tds[9].get_text().strip()
        school["Value"] = tds[10].get_text().strip()
        school["Career Progress Rank"] = tds[11].get_text().strip()
        school["Aims Achieved"] = tds[12].get_text().strip()
        school["Careers Service Rank"] = tds[13].get_text().strip()
        school["Employment"] = tds[14].get_text().strip()
        school["Female Faculty %"] = tds[15].get_text().strip()
        school["Female Student %"] = tds[16].get_text().strip()
        school["Woman Board"] = tds[17].get_text().strip()
        school["Intl. Faculty"] = tds[18].get_text().strip()
        school["Intl. Students"] = tds[19].get_text().strip()
        school["Intl. board"] = tds[20].get_text().strip()
        school["Intl. mobility"] = tds[21].get_text().strip()
        school["Intl. course"] = tds[22].get_text().strip()
        school["Languages"] = tds[23].get_text().strip()
        school["PHD Faculty"] = tds[24].get_text().strip()
        school["Max. Course Fee (Local Currency)"] = tds[25].get_text().strip()
        school["Prog length"] = tds[26].get_text().strip()
        school["Num. enrolled 16/17"] = tds[27].get_text().strip()
        school["Relevant degree"] = tds[28].get_text().strip()
        school["Internships"] = tds[29].get_text().strip()
        pprint.pprint(school)
    except IndexError as e:
        print(e)
        print("Extract Row")
        return {}
    return school

def extract_table(filepath):
    with open(filepath) as f:
        soup = bs(f.read(), "html.parser")
    table = soup.find("table",{"id":"rankingstable"})
    try:
        rows = table.find("tbody").find_all("tr")
        listofschools = [extractrow(row) for row in rows]    
    except Exception as e:
        print(e)
        print("Extract Table")
    finally:
        return listofschools

def get_more_data(school):
    """This function is no longer needed"""
    url = school["URL"]
    if not url:
        return school    
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    tables = soup.find_all("table",{"class":"entitytable halfwidth"})
    for table in tables:
        for row in table.findAll('tr'):
            col = row.findAll('td')
            try:
                heading = col[0].get_text().strip().lower() #Ugly chained functions say wut wut
                val = col[1].get_text()
                school[heading] = val
            except IndexError:
                print("header?")
    # pprint.pprint(school)
    return school

initialtable = extract_table("../FT Table/mim.html")
pprint.pprint(initialtable)
# populated_data = map(get_more_data,initialtable)

df = pd.DataFrame(initialtable,index=None)
df.to_csv("../Output/FTManagement.csv")