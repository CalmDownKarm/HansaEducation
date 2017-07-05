from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver
from bs4 import BeautifulSoup as bs
import pprint
pp = pprint.PrettyPrinter(indent=4)
# Start the WebDriver and load the page

# Wait for the dynamically loaded elements to show up
#.until(
#    EC.visibility_of_element_located((By.CLASS_NAME, "")))

# And grab the page HTML source


def get_source(url):
	wd = webdriver.FireFox()
	try:
		wd.get(url)
		# WebDriverWait(wd, 0.1).until(EC.visibility_of_element_located(
		#     (By.CLASS_NAME, "uni-classifications")))
		html_page = wd.page_source
		wd.quit()
		return html_page
	except Exception as e:
	 	print(e)
	 	return None


# Now you can use html_page as you like
def extract_everything(html_page):
	try:
		htmlsoup = bs(html_page,"html.parser")
		data=dict()
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
		major = htmlsoup.find("div",{"id":"uni-classifications"})
		inner = major.find_all("li",{"class":"size"})
		for inn in inner:
			data["Size"] =  inn.find("span",{"class":"l10 blue right"}).get_text().strip()
		inner = major.find_all("li",{"class":"age"})
		for inn in inner:
			data["Age"] =  inn.find("span",{"class":"l10 blue right"}).get_text().strip()	
		inner = major.find_all("li",{"class":"dstatus"})
		for inn in inner:
			data["Status"] =  inn.find("span",{"class":"l10 blue right"}).get_text().strip()
		inner = major.find_all("li",{"class":"research"})
		for inn in inner:
			data["Research"] =  inn.find("span",{"class":"l10 blue right"}).get_text().strip()
		inner = major.find_all("li",{"class":"focus"})
		for inn in inner:
			data["Focus"] =  inn.find("span",{"class":"l10 blue right"}).get_text().strip()	
		return data
	except Exception as e:
		print(e)
		return {}

print(extract_everything(get_source("https://www.topuniversities.com/universities/ewha-womans-university")))
