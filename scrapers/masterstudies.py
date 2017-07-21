from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen
from os import listdir
from os.path import isfile, join
files = [f for f in listdir("../MasterStudies/") if isfile(join("../MasterStudies/", f))]

def extract_links(files):
	for file in files:
		with open("../MasterStudies/"+file) as f:
			soup = bs(f.read(), "html.parser")
			if soup:
				container_divs = soup.find_all("div",{"class":"col-sm-10 school-info"})
				for cd in container_divs:
					print(cd.get_text().strip())



pprint.pprint(files)