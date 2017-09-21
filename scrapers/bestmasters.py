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

pprint.pprint(get_links("http://www.best-masters.com/ranking-master-international-management.html"))
