from bs4 import BeautifulSoup as bs
import json
import pprint
import pandas as pd

pp = pprint.PrettyPrinter(indent=4)
with open('file.json') as data_file:    
	    data = json.load(data_file)
def parsecrap(boob):
	soup = bs(boob["HTML"],"html.parser")
	urldiv = soup.find_all("div",{"class":"directory-data"})[1]
	if urldiv:
		print(urldiv)
		url = urldiv.find("a")
		if(url):
			boob['website'] = url.get("href")
	divs = soup.find_all("div",{"class":"toggle_wrapper"})
	for div in divs:
		tit = div.find("a",{"class":"collapsible-controller"})
		if tit.get_text().strip() == "Show Economics and Business indicator rankings":
			blob = tit.findNext("div")
			innerdivs = blob.find_all("div",{"class":"t-slack sep"})
			for dip in innerdivs:
				teedee = dip.find_all("div")
				if teedee:
					boob[teedee[1].get_text().strip()] = teedee[0].get_text().strip()
	boob.pop('HTML', None)
	return boob

cuntshit = list(map(parsecrap,data))
df = pd.DataFrame(cuntshit)
df.to_csv("Output/USNEWSECOUS.csv")