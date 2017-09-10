window.USN=window.USN||{},USN.util=USN.util||{},USN.UserOrigin=function(){"use strict";var instantiated=!1;return USN.UserOrigin=function(){if(instantiated)return instantiated;var UserOriginSingleton=function(){this.origins={referrer:{google:"google.com/url",bing:"bing.com/search",yahoo:"search.yahoo.com/search",ask:"ask.com",dogpile:"dogpile.com",blekko:"blekko.com",aol:"search.aol.com",duckduckgo:"duckduckgo.com",search:"search.com/search",lycos:"search.lycos.com",info:"info.com",baidu:"baidu.com/s",sogou:"sogou.com/web",collegeanswer:"collegeanswer.com",aolmoney:"money.aol.com"},searchEngines:{google:"google.com",bing:"bing.com/search",yahoo:"search.yahoo.com/search",ask:"ask.com",dogpile:"dogpile.com",blekko:"blekko.com",aol:"search.aol.com",duckduckgo:"duckduckgo.com",search:"search.com/search",lycos:"search.lycos.com",info:"info.com",baidu:"baidu.com/s",sogou:"sogou.com/web"}}};return UserOriginSingleton.prototype={checkOriginList:function(type){var referrerType,i,result=[],found=null;for(i in this.origins[type])referrerType=this.origins[type][i],found=document.referrer.indexOf(referrerType),-1===found&&"searchEngines"===type&&(found=USN.checkCookie("__utmz").indexOf("organic")),found>-1&&result.push(referrerType);return result},checkSpecificOrigins:function(type){var referrerType,i,result=[],found=null;for(i=0;i<type.length;i+=1)referrerType=type[i],this.origins.referrer.hasOwnProperty(referrerType)&&(found=document.referrer.indexOf(referrerType),-1===found&&(found=USN.checkCookie("__utmz").indexOf(referrerType)),found>-1&&result.push(referrerType));return result},checkOrigin:function(type,callback){var result="",error=!1;this.origins.hasOwnProperty(type)?result=this.checkOriginList(type):"[object Array]"===Object.prototype.toString.call(type)&&(result=this.checkSpecificOrigins(type)),0===result.length&&(error="No match found"),callback(error,result)},checkCookie:USN.checkCookie,addUserOrigin:function(type,name,stringToSearchFor){return"string"==typeof stringToSearchFor?(this.origins[type][name]=stringToSearchFor,this):this}},instantiated=new UserOriginSingleton},USN.UserOrigin()},USN.createCookie=function(name,value,days){var date,expires;days?(date=new Date,date.setTime(date.getTime()+24*days*60*60*1e3),expires="; expires="+date.toGMTString()):expires="",document.cookie=name+"="+value+expires+"; domain=.usnews.com; path=/"},USN.checkCookie=function(name){var i,nameEQ=name+"=",ca=document.cookie.split(";");for(i=0;i<ca.length;i+=1){for(var c=ca[i];" "==c.charAt(0);)c=c.substring(1,c.length);if(0===c.indexOf(nameEQ))return c.substring(nameEQ.length,c.length)}return""},USN.eraseCookie=function(name){window.createCookie(name,"",-1)},USN.MetaKeywords=function(){"use strict";var instantiated=!1;return USN.MetaKeywords=function(){if(instantiated)return instantiated;var MetaKeysSingleton=function(){};return MetaKeysSingleton.prototype={getKeywordTag:function(){return document.getElementsByName("keywords")[0]},getAllKeywords:function(){var i,kwLen;if(document.getElementsByName("keywords")[0]){for(this.keywords=this.getKeywordTag().content.replace(/\s/g,"").split(/[,;\s*]/),i=0,kwLen=this.keywords.length;i<kwLen;i+=1)this.keywords[i]=this.keywords[i].replace(/[^\w]+/g,"").toLowerCase();return this.keywords}return[]},addKeyword:function(kw){var keytag;void 0!==(keytag=this.getKeywordTag())&&(keytag.content.length>0?keytag.content+=", "+kw:keytag.content=kw)}},instantiated=new MetaKeysSingleton},USN.MetaKeywords()},USN.util.getMetaContent=function(metaName){"use strict";var metas=window.document.getElementsByTagName("meta"),currMeta=0;for(currMeta;currMeta<metas.length;currMeta+=1)if(metas[currMeta].name===metaName)return metas[currMeta].content},USN.util.getSection=function(){"use strict";var subdomain=window.location.hostname.split(".")[0],firstUrlFrag=window.location.pathname.split("/")[1];return 0===firstUrlFrag.indexOf("education")||0===subdomain.indexOf("colleges")||0===subdomain.indexOf("grad-schools")?"education":0===subdomain.indexOf("health")?"health":0===subdomain.indexOf("money")?"money":0===subdomain.indexOf("www")&&"education"!==firstUrlFrag?"news":void 0},USN.Ad=USN.Ad||{},USN.Ad.ord=function(){for(var ord=Math.round(1e7*Math.random());ord.length<9;)ord="0"+ord;return ord},function(){"use strict";var path=window.location.pathname,showGumGum=!1;-1!==path.indexOf("/slideshows/")?-1!==path.indexOf("/money/")&&(showGumGum=!0,window.ggv2id="c7d99f21"):-1!==path.indexOf("/news/photos/2014/02/14/extreme-fans-outfits-at-sochi")&&(showGumGum=!0,window.ggv2id="ef1c96a9"),showGumGum&&USN.load("gumgum",{async:!0})}(),window.USN=window.USN||{},USN.UserOrigin().checkOrigin("searchEngines",function(err){"use strict";err||USN.MetaKeywords().addKeyword("usnsearchvisitor")}),function(){"use strict";var cookieValue=USN.UserOrigin().checkCookie("compstat");cookieValue&&USN.MetaKeywords().addKeyword(cookieValue)}();var googletag=window.googletag||{};!function(){"use strict";googletag.cmd=googletag.cmd||[];var usnAdSetup,usnAdThreshold,usnAdUnit,usnKeywords,usnFireAd,usnAdSlots={},usnAdQueue=[],isInternetExplorer=window.navigator.userAgent.indexOf("MSIE ")>=0||window.navigator.userAgent.indexOf("Trident/")>=0||window.navigator.userAgent.indexOf("Edge/")>=0;window.oVa={leaderboardA:["NULL"],leaderboardB:["NULL"],leaderboardA_mobile:["NULL"],leaderboardB_mobile:["NULL"],rectangleA:["NULL"],rectangleB:["NULL"],rectangleC:["NULL"],rectangleA_mobile:["NULL"],rectangleB_mobile:["NULL"]},window.oDv=["2","leaderboardA","leaderboardB","leaderboardA_mobile","leaderboardB_mobile","rectangleA","rectangleB","rectangleC","rectangleA_mobile","rectangleB_mobile"];var d=document,optimeraHost=window.location.host,optimeraPathName=window.location.pathname,optimeraScript=d.createElement("script"),optimOnPage=d.createElement("script");optimeraScript.async=!0,optimeraScript.type="text/javascript",optimOnPage.type="text/javascript",optimOnPage.src="https://s3.amazonaws.com/elasticbeanstalk-us-east-1-397719490216/external_json/oPS.js";var rand=Math.random();optimeraScript.src="https://s3.amazonaws.com/elasticbeanstalk-us-east-1-397719490216/json/"+optimeraHost+optimeraPathName+".js?t="+rand;var node=d.getElementsByTagName("script")[0];node.parentNode.insertBefore(optimeraScript,node),node.parentNode.insertBefore(optimOnPage,node);var kruxCt=d.createElement("script"),kruxInt=d.createElement("script");if(kruxCt.className="kxct",kruxCt.type="text/javascript",kruxCt.setAttribute("data-id","rblvc9nal"),kruxCt.setAttribute("data-timing","async"),kruxCt.setAttribute("data-version","3.0"),kruxCt.text="window.Krux||( (Krux=function(){ Krux.q.push(arguments) }).q=[] );(function() {  var k=document.createElement('script');  k.type='text/javascript';k.async=true;  k.onload = function() { window.kruxReady = true; };  k.src=(location.protocol==='https:'?'https:':'http:')+'//cdn.krxd.net/controltag/rblvc9nal.js';  var s=document.getElementsByTagName('script')[0];  s.parentNode.insertBefore(k,s);}());",kruxInt.className="kxint",kruxInt.type="text/javascript",kruxInt.text="window.Krux||( (Krux=function(){ Krux.q.push(arguments) }).q=[] );(function() {  function retrieve(n){    var m, k='kxusnews_'+n,ls=(function(){          try{ return window.localStorage; }catch(e){ return null; }    })();    if (ls) {      return ls[k] || '';    } else if (navigator.cookieEnabled) {      m = document.cookie.match(k+'=([^;]*)');      return (m && unescape(m[1])) || '';    } else {      return '';    }  }  Krux.user = retrieve('user');  Krux.segments = retrieve('segs') ? retrieve('segs').split(',') : [];}());",node.parentNode.insertBefore(kruxCt,node),node.parentNode.insertBefore(kruxInt,node),usnAdSetup={networkCode:"4020",getSafeString:function(str,len){var str_len=len||32;return str?str.split(":").pop().replace(/[^A-Za-z\/]+/g,"").substring(0,str_len).toLowerCase():""},site:function(){var site=USN.util.getMetaContent("site");return this.getSafeString(site,32)},zone:function(){var zone=USN.util.getMetaContent("zone"),zoneSlashEsc=this.getSafeString(zone,45);return zoneSlashEsc=zoneSlashEsc.replace("/","//"),""===zoneSlashEsc&&(zoneSlashEsc="undefined"),zoneSlashEsc},usnContentType:USN.util.getMetaContent("usn-content-type"),keywords:function(){var i,zoneLen,kw=USN.MetaKeywords().getAllKeywords(),zone=(this.zone()||"").split(/\//);for(0===kw.length&&kw.push("uncategorized"),kw.push(this.site()),i=0,zoneLen=zone.length;i<zoneLen;i+=1)kw.push(zone[i]);return USN.checkCookie("HDTrue")&&kw.push("HDTrue"),0===window.location.host.indexOf("premium")&&kw.push("premiumsite"),kw.push(this.usnContentType),kw},threshold:function(){var thresholdData,thresholdMeta,data,cookieName,pageVisits,i;if(thresholdData={},USN.util.getMetaContent("adThreshold")){for(thresholdMeta=USN.util.getMetaContent("adThreshold").replace(" ","").split(","),i=0;i<thresholdMeta.length;i++)data=thresholdMeta[i].split("="),thresholdData[data[0]]=data[1];for(var key in thresholdData)thresholdData.hasOwnProperty(key)&&(cookieName="usn-ad-threshold-"+key,USN.checkCookie(cookieName)?(pageVisits=decodeURIComponent(USN.checkCookie(cookieName)).split("="),pageVisits=parseInt(pageVisits[1])+1,USN.createCookie(cookieName,"pageVisit="+pageVisits,1),pageVisits<=parseInt(thresholdData[key])-1&&delete thresholdData[key]):(USN.createCookie(cookieName,"pageVisit=1",1),delete thresholdData[key]))}return thresholdData},name:function(){return["",this.networkCode,"usn."+this.site(),this.zone()].join("/")}},usnAdUnit={slot:{default:{size:[[1,1]]},header_takeover:{size:[[980,60]],pos:"leaderboardSticky"},navbug:{size:[[88,31]]},pollLogo:{size:[[88,31]],pos:"poll"},breadbug:{size:[[88,31]]},leaderboardA:{size:[[728,90],[950,30],[954,90],[938,90],[970,66],[970,250],[970,90]],pos:"top"},leaderboardB:{size:[[728,90]],pos:"bot"},leaderboardA_mobile:{size:[[300,50],[320,50]],pos:"top"},leaderboardB_mobile:{size:[[300,50],[320,50]],pos:"bot"},leaderboard_photo:{size:[[728,90]],pos:"top"},bottomBar_mobile:{size:[[1,1]],outOfPage:!0},rectangleA:{size:[[300,250],[300,600],[300,900],[300,1050]],pos:"top"},rectangleA_nosky:{size:[[300,250]]},rectangleB:{size:[[300,250],[300,600],[300,280],[300,300]],pos:"bot"},rectangleC:{size:[[300,250]],pos:"mid"},rectangleA_mobile:{size:[[300,250]],pos:"top"},rectangleB_mobile:{size:[[300,250]],pos:"bot"},skyscraperA:{size:[[160,600]]},skyscraperB:{size:[[160,600]]},skyscraperC:{size:[[160,600]]},verticalA:{size:[[120,240]]},beforeContent:{size:[[620,32],[652,400]]},afterContent:{size:[[425,400],[620,400],[652,400]]},smallRectangle:{size:[[180,150],[180,200],[180,272]]},video1:{size:[[468,60]]},boxA:{size:[[300,125]]},boxB:{size:[[330,140]]},usnuca:{size:[[237,92]]},usnucb:{size:[[237,92]]},usnucc:{size:[[237,92]]},usnucd:{size:[[237,92]]},anchor:{size:[[1,1],[950,65]]},stitial:{size:[[1,1],[500,500]],pos:"stitial",outOfPage:!0},featured:{size:[[468,60],[620,120],[620,210],[620,300]]},rankingsEmbed:{size:[[603,90],[468,60],[408,90]],pos:"rankingsEmbed"},profilePhotoEmbed:{size:[[445,32]]},widgetEmbed:{size:[[88,31]]},custom1:{size:[[1,1]],pos:"custom1",outOfPage:!0},custom2:{size:[[1,1]],pos:"custom2",outOfPage:!0},custom3:{size:[[1,1]],pos:"custom3",outOfPage:!0},custom4:{size:[[1,1]],pos:"custom4",outOfPage:!0},custom5:{size:[[1,1]],pos:"custom5",outOfPage:!0},rankdesc:{size:[[80,31],[88,31]],pos:"rankdesc"},logobug:{size:[[80,31],[88,31]],pos:"logobug"},biskad:{size:[[88,32]]},gradbug:{size:[[205,45],[88,31]],pos:"gradbug"},leaderboardLightbox:{size:[[728,90]],pos:"leaderboardLightbox"},"div-gpt-ad-top":{size:[[728,90],[970,250],[970,90]],pos:"top"}},genericSlots:{"top-leaderboardmobile":[[300,50]],"bot-leaderboardmobile":[[300,50]],"top-rectanglemobile":[[300,250]],"bot-rectanglemobile":[[300,250]],rectangle:[[300,250]],rectanglemobile:[[300,250]],leaderboardmobilea:[[300,50]],pollbug:[[88,31]],"brandfuse:":[[1,1]]},render:function(id,valuation){var slot,size,pos,outOfPage,genericName;window.usnNativoCompanion||"stitial"===id&&0===top.location.host.indexOf("admin")||(usnAdUnit.slot[id]?(slot=usnAdUnit.slot[id],size=slot.size,pos=slot.pos,outOfPage=slot.outOfPage):(genericName=id.split("_")[0],size=usnAdUnit.genericSlots[genericName]?usnAdUnit.genericSlots[genericName]:[[1,1]],pos=id,0===pos.indexOf("top")?pos="top":0===pos.indexOf("bot")&&(pos="bot"),outOfPage="brandfuse_1"===id),"leaderBoardB"===id&&$(document).ready(function(){var $footer=$("#footer"),$lbb=$("#leaderboardB");$footer.length&&$lbb.length&&!$lbb.parents("#footer").length&&$lbb.detach().insertBefore($footer)}),googletag.cmd.push(function(){var adSlot;if(adSlot=outOfPage?googletag.defineOutOfPageSlot(usnAdSetup.name(),id):googletag.defineSlot(usnAdSetup.name(),size,id),usnAdSlots[id]=adSlot,adSlot.addService(googletag.pubads()),window.rubicontag&&window.rubicontag.setTargetingForGPTSlot&&window.rubicontag.setTargetingForGPTSlot(adSlot),adSlot.setTargeting("kw",usnKeywords),adSlot.setTargeting("pos",pos),adSlot.setTargeting("amznslots",amz),Krux.user&&Krux.segments&&(adSlot.setTargeting("ksg",Krux.segments),adSlot.setTargeting("kuid",Krux.user)),"undefined"!=typeof yieldbot&&adSlot.setTargeting("ybot",yieldbot.getPageCriteria()),"undefined"!=typeof utag_data&&void 0!==utag_data.doctor_hospital_affiliations&&adSlot.setTargeting("doctor_hospital_affiliations",utag_data.doctor_hospital_affiliations),usnAdThreshold[id]&&adSlot.setTargeting("th","thresholdpassed"),"undefined"!=typeof oVa)switch(id){case"leaderboardA":adSlot.setTargeting("oView",oVa.leaderboardA);break;case"leaderboardA_mobile":adSlot.setTargeting("oView",oVa.leaderboardA_mobile);break;case"rectangleA":adSlot.setTargeting("oView",oVa.rectangleA);break;case"rectangleA_mobile":adSlot.setTargeting("oView",oVa.rectangleA_mobile);break;case"leaderboardB":adSlot.setTargeting("oView",oVa.leaderboardB);break;case"leaderboardB_mobile":adSlot.setTargeting("oView",oVa.leaderboardB_mobile);break;case"rectangleB":adSlot.setTargeting("oView",oVa.rectangleB);break;case"rectangleC":adSlot.setTargeting("oView",oVa.rectangleC);break;case"rectangleB_mobile":adSlot.setTargeting("oView",oVa.rectangleB_mobile)}"header_takeover"===id?adSlot.setCollapseEmptyDiv(!0,!0):adSlot.setCollapseEmptyDiv(!0),adSlot.renderedId=id,adSlot.renderedPos=pos,googletag.enableServices()}),googletag.cmd.push(function(){googletag.display(id)}))}},googletag.cmd.push(function(){googletag.pubads().addEventListener("slotRenderEnded",function(event){event.isEmpty||"leaderboardB_mobile"===event.slot.renderedId&&"bot"===event.slot.renderedPos&&$("body").addClass("has-fixed-leaderboardB")})}),usnFireAd={init:function(){setTimeout(function(){usnAdQueue.length>0&&(usnFireAd.fireQueued(),usnAdQueue=[]),window.dblclick=usnAdUnit.render},1e3)},preProcess:function(id,valuation){usnAdQueue.length>0&&(usnFireAd.fireQueued(),usnAdQueue=[]),usnAdUnit.render(id,valuation)},fireQueued:function(){for(var i=0;i<usnAdQueue.length;i++)usnAdUnit.render(usnAdQueue[i].id,usnAdQueue[i].valuation)}},usnKeywords=usnAdSetup.keywords(),usnAdThreshold=usnAdSetup.threshold(),"undefined"!=typeof amznads)var amz=amznads.getTokens()||[];usnFireAd.init(),window.dblclick=usnFireAd.preProcess,window.usnRefreshAds=function(adSlotTarget){var _refreshSlot=function(adSlot){var $adSlot=$("#"+adSlot);usnAdSlots.hasOwnProperty(adSlot)&&null!==usnAdSlots[adSlot]&&$adSlot&&$adSlot.is(":visible")&&(isInternetExplorer&&$adSlot.empty(),usnAdSlots[adSlot].setTargeting("kw",usnKeywords),googletag.cmd.push(function(){googletag.pubads().refresh([usnAdSlots[adSlot]])}))};if(window.Krux){var envMatch=window.location.hostname.match(/(uat\d+|sand\d+|localhost)/),pageView=null===envMatch;window.Krux("ns:usnews","page:load",function(err){},{pageView:pageView})}if(usnKeywords=usnAdSetup.keywords(),USN.util.getMetaContent("adThreshold")){usnAdThreshold=usnAdSetup.threshold();for(var ad in usnAdThreshold)usnAdThreshold.hasOwnProperty(ad)&&googletag.cmd.push(function(){usnAdSlots[ad].setTargeting("th","thresholdpassed")})}if(adSlotTarget)_refreshSlot(adSlotTarget);else{$(".mod-oop").remove();for(var adSlot in usnAdSlots)_refreshSlot(adSlot)}}}(),function(factory){factory(jQuery)}(function($){function raw(s){return s}function decoded(s){return decodeURIComponent(s.replace(pluses," "))}function converted(s){0===s.indexOf('"')&&(s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\"));try{return config.json?JSON.parse(s):s}catch(er){}}var pluses=/\+/g,config=$.cookie=function(key,value,options){if(void 0!==value){if(options=$.extend({},config.defaults,options),"number"==typeof options.expires){var days=options.expires,t=options.expires=new Date;t.setDate(t.getDate()+days)}return value=config.json?JSON.stringify(value):String(value),document.cookie=[config.raw?key:encodeURIComponent(key),"=",config.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join("")}for(var decode=config.raw?raw:decoded,cookies=document.cookie.split("; "),result=key?void 0:{},i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("="),name=decode(parts.shift()),cookie=decode(parts.join("="));if(key&&key===name){result=converted(cookie);break}key||(result[name]=converted(cookie))}return result};config.defaults={},$.removeCookie=function(key,options){return void 0!==$.cookie(key)&&($.cookie(key,"",$.extend({},options,{expires:-1})),!0)}}),function(){try{var c,a={l1:document.location.host.replace(/^www\./,""),l2:document.title||"Untitled",l3:"__page__",l4:"-",sa:"",sn:""},b=[];for(c in a)b.push(c+"="+encodeURIComponent(a[c]));b=b.join("&"),(new Image).src="//d1m6iycbx7in66.cloudfront.net?a=f008fd0692ac4d20ad1ed6b8bb69fda7";var d=document.createElement("script");d.type="text/javascript",d.async=!0;var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(d,e),d.src="https://z.moatads.com/usnewscontent20570034/moatcontent.js#"+b}catch(f){try{var g="//pixel.moatads.com/pixel.gif?e=24&d=data%3Adata%3Adata%3Adata&i=MOATCONTENTABSNIPPET1&ac=1&k="+encodeURIComponent(f)+"&j="+encodeURIComponent(document.referrer)+"&cs="+(new Date).getTime();(new Image).src=g}catch(h){}}}();