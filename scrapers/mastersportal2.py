''' Pulls AJAX links so I don't have to manually download files
steps, navigate to a page like http://www.mastersportal.eu/search/#q=di-38|lv-master,preparation&start=0&length=10&order=relevance&direction=desc
then look for a json with 200 response code
'''
import pandas
import json
import pprint
import requests
import collections
from os import listdir,rename
from os.path import isfile, join
count = 0
def download_jsons(url):
    global count
    count +=1
    try:
        headers = {
            'user-agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0',
            'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'cookie':'studyportals-cookie=88292f83-d89c-4f56-9136-50c73679fa63; __cfduid=d30903963a9186cecb959ae6497eb156b1509191768',
            'host':'reflector.prtl.co',
            'connection':'keep-alive',
            'upgrade-insecure-requests':'1'
        }
        r = requests.get(url,headers=headers)
        print(r.status_code)
        with open("../mp/response"+repr(count)+".json",'w') as out:
                json.dump(r.json(),out)
    except Exception as e:
        print("download JSON")
        print(e)


def download_json_driver():
    url="https://reflector.prtl.co/?order=relevance&direction=desc&start=0&include_order=true&token=97e377ded5cd3041adb8309d5b4787715d1952bc&q=di-38|en-3397|lv-master,preparation|!dg-prebachelor,language|uc-108&path=data/studies-cs/public/results/&hh=en-GB,de-DE,fr-FR,es-ES-master,default"
    [download_jsons(url.replace("start=0","start="+repr(x))) for x in range(0,1003,10)]

def flatten(d, parent_key='', sep='_'):
    items = []
    for k, v in d.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, collections.MutableMapping):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def handle_one_course(indict,id):
    try:
        course = {}
        if "virtual_path" in indict:
            course["CourseURL"] = "http://www.mastersportal.eu/studies/"+id+"/"+indict["virtual_path"]
        if "degree" in indict:
            course["Degree"] = indict["degree"] 
        if "tuition_fee_types" in indict:
            for feedict in indict["tuition_fee_types"]:
                if feedict["target"] == "international":
                    course["FeeAmount"] = feedict["amount"]
                    course["FeeCurrency"] = feedict["currency"]
                    course["FeeUnit"] = feedict["unit"]
        if "fulltime_duration" in indict:
            course["Duration"] = indict["fulltime_duration"]
            course["Duration Unit"] = indict["fulltime_duration_period"]
        course["TOEFL IBT"] = indict["toefl_internet"]
        course["ECTS Credits"] = indict["ects_credits"]
        course["desc"] = indict["short_description"]
        course["name"] = indict["name"]
        course["Experience_In Years"] = indict["experience_years"]
        flattened = flatten(indict["venues"]["full"])
        for items in flattened:
            if "countries" in items and "name" in items:
                course["Country"] = flattened[items]
        names_list = []
        for items in indict["organisations_lineage"][0]:
            if "name" in indict["organisations_lineage"][0][items]:
                names_list.append(indict["organisations_lineage"][0][items]["name"])       
        course["College Name and Program"] = names_list
    except Exception as e:
        print(e)
        pprint.pprint(indict)
    return course    



download_json_driver()
def decode_json(filename):
    with open(filename) as data_file:    
        data = json.load(data_file)
        tencourses = [handle_one_course(data[x],x) for x in data]
        # handle_one_course(data["16725"],"16725")
    return tencourses
all_my_courses = []



files = [f for f in listdir("../mp/") if isfile(join("../mp/", f))]
for file in files:
    all_my_courses += decode_json("../mp/"+file)

df = pandas.DataFrame(all_my_courses)
df.to_csv("../Output/MastersPortalPhysics.csv")
