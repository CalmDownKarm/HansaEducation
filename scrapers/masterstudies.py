''' Works for links like https://www.masterstudies.com/Masters-Degree/Physics/, download the pages manually and put into named folder'''
from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen
from os import listdir
from os.path import isfile, join
files = [f for f in listdir("../MasterStudies/") if isfile(join("../MasterStudies/", f))]

def extract_links(files):
	courses = []
	for file in files:
		with open("../MasterStudies/"+file) as f:
			soup = bs(f.read(), "html.parser")
			if soup:
				container_divs = soup.find_all("div",{"class":"listing-row row"})
				for cd in container_divs:
					school = {}
					innerdiv = cd.find("div",{"class":"col-sm-10 school-info"})
					titleh = innerdiv.find("h4",{"class":"listing-title"})
					if titleh:
						a = titleh.find("a")
						school["Course Title"] = a.get_text().strip()
						school["Course URL"] = a.get("href").strip()
						uni = titleh.findNext("h5",{"class":"listing_provider"}).find("span")
						if uni:
							school["University"] = uni.get_text().strip()
						moredata = innerdiv.find("div",{"class":"is-item-description"})
						if moredata:
							labels = moredata.find("div",{"class":"labels-container"}).find_all("span",{"class":"label label-default-master "})
							school["Tags"]=[label.get_text().strip() for label in labels]
					courses.append(school)
					# pprint.pprint(school)
			else:
				print("no soup")
	return courses


def get_more_data(school):
	url = school["Course URL"]
	if url:
		try:
			req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
			webpage = urlopen(req).read()
			soup = bs(webpage, "html.parser")
			if soup:
				courselink = soup.find("div",{"class":"school-link"})
				if courselink:
					school["Course Link"] = courselink.find("a").get("href")
				else:
					print("\n No Link")
				divs = soup.find_all("div",{"class":"col-xs-6 col-sm-6 col-md-3 duration-fact-box"})
				for d in divs:
					inner = d.find("div",{"class":"duration_box"})
					if inner:
						title = inner.find("div",{"class":"duration_box_title"}).get_text().strip()
						val = inner.find("div",{"class":"duration_box_text"}).get_text().strip()
						if("Request" in val):
							continue
						elif("Contact" in val):
							continue
						else: 
							school[title.lower()] = val
				pricecommdiv = soup.find("div",{"class":"price_comment"})
				if pricecommdiv:
					school["Price Comment"] = pricecommdiv.get_text().strip()
			else:
				print("\n NO SOUP FOR YOU")
			pprint.pprint(school)
			return school
		except:
			return school


boobs = extract_links(files)
data = list(map(get_more_data,boobs))
df = pd.DataFrame(data)
df.to_csv("../Output/MastersStudies Physics.csv")
#pprint.pprint(files)
