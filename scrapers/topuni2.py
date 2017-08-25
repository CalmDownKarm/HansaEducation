"""Card Format for top universities, 
similar to https://www.topuniversities.com/universities/level/postgrad/subject/public-policy"""
from urllib.request import Request, urlopen
import pprint
import pandas as pd
from bs4 import BeautifulSoup as bs

def handle_one_list_item(listitem):
    """Captures one University/Card"""
    course = {}
    link = listitem.find("a",{"class":"profile adv"})
    if link:
        course["URL"] = 'https://www.topuniversities.com'+link.get("href") 
        rankingdiv = link.find("div",{"class":"uni_ranking"})
        if rankingdiv:
            course["Ranking"] = rankingdiv.get_text().strip()
        else:
            print("NOT FOUND RD")
    else:
        link = listitem.find("a",{"class":"profile basic"})
        course["URL"] = 'https://www.topuniversities.com'+link.get("href") 
        rankingdiv = link.find("div",{"class":"uni_ranking"})
        if rankingdiv:
            course["Ranking"] = rankingdiv.get_text().strip()
        else:
            print("NOT FOUND RD")
        #print(listitem)
        
    return course

def get_all_courses(url):
    """Gets a list of all courses on the page and processes em"""
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urlopen(req).read()
        soup = bs(webpage, "html.parser")
        if soup:
            container_div = soup.find("ul",{"id":"universities-search"})
            if container_div:
                # pprint.pprint(container_div)
                items = container_div.find_all("li",{"class":"profile-result"})
                # print(items)
                # for item in items:
                #     print(item.get_text().strip())
                courses = [handle_one_list_item(x) for x in items]
            else:
                print("container div not found")
        else:
            print("NO SOUP FOR YOU")

    except Exception as e:
        print(e)
    finally:
        return list(filter(None.__ne__, courses))

def extract_table(data):
    url = data["URL"]
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        webpage = urlopen(req).read()
        htmlsoup = bs(webpage, "html.parser")
        title_div = htmlsoup.find("div",{"class":"panel-pane pane-node-title"})
        if title_div:
            data["CollegeName"] = title_div.get_text().strip()
        country_span = htmlsoup.find("span",{"class":"country"})
        if country_span:
            data["Country"] = country_span.get_text().strip()
            print(country_span.get_text().strip())
        major = htmlsoup.find(
            "div", {"class": "faculty-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total faculty"})
        for inn in inner:
            data['Total Academic Faculty'] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "inter faculty"})
        for inn in inner:
            data["International Faculty"] = inn.find(
            "div", {"class": "number"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total student"})
        for inn in inner:
            data["Total Number of Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent Post Grad Students"] = inn.find("div", {"class": "post"}).find(
                "span", {"class": "perc"}).get_text().strip()
            data["Percent Undergraduate Students"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
        major = htmlsoup.find(
            "div", {"class": "int-students-main wrapper col-md-4"})
        inner = major.find_all("div", {"class": "total inter"})
        for inn in inner:
            data["Number of Internal Students"] = inn.find(
                "div", {"class": "number"}).get_text().strip()
        inner = major.find_all("div", {"class": "stat"})
        for inn in inner:
            data["Percent International PostGrad"] = inn.find(
                "div", {"class": "post"}).find("span", {"class": "perc"}).get_text().strip()
            data["Percent International UnderGrad"] = inn.find(
                "div", {"class": "grad"}).find("span", {"class": "perc"}).get_text().strip()
    except Exception as e:
        print(e)
        print("In Extract Everything")
    finally:
        return data

allcourses = get_all_courses("https://www.topuniversities.com/universities/level/postgrad/subject/public-policy")

more_data = [extract_table(course) for course in allcourses]
df = pd.DataFrame(more_data)
df.to_csv("../Output/TopUniPublicPolicy.csv")