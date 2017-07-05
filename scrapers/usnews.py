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
		with open("USNEWSECONPAGES/"+file) as f:
			soup = bs(f.read(), "html.parser")
		if soup:
			main = soup.find("div",{"class":"maincontent"})
			if main:
				divs = main.find_all("div",{"class":"sep"})
				for div in divs:
					school = {}
					subject_score = div.find("div",{"class":"thumb-right"}).find("div",{"class":"t-large t-strong t-constricted"}).get_text().strip()
					rank = div.find("div",{"class":"thumb-left"}).get_text().strip()
					name = div.find("div",{"class":"block unwrap"}).find("a").get_text().strip()
					URL = div.find("div",{"class":"block unwrap"}).find("a").get("href")
					school["Subject Score"] = subject_score
					school["Name"] = name
					school["Rank"] = rank
					school["URL"] = URL
					list_of_schools.append(school)
	return list_of_schools


files = [f for f in listdir("USNEWSECONPAGES/") if isfile(join("USNEWSECONPAGES/", f))]
foo = extract_schools_and_links(files)
print(len(foo))
import json
with open('boobs.json', 'w') as fout:
	json.dump(foo, fout)
