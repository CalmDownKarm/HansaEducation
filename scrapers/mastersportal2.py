# Pulls AJAX links so I don't have to manually download files
# import pandas
import json
import pprint
import urllib.request


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


def handle_one_course(indict,id):
    course = {}
    pprint.pprint(indict)
    if "virtual_path" in indict:
        course["CourseURL"] = "http://www.mastersportal.eu/studies/"+id+"/"+indict["virtual_path"]
    if "tuition_fee_types" in indict:
        




def decode_json(filename):
    with open(filename) as data_file:    
        data = json.load(data_file)
        # for x in data:
        #     handle_one_course(data[x],x)
        handle_one_course(data["16725"],"16725")
    return
decode_json("../mp/response1.json")
