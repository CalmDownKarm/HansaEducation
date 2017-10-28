



/* ControlTag Loader for U.S. News & World Report a44d508a-f6b3-4bef-a1b1-b0c630ad90d3 */
(function(w, cs) {
  
  if (/Twitter for iPhone/.test(w.navigator.userAgent || '')) {
    return;
  }

  var debugging = /kxdebug/.test(w.location);
  var log = function() {
    
    debugging && w.console && w.console.log([].slice.call(arguments).join(' '));
  };

  var load = function(url, callback) {
    log('Loading script from:', url);
    var node = w.document.createElement('script');
    node.async = true;  
    node.src = url;

    
    node.onload = node.onreadystatechange = function () {
      var state = node.readyState;
      if (!callback.done && (!state || /loaded|complete/.test(state))) {
        log('Script loaded from:', url);
        callback.done = true;  
        callback();
      }
    };

    
    var sibling = w.document.getElementsByTagName('script')[0];
    sibling.parentNode.insertBefore(node, sibling);
  };

  var config = {"app":{"name":"krux-scala-config-webservice","version":"3.32.2","schema_version":3},"confid":"rblvc9nal","context_terms":[],"publisher":{"name":"U.S. News & World Report","active":true,"uuid":"a44d508a-f6b3-4bef-a1b1-b0c630ad90d3","version_bucket":"stable","id":2223},"params":{"link_header_bidder":false,"site_level_supertag_config":"site","recommend":false,"control_tag_pixel_throttle":100,"fingerprint":false,"user_data_timing":"load","use_central_usermatch":true,"store_realtime_segments":false,"tag_source":false,"link_hb_start_event":"ready","first_party_uid":false,"link_hb_timeout":2000,"link_hb_adserver_subordinate":true,"optimize_realtime_segments":false,"link_hb_adserver":"dfp","target_fingerprint":false,"context_terms":false,"dfp_premium":true,"control_tag_namespace":"usnews"},"prioritized_segments":[],"realtime_segments":[{"id":"r7suzovz2","test":["and",["and",["or",["or","$event_LgHOZUSK"]]]]}],"services":{"userdata":"//cdn.krxd.net/userdata/get","contentConnector":"//connector.krxd.net/content_connector","stats":"//apiservices.krxd.net/stats","optout":"//cdn.krxd.net/userdata/optout/status","event":"//beacon.krxd.net/event.gif","set_optout":"https://consumer.krxd.net/consumer/optout","data":"//beacon.krxd.net/data.gif","link_hb_stats":"//beacon.krxd.net/link_bidder_stats.gif","userData":"//cdn.krxd.net/userdata/get","link_hb_mas":"//link.krxd.net/hb","config":"//cdn.krxd.net/controltag/{{ confid }}.js","social":"//beacon.krxd.net/social.gif","addSegment":"//cdn.krxd.net/userdata/add","pixel":"//beacon.krxd.net/pixel.gif","um":"https://usermatch.krxd.net/um/v2","controltag":"//cdn.krxd.net/ctjs/controltag.js.{hash}","click":"//apiservices.krxd.net/click_tracker/track","stats_export":"//beacon.krxd.net/controltag_stats.gif","userdataApi":"//cdn.krxd.net/userdata/v1/segments/get","cookie":"//beacon.krxd.net/cookie2json","proxy":"//cdn.krxd.net/partnerjs/xdi","is_optout":"//beacon.krxd.net/optout_check","impression":"//beacon.krxd.net/ad_impression.gif","transaction":"//beacon.krxd.net/transaction.gif","log":"//jslog.krxd.net/jslog.gif","set_optin":"https://consumer.krxd.net/consumer/optin","usermatch":"//beacon.krxd.net/usermatch.gif"},"experiments":[],"site":{"name":"usnews.com","cap":255,"id":1650267,"organization_id":2223,"uid":"rblvc9nal"},"tags":[{"id":32311,"name":"FBCA on USNWR_Online_All_Visitors","content":"<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;\nn.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,\ndocument,'script','https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '960799217289328');\nfbq('track', 'PageView');\nfbq('track', 'USNWR_Online_All_Visitors');\n</script>","target":null,"target_action":"append","timing":"asap","method":"document","priority":null,"template_replacement":true,"internal":false,"criteria":["and",["and",["and",["contains","$url","education/online-"]]]]},{"id":28641,"name":"US News Custom DTC","content":"<script>\n(function() {\nvar dataObj = Krux('scrape.js_global', 'utag_data'),\n    userKeys = 'none',\n    omitKeys = 'none',\n    prefix = 'usnews',\n    custDelimit = 'none',\n    config = {\n        'userKeys': userKeys ? userKeys.split(',') : undefined,\n        'omitKeys': omitKeys ? omitKeys.split(',') : [],\n        'customDelimited': custDelimit ? custDelimit.split(',') : undefined,\n        'caseSensitive': 'false' === 'true',\n        'useFullPath': 'false' === 'true',\n        'useLastValue': 'false' === 'true',\n        'convertAttrNames': []\n    };\nif (typeof(utag_data) !== 'undefined' && typeof(utag_data.site_vertical) !== 'undefined') {\n    if (typeof(utag_data.site_vertical) !== 'undefined') {\n        prefix = utag_data.site_vertical;\n    }\n}\nif (!prefix.match(/^$|null|undefined|false/)) {\n    config.convertAttrNames.push({\n        pattern: /((?:page|user)_attr_)/,\n        replacement: '$1' + prefix + \"_\"\n    });\n}\nconfig.omitKeys.push(/gtm\\./);\nKrux('ingestDataLayer', dataObj, config);\nKrux('scrape', { \n   'page_attr_site_vertical':  {js_global: 'utag_data.site_vertical'}});\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":null,"template_replacement":true,"internal":true,"criteria":[]},{"id":28707,"name":"Liveramp User Match","content":"<script>\n(function(){\n  var kuid = Krux('get', 'user');\n  if (kuid) {\n      var liveramp_url = 'https://idsync.rlcdn.com/379708.gif?partner_uid=' + kuid;\n      var i = new Image();\n      i.src = liveramp_url;      \n  }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":null,"template_replacement":true,"internal":true,"criteria":["and",["and",["and",["<=","$frequency",3]]]]},{"id":28752,"name":"Krux DataLayer Ingester - US News","content":"<script>\n(function(){\n    var dataObj = Krux('scrape.js_global', 'utag_data'),\n        userKeys = 'none',\n        omitKeys = 'none',\n        custDelimit = 'none',\n        prefix = 'undefined_',\n        config = {\n            'userKeys': userKeys ? userKeys.split(',') : undefined,\n            'omitKeys': omitKeys ? omitKeys.split(',') : [],\n            'customDelimited': custDelimit ? custDelimit.split(',') : undefined,\n            'caseSensitive': 'false' === 'true',\n            'useFullPath': 'false' === 'true',\n            'useLastValue': 'false' === 'true',\n            'convertAttrNames': []\n        };\n    if (!prefix.match(/^$|null|undefined|false/)) {\n        config.convertAttrNames.push({\n            pattern: /((?:page|user)_attr_)/,\n            replacement: '$1' + prefix\n        });\n    }\n    config.omitKeys.push(/gtm\\./);\n    Krux('ingestDataLayer', dataObj, config);\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":null,"template_replacement":true,"internal":true,"criteria":[]},{"id":28073,"name":"Krux DTC Standard - All sites","content":"<script>\n(function(){\n\tKrux('scrape',{'page_attr_url_path_1':{'url_path':'1'}});\n\tKrux('scrape',{'page_attr_url_path_2':{'url_path':'2'}});\n\tKrux('scrape',{'page_attr_url_path_3':{'url_path':'3'}});\n\tKrux('scrape',{'page_attr_meta_keywords':{meta_name:'keywords'}});\n\n\tKrux('scrape',{'page_attr_domain':{url_domain: '2'}});\n\n})();\n</script>","target":null,"target_action":"append","timing":"onready","method":"document","priority":null,"template_replacement":true,"internal":true,"criteria":[]},{"id":32312,"name":"FBCA Segments on USNWR_Online_All_Visitors","content":"<script>\n// This library tag assumes fbq is available on the page.\n// All targeted segments should also be set as OR rules in SuperTag\n(function(){\n   if (window.fbq) {\n      var lsSegs = Krux('get','user_segments') || []; // Segs in LS\n      var targetSegIds = 'rp82c7rb1'.split(','); // Segs to target\n\n      targetSegIds.map(function(seg) {\n         if(lsSegs.indexOf(seg) !== -1) {\n            fbq('track', 'ViewContent', {\n                  segment_id: seg \n               }\n            );\n         }\n      })\n   }\n})();\n</script>","target":null,"target_action":"append","timing":"onready","method":"document","priority":null,"template_replacement":true,"internal":false,"criteria":["and",["and",["and",["contains","$url","education/online-"]]]]}],"usermatch_tags":[{"id":6,"name":"Google User Match","content":"<script>\n(function() {\n  if (Krux('get', 'user') != null) {\n      new Image().src = 'https://usermatch.krxd.net/um/v2?partner=google';\n  }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":1,"template_replacement":false,"internal":true,"criteria":[]},{"id":10,"name":"Rubicon User Match","content":"<script>\r\n(function(){\r\n  if (window.Krux) {\r\n    var kuid = window.Krux('get', 'user');\r\n    if (kuid && typeof kuid != 'undefined') {\r\n       var rubicon_url = '//tap.rubiconproject.com/oz/feeds/krux/tokens?afu=' + kuid;\r\n       var i = new Image();\r\n       i.src = rubicon_url;\r\n    }\r\n  }\r\n})();\r\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":1,"template_replacement":false,"internal":true,"criteria":[]},{"id":21,"name":"Acxiom","content":"<script>\n(function(){\n  var kuid = Krux('get', 'user');\n  if (kuid) {\n      var liveramp_url = 'https://idsync.rlcdn.com/379708.gif?partner_uid=' + kuid;\n      var i = new Image();\n      i.src = liveramp_url;      \n  }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":1,"template_replacement":false,"internal":true,"criteria":[]},{"id":29,"name":"Nativo User Match","content":"<script>\n(function() {\n    var kuid = Krux('get', 'user');\n    var prefix = location.protocol;\n    if (kuid) {\n        var nativo_url = prefix + '//jadserve.postrelease.com/dmp/5?vk=KRUX_USER_ID&ntv_r=' + prefix + '//beacon.krxd.net/usermatch.gif?partner=nativo&partner_uid=NTV_USER_ID';\n        var i = new Image();\n        i.src = nativo_url;\n    }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":1,"template_replacement":false,"internal":true,"criteria":[]},{"id":7,"name":"OpenX User Match","content":"<script>\n\n(function(){\n    var prefix = location.protocol == 'https:' ? 'https:' : 'http:' ;\n    var match_pixel = prefix + '//u.openx.net/w/1.0/cm?id=b53b3de0-a5e8-47e3-a78f-ca218d037abe&r=' + prefix + '//beacon.krxd.net/usermatch.gif?partner=openx&partner_uid=';\n    (new Image()).src = match_pixel;\n})();\n\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":2,"template_replacement":false,"internal":true,"criteria":[]},{"id":34,"name":"Comscore Data Tag","content":"<script>\r\n(function(){\r\n  var kuid = Krux('get', 'user');\r\n  var cbust = Math.round(new Date().getTime() / 1000);\r\n  var prefix = location.protocol == 'https:' ? \"https:\" :\"http:\";\r\n  var url = prefix == 'https:' ? '//sb.scorecardresearch.com/p' : '//b.scorecardresearch.com/p';\r\n  if (kuid) {\r\n    Krux('require:http').pixel({\r\n      url: url,\r\n      data: {\r\n          c1: '9',\r\n          c2: '8188709',\r\n          cs_xi: kuid,\r\n          rn: cbust\r\n      }});\r\n  }\r\n  })();\r\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":2,"template_replacement":false,"internal":true,"criteria":[]},{"id":65,"name":"Weborama User Match","content":"<script>\n(function(){\n\n   var kuid = Krux('get', 'user');\n   var krux_url = encodeURIComponent('://beacon.krxd.net/usermatch.gif?partner=weborama&partner_uid=');\n   if (kuid) {\n      new Image().src = 'https://dx.bigsea.weborama.com/collect?r=https' + krux_url + '{UUID}';\n   }\n\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":3,"template_replacement":false,"internal":true,"criteria":[]},{"id":76,"name":"LiveRamp User Matching","content":"<script>\n(function(){\n  var kuid = Krux('get', 'user');\n  if (kuid) {\n      var liveramp_url = 'https://idsync.rlcdn.com/379708.gif?partner_uid=' + kuid;\n      var i = new Image();\n      i.src = liveramp_url;     \n  }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":3,"template_replacement":false,"internal":true,"criteria":[]},{"id":82,"name":"DataLogix - Legacy","content":"<script>\r\n    (function() {\r\n        var kuid = Krux('get', 'user');\r\n        if (kuid) {\r\n            var prefix = location.protocol == 'https:' ? \"https:\" : \"http:\";\r\n            var kurl_params = encodeURIComponent(\"_kuid=\" + kuid + \"&_kdpid=2dd640a6-6ebd-4d4f-af30-af8baa441a0d&dlxid=<na_id>&dlxdata=<na_da>\");\r\n            var kurl = prefix + \"//beacon.krxd.net/data.gif?\" + kurl_params;\r\n            var dlx_url = '//r.nexac.com/e/getdata.xgi?dt=br&pkey=gpwn29rvapq62&ru=' + kurl;\r\n            var i = new Image();\r\n            i.src = dlx_url;\r\n        }\r\n    })();\r\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":3,"template_replacement":false,"internal":true,"criteria":[]},{"id":85,"name":"IXI Digital Open Market","content":"<script>\n(function(){\n    var prefix = window.location.protocol == 'https:' ? 'https:' : 'http:';\n    new Image().src = prefix + '//kr.ixiaa.com/C726AB29-0470-440B-B8D2-D552CED3A3DC/a.gif';\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":3,"template_replacement":false,"internal":true,"criteria":[]},{"id":86,"name":"Neustar AdAdvisor S2S","content":"<script>\n(function(){\nvar kuid = Krux('get', 'user');\nvar prefix = window.location.protocol == 'https:' ? 'https:' : 'http:';\nif (kuid) {\n    new Image().src = prefix + '//aa.agkn.com/adscores/g.js?sid=9212244187&_kdpid=2111c0af-fc3a-446f-ab07-63aa74fbde8e';\n     }\n})();\n</script>","target":null,"target_action":"append","timing":"onload","method":"document","priority":3,"template_replacement":false,"internal":true,"criteria":[]}],"link":{"adslots":{},"bidders":{}}};
  
  for (var i = 0, tags = config.tags, len = tags.length, tag; (tag = tags[i]); ++i) {
    if (String(tag.id) in cs) {
      tag.content = cs[tag.id];
    }
  }

  
  var esiGeo = String(function(){/*
   <esi:include src="/geoip_esi"/>
  */}).replace(/^.*\/\*[^{]+|[^}]+\*\/.*$/g, '');

  if (esiGeo) {
    log('Got a request for:', esiGeo, 'adding geo to config.');
    try {
      config.geo = w.JSON.parse(esiGeo);
    } catch (__) {
      
      log('Unable to parse geo from:', config.geo);
      config.geo = {};
    }
  }



  var proxy = (window.Krux && window.Krux.q && window.Krux.q[0] && window.Krux.q[0][0] === 'proxy');

  if (!proxy || true) {
    

  load('//cdn.krxd.net/ctjs/controltag.js.8508be838d94dc9198a6fb9a854d3e47', function() {
    log('Loaded stable controltag resource');
    Krux('config', config);
  });

  }

})(window, (function() {
  var obj = {};
  
  return obj;
})());
