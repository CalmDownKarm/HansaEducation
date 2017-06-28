from bs4 import BeautifulSoup as bs
import pandas as pd
import urllib.request

	

import pprint
pp = pprint.PrettyPrinter(indent=4)

# def extract_urls(path):
#     try:
#         with open(path) as html_file:
#             return [(link.get_text(),link.get('href')) for link in bs(html_file.read(),"html.parser").find_all('a')]
#     except IOError:
#         return []

# result = extract_urls('FT details.html')

# import csv
# with open('outfile.csv','w') as out:
# 	csv_out = csv.writer(out)
# 	csv_out.writerows(result)


# df = pd.DataFrame(result,columns = ['Name','Link'])
# print(df.head())

## FT
# def extract_table(url):
# 	with urllib.request.urlopen(url) as page:
# 		s = page.read()

# 	htmlsoup = bs(s,"html.parser")
# 	tables = htmlsoup.find_all("table",{"class":"entitytable halfwidth"})
# 	vals = []
# 	for table in tables:
# 		for row in table.findAll('tr'):
# 			col = row.findAll('td')
# 			if col:
# 				print(len(col))
# 				heading = col[0].get_text()
# 				val = col[1].find('span').get_text()
# 				vals.append((heading,val))
# 	return vals


def extract_school_data(url):
	try:
		with urllib.request.urlopen(url) as page:
			s = page.read()

		htmlsoup = bs(s,"html.parser")
		divs = htmlsoup.find_all("div",{"class":["school-data","school-loc","pf-content"]})
		val=[]
		for div in divs:
			pees = div.find_all('p')
			val += [pee.get_text() for pee in pees]
		return val
	except:
		print("SCHOOL DATA FUCKING UP at "+url)






boobs = extract_school_data("http://poetsandquants.com/school-profile/university-of-pennsylvania-the-wharton-school/")
pp.pprint(boobs)