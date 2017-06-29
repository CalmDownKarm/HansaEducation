url = "https://www.topuniversities.com/universities/massachusetts-institute-technology-mit"

from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen

pp = pprint.PrettyPrinter(indent=4)

def extract_table(url):
	req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
	webpage = urlopen(req).read()
	data = dict()
	htmlsoup = bs(webpage,"html.parser")
	major = htmlsoup.find("div",{"class":"faculty-main wrapper col-md-4"})
	inner = major.find_all("div",{"class":"total faculty"})
	for inn in inner:
		data['Total Academic Faculty'] = inn.find("div",{"class":"number"}).get_text().strip()
	inner = major.find_all("div",{"class":"inter faculty"})
	for inn in inner:
		data["International Faculty"] = inn.find("div",{"class":"number"}).get_text().strip()
	major = htmlsoup.find("div",{"class":"students-main wrapper col-md-4"})
	inner = major.find_all("div",{"class":"total student"})
	for inn in inner:
		data["Total Number of Students"] = inn.find("div",{"class":"number"}).get_text().strip()
	inner = major.find_all("div",{"class":"stat"})
	for inn in inner:
		data["Percent Post Grad Students"] = inn.find("div",{"class":"post"}).find("span",{"class":"perc"}).get_text().strip()
		data["Percent Undergraduate Students"] = inn.find("div",{"class":"grad"}).find("span",{"class":"perc"}).get_text().strip()
	major = htmlsoup.find("div",{"class":"int-students-main wrapper col-md-4"})
	inner = major.find_all("div",{"class":"total inter"})
	for inn in inner:
		data["Number of Internal Students"] = inn.find("div",{"class":"number"}).get_text().strip()
	inner = major.find_all("div",{"class":"stat"})
	for inn in inner:
		data["Percent International PostGrad"] = inn.find("div",{"class":"post"}).find("span",{"class":"perc"}).get_text().strip()
		data["Percent International UnderGrad"] = inn.find("div",{"class":"grad"}).find("span",{"class":"perc"}).get_text().strip()
	major = htmlsoup.find_all("div",{"id":"uni-classifications"})
	# for boob in major:
	# 	inner = boob.find_all("li",{"class":"size"})
	# 	for inn in inner:
	# 		moreinner =  inn.find_all("span",{"class":"l10 blue right"})
	# 		for x in moreinner:
	# 			print(x.get_text().strip())
	# 	inner = boob.find_all("li",{"class":"age"})
	# 	for inn in inner:
	# 		moreinner =  inn.find_all("span",{"class":"l10 blue right"})
	# 		for x in moreinner:
	# 			print(x.get_text().strip())
		#inner = major.find("li",{"class":"age"}).find("h4",{"class":"l12 gray"})
	#data["Age"]= inner.find_all("span",{"class":"l10 blue right"})[1].get_text().strip()
	return data
	pp.pprint(data)


extract_table(url)