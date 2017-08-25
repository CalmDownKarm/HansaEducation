# Pulls AJAX links so I don't have to manually download files
import pandas
import json
import pprint
import urllib.request
import collections
from os import listdir,rename
from os.path import isfile, join

def download_jsons(url):
    global count
    count+=1
    try:
        with urllib.request.urlopen(url) as link:
            data = json.loads(link.read().decode())
            print(data)
            with open("../mp/response"+repr(count)+".json",'w') as out:
                json.dump(data,out)
    except Exception as e:
        print(e)


def download_json_driver():
    count = 0
    url = "https://reflector.prtl.co/?order=relevance&direction=desc&start=0&include_order=true&token=ddd2a935ef77852e1a7b108eddeddc7b7f598a80&q=de-fulltime%7Cdi-101%7Cen-3605%7Clv-master%2Cpreparation%7Cmh-face2face%7C!dg-prebachelor%2Clanguage%7Cuc-108&path=data%2Fstudies-cs%2Fpublic%2Fresults%2F&hh=en-GB%2Cde-DE%2Cfr-FR%2Ces-ES-master%2Cdefault" 
    [download_jsons(url.replace("start=0","start="+repr(x))) for x in range(0,500,10)]

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
    finally:
        return course    




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
df.to_csv("../Output/MastersPortalPublicAdministration.csv")
