from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
pp = pprint.PrettyPrinter(indent=4)

def extract_data(path):
	everything = []
	with open(path) as file:
		soup= bs(file.read(),"html.parser")
		
		table = soup.find("table",{"id":"qs-rankings-indicators"})
		rows = table.find_all("tr")
		count=0
		for row in rows:
			elements = row.find_all("td")
			if(elements):
				temp = dict()
				temp['Rank'] = elements[0].get_text()
				temp['Name'] = elements[1].get_text()
				temp['URL'] = elements[1].find("a").get("href")
				temp['Overall Score'] = elements[2].get_text()
				temp['Academic Reputation'] = elements[3].get_text()
				temp['Citations Per Paper'] = elements[4].get_text()
				temp['Employer Reputation'] = elements[5].get_text()
				temp['H-Index Citations'] = elements[6].get_text()
				everything.append(temp)
				count+=1
				print(count)

	return everything


				
result = extract_data("Electrical & Electronic Engineering _ Top Universities.html")
df = pd.DataFrame(result)
df.to_csv("Electrical Engineering out.csv")
result = extract_data("Chemical Engineering _ Top Universities.html")
df = pd.DataFrame(result)
df.to_csv("Chemical Engineering out.csv")
result = extract_data("Mechanical, Aeronautical & Manufacturing Engineering _ Top Universities.html")
df = pd.DataFrame(result)
df.to_csv("MAM Engineering out.csv")
result = extract_data("Computer Science & Information Systems _ Top Universities.html")
df = pd.DataFrame(result)
df.to_csv("Computer Science out.csv")