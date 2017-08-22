url = "https://reflector.prtl.co/?order=relevance&direction=desc&start=0&include_order=true&token=3f6bd81fce0cd3db9972bc764a3f48c077fc8ecb&q=di-101%7Cen-1952%7Clv-master%2Cpreparation%7C!dg-prebachelor%2Clanguage%7Cuc-108&path=data%2Fstudies-cs%2Fpublic%2Fresults%2F&hh=en-GB%2Cde-DE%2Cfr-FR%2Ces-ES-master%2Cdefault" 
for x in range(0,500,10):
	print(url.replace("start=0","start="+repr(x)))

