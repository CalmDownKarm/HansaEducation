from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen

def get_links(url):
	list_of_courses = []
	try:
		req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
		webpage = urlopen(req).read()
		soup = bs(webpage, "html.parser")
		if soup:
			table = soup.find("table",{"class":"views-table cols-5"})
			if table:
				rows = table.find_all("tr")
				for row in rows[1:]:
					course = {}
					eles = row.find_all("td")
					course["Rank"] = eles[0].get_text().strip()
					course["Cost"] = eles[2].get_text().strip()
					course["Degree Options"] = eles[3].get_text().strip()
					course["Social Impact Score"] = eles[4].get_text().strip()
					course["Name"] = eles[1].find("a").get_text().strip()
					course["URL"] = eles[1].find("a").get("href")
					course["Location"] = eles[1].find("span").get_text().strip()
					pprint.pprint(course)
					list_of_courses.append(course)

		else:
			print("NO SOUP FOR YOU")
	except Exception as e:
		print(e)
	return list_of_courses

def get_scores(course):
	url = "https://www.netimpact.org"+course["URL"]
	try:
		req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
		webpage = urlopen(req).read()
		soup = bs(webpage, "html.parser")
		if soup:
			scores_div = soup.find("div",{"class":"bau-scores inline"})
			if scores_div:
				h4s = scores_div.find_all("h4")
				for h in h4s:
					key = h.find("div",{"class":"label-inline"})
					val = h.find("span",{"class":"inline-separator"})
					if(key):
						course[key.get_text().strip()] = val.get_text().strip()
					else:
						val = h.find("span",{"class":"stat-lg"})
						if val:
							course["Admittance Rate"] = val.get_text().strip()
		else:
			print("NO SOUP FOR YOU")

	except Exception as e:
		print(e)
	pprint.pprint(course)
	return course





foo = get_links("https://www.netimpact.org/business-as-unusual/top-50-social-impact")
if foo:
	data = list(map(get_scores,foo))
	df = pd.DataFrame(data)
	df.to_csv("../Output/NetImpactSocialEntre.csv")
