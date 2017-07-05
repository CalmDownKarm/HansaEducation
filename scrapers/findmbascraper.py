from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen

pp = pprint.PrettyPrinter(indent=4)


def extract_links(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    list_of_schools = []
    table = soup.find("table", {"class": "table table-striped table-bordered"})
    rows = table.find_all("tr")
    for row in rows:
        furfur = row.find_all("td")
        if furfur:
            rank = furfur[0].get_text().strip()
        element = row.find("a")
        if element:
            data = {}
            data['Name'] = element.get_text()
            data['URL'] = element.get("href")
            data['Rank'] = rank
            list_of_schools.append(data)
    return list_of_schools


def get_data_from_each_link(datadict):
    try:
        url = datadict['URL']
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urlopen(req).read()
        soup = bs(webpage, "html.parser")
        major_div = soup.find("div", {"class": "col-sm-6 school-stats"})
        if major_div:
            inner_div = major_div.find(
                "div", {"class": "col-xs-6 school-details-stats"})
            rows = inner_div.find_all("p")
            for row in rows:
                title = row.find("span", {"class": "school-stat-title"})
                if title:
                    val = row.find("span", {"class": "school-stat-value"})
                datadict[title.get_text().strip()] = val.get_text().strip()

        major_div = soup.find("div", {"class": "school-program-list"})
        if major_div:
            midsoup = ""
            for tag in major_div.find("h3").next_siblings:
                if tag.name == "h3":
                    break
                else:
                    midsoup += str(tag)
            divs = bs(midsoup, "html.parser").find_all(
                "div", {"class": "program-item-holder"})
            listofprograms = []
            for div in divs:
                program = {}
                titleDiv = div.find("div", {"class": "row program-item"})
                if titleDiv:
                    title = titleDiv.find("div", {"class": "col-xs-9"}).get_text().strip()
                    progcost = titleDiv.find(
                        "div", {"class": "col-xs-3 text-right"}).get_text().strip()
                program["Title"] = title
                program["Cost"] = progcost
                programdiv = div.find("div", {"class": "accordion-body program-detail"})
                rows = programdiv.find_all("div", {"class": "row"})
                for row in rows:
                    title = row.find("div", {"class": "col-sm-3"})
                    val = row.find("div", {"class": "col-sm-9"})
                    if title:
                        program[title.get_text().strip()] = val.get_text().strip()
                    urlfield = row.find("div", {"class": "col-sm-12"})
                    if urlfield:
                        program['URL'] = urlfield.find("a").get("href")

                listofprograms.append(program)
            datadict['Programs'] = listofprograms

    except Exception as e:
        print(e)
        print(datadict['URL'])
    return datadict


#all_schools = extract_links("https://find-mba.com/most-popular/can")
#extracted_data = [get_data_from_each_link(school) for school in all_schools]
import json
#with open("Output/findmba.json","w") as fout:
#    json.dump(extracted_data,fout)

def flatten_and_format(school):
    for x in range(0,len(school['Programs'])):
        for k,v in school['Programs'][x].items():
            new_key = 'Program ' +repr(x+1)+' '+ str(k)
            school[new_key] = school['Programs'][x][k]
    school.pop("Programs",None)
    return school


with open('../findmba.json') as data_file:
    data = json.load(data_file)
blurb = list(map(flatten_and_format,data))
df = pd.DataFrame(blurb)
pprint.pprint(blurb[0])
print(df.head())
df.to_csv("../Output/findmba.csv")