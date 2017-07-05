from googleapiclient.discovery import build
import pprint

my_api = "AIzaSyDB-mQx7ETS4YDaSKzFwS_zmrjHYuBbO7M"	
my_cse_id = "005840518808624582869:emlk14dy7x8"


def google_search(search_term, api_key, cse_id, **kwargs):
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(
      q='lectures',
      cx='017576662512468239146:omuauf_lfve',
    ).execute()
    pprint.pprint(res)

results = google_search(
    'stackoverflow site:en.wikipedia.org', my_api, my_cse_id, num=10)
for result in results:
    pprint.pprint(result)