from bs4 import BeautifulSoup as bs
import pandas as pd
import urllib.request


import pprint
pp = pprint.PrettyPrinter(indent=4)


def extract_urls(path):
    schools = []
    try:
        with open(path) as html_file:
            soup = bs(html_file.read(), "html.parser")
            rows = soup.find_all('tr')
            for row in rows:
                td = row.find_all('td')
                if(td):
                    name = td[0].get_text()
                    link = td[1].find('a')
                    if link:
                        link = link.get('href')
                        smalldict = dict()
                        smalldict['Name'] = name
                        smalldict['P&QLink'] = link
                        schools.append(smalldict)
        return schools
        # return [(link.get_text(), link.get('href')) for link in
        # bs(html_file.read(), "html.parser").find_all('a')]
    except IOError:
        return []

# import csv
# with open('outfile.csv', 'w') as out:
#     csv_out = csv.writer(out)
#     csv_out.writerows(result)


# df = pd.DataFrame(result,columns = ['Name','Link'])
# print(df.head())

# FT
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

def get_soup(url):
    try:
        with urllib.request.urlopen(url) as page:
            s = page.read()
        return bs(s, "html.parser")
    except Exception as e:
        print(e)
        print("\n NO SOUP FOR YOU!")
        return None


def extract_school_data(htmlsoup, url):
    data_dict = dict()
    try:
        divs = htmlsoup.find_all(
            "div", {"class": ["school-data", "school-loc"]})
        val = []
        for div in divs:
            pees = div.find_all('p')
            val += [pee.get_text() for pee in pees]

        for x in val:
            title = x.split(":")[0]
            field = x.split(":")[1]
            data_dict[title] = field
        return data_dict
    except Exception as e:
        print(e)
        print("SCHOOL DATA FUCKING UP at " + url)
        return None


def extract_school_deadlines(htmlsoup, url):
    data_dict = dict()
    try:
        divs = htmlsoup.find_all("div", {"class": "pf-content"})
        for div in divs:
            pees = div.find_all("p")[0]
            if pees:
                pee = pees.get_text()
                boob = pee.split("\n")
                if len(boob) == 2:
                    data_dict['Rolling'] = "Yes"
                else:
                    for x in range(1, len(boob)):
                        data_dict["Round " + repr(x)] = boob[x].split(":")[1]
                    data_dict["Rolling"] = "No"
            # pp.pprint(data_dict)
        return data_dict
    except Exception as e:
        print(e)
        print("School deadlines fucking up at " + url)
        return None


def extract_school_loc(htmlsoup, url):
    data_dict = dict()
    try:
        divs = htmlsoup.find_all("div", {"class": "school-loc"})
        for div in divs:
            temp_address = div.find("address")
            if temp_address:
                address = temp_address.get_text()
            temp_admissions_off = div.find("a", {"class": "phone-num"})
            if temp_admissions_off:
                admissions_off = temp_admissions_off.get_text()
        if address:
            data_dict['Address'] = address.strip()
        if admissions_off:
            data_dict["Admissions Office"] = admissions_off.strip()
        return data_dict
        # print("SCHOOL loc FUCKING UP at "+url)
    except Exception as e:
        print(e)
        print("School Loc fucking up at " + url)
        return None


def create_a_big_dict(url):
    htmlsoup = get_soup(url)
    listofdicts = []
    import collections
    superdict = dict()
    if htmlsoup:
        listofdicts.append(extract_school_data(htmlsoup, url))
        listofdicts.append(extract_school_loc(htmlsoup, url))
        listofdicts.append(extract_school_deadlines(htmlsoup, url))

    for d in listofdicts:
        if d:
            for k, v in d.items():
                superdict.setdefault(k, []).append(v)
    for k,v in superdict.items():
    	superdict[k] = v[0]
    return superdict


# school_data = extract_school_data(
#    "http://poetsandquants.com/school-profile/stanford-graduate-school-of-business/")
# boobs = dict()
# convert_school_data_to_dict(school_data, boobs)
# newboobs=extract_school_loc("http://poetsandquants.com/school-profile/stanford-graduate-school-of-business/")
# boobs = create_a_big_dict(
#     "http://poetsandquants.com/school-profile/stanford-graduate-school-of-business/")

# pp.pprint(boobs)
# pp.pprint(newboobs)

final_list_of_dicts = []
result = extract_urls('Sheet1.html')
for school in result:
    school_all = create_a_big_dict(school["P&QLink"])
    foo = {**school, **school_all}
    final_list_of_dicts.append(foo)
    print("oneDone")

df = pd.DataFrame(final_list_of_dicts)
df.to_csv("PQoutput.csv")
