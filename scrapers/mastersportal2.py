# Pulls AJAX links so I don't have to manually download files
# import pandas
import json
import pprint
import urllib.request

def get_links(filename):
    #TODO:replace filename with URL and use a request
    with open(filename) as data_file:    
        data = json.load(data_file)
        pprint.pprint(data)
    return

# get_links('../mp/data.json')

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
	
