from bs4 import BeautifulSoup as bs
import pandas as pd
import pprint
from urllib.request import Request, urlopen

def extract_links(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()
    soup = bs(webpage, "html.parser")
    if soup:
        list_of_schools = []
        table = soup.find("table", {"class": "ranking-table"})
        rows = table.find_all("tr",{"class":"seperator"})
        for row in rows:
            datarow = row.findNextSibling("tr")
            if datarow:
                data = {}
                teedees = datarow.find_all("td")
                if teedees:                    
                    rank = teedees[0]
                    if rank:
                        data["Rank"] = rank.get_text().strip()
                    name = teedees[1]
                    if name:
                        url = name.find("a")
                        if url:
                            data["ShishkaCollegeURL"] = url.get("href")
                            data["CollegeName"]  = url.get_text().strip()
                        pee = name.find("p").find("a")
                        if pee:
                            data["ShikshaCourseURL"] = pee.get("href")
                            data["CourseName"] = pee.get_text().strip()
                        sp = name.find("span",{"class":"cntry-title"})
                        if sp:
                            data["Location"] = sp.get_text().strip()
                    firstyrcost = teedees[2]
                    if firstyrcost:
                        data["First Year Cost"] = firstyrcost.get_text().strip()
                    tests = teedees[3]
                    if tests:
                        pee = tests.find_all("p")
                        for p in pee:
                            if "GMAT: " in p.get_text().strip():
                                data["GMAT"] = p.get_text().strip().split(": ")[1]
                            if "GRE: " in p.get_text().strip():
                                data["GRE"] = p.get_text().strip().split(": ")[1]
                            if "IELTS: " in p.get_text().strip():
                                data["IELTS"] = p.get_text().strip().split(": ")[1]
                            if "PTE: " in p.get_text().strip():
                                data["PTE"] = p.get_text().strip().split(": ")[1]
            list_of_schools.append(data)
        return list_of_schools        
    else:
        print("WHERE IS THE SOUP")
        return None
            
    #         list_of_schools.append(data)
    # return list_of_schools

def get_more_data(course):
    url = course['ShikshaCourseURL']
    print(url)
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    webpage = urlopen(req).read()

    soup = bs(webpage, "html.parser")
    if soup:
        cunt = soup.find("div",{"class":"course-detail-mid flLt"})
        if cunt:
            tees = cunt.get_text().strip().split("\n")
            for t in tees:
                if "Duration: " in t:
                    course["Duration"]=t.split("|")[0].split(":")[1].strip()
                    course["Level"]=t.split("|")[1].split(":")[1].strip()
        cunt = soup.find("div",{"id":"abroadCourseFee"})
        if cunt:
            tables = cunt.find_all("table")
            if tables[0]:
                r = tables[0].find("tr",{"class":"last"})
                td = r.find_all("td")
                if td:
                    course["1st Year Fee in Pounds"] = td[1].get_text().strip()
                    course["1st year Fee in INR"] = td[2].get_text().strip()
            if len(tables)==2:
                row = tables[1].find_all("tr")
                for r in row:
                    td = r.find_all("td")
                    if td:
                        key = td[0].get_text().strip()
                        course[key+" Pound "] = td[1].get_text().strip()
                        course[key+" INR "] = td[2].get_text().strip()
            else:
                print("table_not_found")
        else:
            print("no cunt")
        cunt = soup.find("div",{"class":"overview dyanamic-content entry-req-list"})
        if cunt:
            pees = cunt.find_all("p",{"class":"course-require-hd"})
            for p in pees:
                field = p.get_text().strip().split(": ")
                if len(field)>1:
                    course[field[0]] = field[1]
            deevs = cunt.find_all("div",{"class":" course-seekbar clearwidth"})
            for d in deevs:
                coverbar = d.find("div",{"class":"coverbar"})
                if coverbar:
                    # print(coverbar)
                    # print("-"*40)
                    key = coverbar.find("a").get_text().strip() + " Recommendation"
                    print("key : "+key)
                    # print("-"*40)
                    rec = coverbar.findNext("div",{"class":"clearwidth exam-requiremnt-list"})
                    if rec:
                        val = rec.get_text().strip()
                        course[key] = val
        cunt = soup.find("div",{"id":"recruiting-companies-layer"})
        if cunt:
            images = cunt.find_all("img",{"class":"recruitmentLogoImg"})
            if images:
                course["Placement Companies"] = [img.get("alt")for img in images]
        cunt = soup.find("div",{"id":"scholarshipstab"})
        if cunt:
            x = cunt.find("p",{"class":"course-require-hd"})
            if x:
                ptag = x.findNext("p")
                if ptag:
                    text = ptag.get_text().strip().split("•")
                    course["Schol Text"] = text
                    x = ptag.findNext("ul",{"class":"level-list"})
                    if x:
                        if(x.find("a")):
                            course["Schol Link"] = x.find("a").get("href")
    pprint.pprint(course)
    return course
#boobs = extract_links("https://studyabroad.shiksha.com/top-mba-colleges-in-uk-abroadranking29")
import json
# with open("../Output/Shiksha.json","w") as fout:
#    json.dump(boobs,fout)

#get_more_data(boobs[0])
with open('../Output/Shiksha.json') as data_file:
    data = json.load(data_file)
out = list(map(get_more_data,data))
df = pd.DataFrame(out)
df.to_csv("../Output/Shiksha.csv",index = None)

#pprint.pprint(data[0])


