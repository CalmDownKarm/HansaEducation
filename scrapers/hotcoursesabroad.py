from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen
from os import listdir
from os.path import isfile, join
import requests



def extract_schools_and_links(files):
	list_of_schools = []
	for file in files:
		with open("../hotcoursesabroad/"+file) as f:
			soup = bs(f.read(), "html.parser")
		if soup:
			main = soup.find_all("div",{"class":"pr_hd"})
			if main:
				for sch in main:
					school = {}
					courses_link = sch.find("meta",{"itemprop":"url"})
					if courses_link:
						courses_link = courses_link.get("content")
						school["CoursesLink"] = courses_link
					name_div = sch.find("div",{"class":"fl mt10 mr5 blu"})
					if name_div:
						link = name_div.find("a")
						if link:
							school["University"] = link.get_text().strip()
					country_outer_list = sch.find("ul",{"class":"vw_con"})
					if country_outer_list:
						country = country_outer_list.find("li")
						if country:
							school["Country"] = country.get_text()
					pee = sch.find("p",{"class":"mt5 flft grey"})
					if pee:
						school["The World Rank"] = pee.get_text().strip().split(":")[1]
					list_of_schools.append(school)
	return list_of_schools

def fixlink(url):
	return "https://www.hotcoursesabroad.com"+url


def get_courses(school):
	try:
		url = school['CoursesLink']
		req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
		webpage = urlopen(req).read()
		courses=[]
		if(webpage):
			soup = bs(webpage,"html.parser")
			if(soup):
				main = soup.find_all("div",{"class":"pr_hd"})
				for c in main:
					course = {}
					header = c.find("h3",{"class":"mb5"})
					if header:
						link = header.find("a")
						if link:
							course['CourseLink'] = fixlink(link.get("href"))
							course['CourseName'] = link.get_text().strip()
							z = {**school,**course}
							#pprint.pprint(z)
							z.pop("CoursesLink",None)
							courses.append(z)
		return courses
	except Exception as e:
		print(e)
		pprint.pprint(school)
		return []

def get_inner_data(course):
	try:
		url = course["CourseLink"]
		req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
		webpage = urlopen(req).read()
		soup = bs(webpage,"html.parser")
		if(soup):
			main = soup.find("div",{"class":"cs_opt mb2 mt10"})
			duration_header = main.find("h4")
			if duration_header:
				course['Duration']=duration_header.get_text().strip()
			deetsouter = main.find("div",{"class":"addrs"})
			if deetsouter:
				deets = deetsouter.find_all("div",{"class":"tut_fs"})
				for deet in deets:
					title = deet.find("p",{"class":"col1"})
					if title:
						course[title.get_text().strip()]=title.findNextSibling("div").get_text().strip()
			main = soup.find_all("div",{"class":"con_pad brd_btm bgwht"})
			for c in main:
				IntEntryReq = c.find("h4")
				if IntEntryReq:
					if IntEntryReq.get_text().strip() == "Entry requirement for international students":
						myact = IntEntryReq.findNext("p")
						if myact:
							course["International Entry Req"] = myact.get_text().strip()
		pprint.pprint(course)
		return course
	except Exception as e:
		print(e)
		pprint.pprint(course)
		return course

files = [f for f in listdir("../hotcoursesabroad/") if isfile(join("../hotcoursesabroad/", f))]
furfur = extract_schools_and_links(files)
print("Links Extracted")
boobs = list(map(get_courses,furfur))
print("populated Courses")
bob = [item for sub in boobs for item in sub]
pprint.pprint(bob[0])
loda = list(map(get_inner_data,bob))
print("Making DataFrame")
df = pd.DataFrame(loda)
df.to_csv("../Output/Hotcourses.csv")