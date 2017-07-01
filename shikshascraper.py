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
    table = soup.find("table", {"class": "all-univ-table flLt"})
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













