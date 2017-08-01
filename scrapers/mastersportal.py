from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen
from os import listdir,rename
from os.path import isfile, join
from random import randint

def extract_links(files):
	courses = []
	for file in files:
		try:
			with open("../mp/"+file,encoding ='ISO-8859-1') as f:
				soup = bs(f.read(), "html.parser")
				if soup:
					container_div = soup.find("div",{"id":"StudySearchResultsStudies"})
					if container_div:
						course_div = soup.find_all("div",{"class":"Result master"})
						for c in course_div:
							course = {}
							titlediv = c.find("h3",{"class":"StudyTitle"})
							if titlediv:
								course["MP URL"]=titlediv.find("a").get("href")
								course["Course Title"] = titlediv.find("a").get_text().strip()
							titlediv = c.find("div",{"class":"Geo"}).find_all("ul")
							if titlediv[0]:
								course["University"] = titlediv[0].find("a").get_text().strip()
							if titlediv[1]:
								course["Location"] = titlediv[1].get_text().strip()
							titlediv = c.find("div",{"class":"SearchResultsQuickFacts"})
							if titlediv:
								feesli = titlediv.find("li",{"class":"Fees"})
								if feesli:
									course["Fees"] = feesli.get_text().strip()
								durali = titlediv.find("li",{"class":"Duration"})
								if durali:	
									course["Duration"] = durali.get_text().strip()
								languageli = titlediv.find("li",{"class":"Language"})
								if languageli:
									course["Language"] = languageli.get_text().strip()
							courses.append(course)
							pprint.pprint(course)
					else:
						print("can't find div")
				else:
					print("NO SOUP FOR YOU")
		except Exception as e:
			print(e)
	return courses

def get_more_data(course):
	url = course["MP URL"]
	if url:
		try:
			req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
			webpage = urlopen(req).read()
			soup = bs(webpage, "html.parser")
			if soup:
				container = soup.find("section",{"class":"LanguageRequirementsSegmentedControl"})
				if container:
					litag = container.find("li",{"data-segment-id":"TOEFL IBT"})
					if litag:
						course["TOEFL IBT"] = litag.get_text().strip().split(": ")[1].split(" ")[0]
						# pprint.pprint(course)
					litag = container.find("li",{"data-segment-id":"IELTS"})
					if litag:
						course["IELTS"] = litag.get_text().strip().split(": ")[1].split(" ")[0]
						# pprint.pprint(course)
				else:
					print("can't find container")
				container = soup.find("section",{"class":"StudyRequirement"})
				if container:
					lst = container.find("ul")
					if lst:
						lis = lst.find_all("li")
						course["Academic Req"] = [l.get_text().strip() for l in lis]
					else:
						pees = container.find_all("p")
						for p in pees:
							if "Standardized Test Scores" in p.get_text().strip():
								course["Standardized Test Scores"] = p.get_text().strip()
			else:
				print("NO SOUP FOR YOU")
		except Exception as e:
			print(e)
	return course

files = [f for f in listdir("../mp/") if isfile(join("../mp/", f))]
print(len(files))
course_list = extract_links(files)
print(get_more_data(course_list[0]))

