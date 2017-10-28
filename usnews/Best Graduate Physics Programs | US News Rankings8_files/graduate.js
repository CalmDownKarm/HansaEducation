String.prototype.includes||(String.prototype.includes=function(search,start){"use strict";return"number"!=typeof start&&(start=0),!(start+search.length>this.length)&&1!==this.indexOf(search,start)}),$(document).ready(function(){var to_collapse=$(".college-scout-promo");to_collapse.length&&(to_collapse.each(function(){$(this).before($('<a class="collapsible-controller">More</a>').addClass("collapsed").click(function(){return $(this).next("div").slideToggle("fast"),$(this).toggleClass("collapsed"),!1}))}),$(to_collapse).hide())}),$(document).ready(function(){var fields=[{name:"v_concentration_offered_list",count_elem:"td",display_count:!0,min_count:5},{name:"v_edu_programs",count_elem:"td",display_count:!0,min_count:5}];$.each(fields,function(){var $self=$("tr."+this.name+"-extra-row"),item_count=$self.find("table.zebra-stripe "+this.count_elem).length;if(item_count>this.min_count){var $control=$self.prev().children("td").eq(0);$control.wrapInner('<a class="collapsible-controller" />').children("a").eq(0).addClass("collapsed").click(function(){return $self.toggle("none"==$self.css("display")),$(this).toggleClass("collapsed"),!1}),this.display_count&&$control.prepend('<span class="collapse-count">('+item_count+")</span>"),$self.hide()}})}),$(document).ready(function(){$("body.project-grad_schools-other p.specialties, body.project-grad_schools-school-index p.specialties, body.project-grad_schools-school-ranking p.specialties").each(function(){var $self=$(this),$to_toggle=$self.nextUntil(),item_count=$to_toggle.length;if(item_count>=1){var $control=$self;$control.wrapInner('<a class="collapsible-controller" />').children("a").eq(0).addClass("collapsed").click(function(){return $to_toggle.toggle("none"==$to_toggle.css("display")),$(this).toggleClass("collapsed"),!1}),$control.prepend('<span class="collapse-count">('+item_count+")</span>"),$to_toggle.hide()}})}),$(document).ready(function(){if($.fn.cluetip){var options={splitTitle:" | ",positionBy:"mouse",tracking:!0};$("table.ranking-data td[title]").has("span.footnote[title]").removeAttr("title"),$("table.searchresult td[title]").has("span.footnote[title]").removeAttr("title"),$("table.ranking-data td[title]").has(".data-correction-star").each(function(){var tooltipText=$(this).attr("title");$(this).removeAttr("title"),$(this).find(".data-correction-star").attr("title",tooltipText).cluetip(options)}),$("table.fields tr[title], table.fields td[title]").cluetip(options),$("table.ranking-data td[title], table.ranking-data .cluetip").cluetip(options),$("table.searchresult td[title]").cluetip(options),$("span.footnote[title]").cluetip(options),$("span.rankings-score span[title], span.rankscore-bronze span[title]").cluetip(options),$("span.rankings-score-rnp span[title]").cluetip(options),$("span.rankings-score-unranked span[title]").cluetip(options)}}),$(document).on("colReplaced",function(){if($.fn.cluetip){var options={splitTitle:" | ",positionBy:"mouse",tracking:!0};$("span.footnote[title]").cluetip(options),$(".data-correction-star").cluetip(options)}}),$(document).ready(function(){$.fn.cluetip&&$("span.full-url").cluetip({cluetipClass:"full-url",splitTitle:" | ",arrows:!0,dropShadow:!1,width:"445px",sticky:!0,positionBy:"fixed",topOffset:25,leftOffset:-227,onShow:function(ct,c){var ct_title=ct.find("h3");ct_title.replaceWith('<input type="text" readonly="readonly" value="'+ct_title.text()+'" />'),ct_title=ct.find("input"),ct_title.focus(function(){this.select()}).mouseup(function(e){e.preventDefault()}).trigger("focus")}})}),$(document).ready(function(){$.fn.fancybox&&$(".fancybox").fancybox()}),$(document).ready(function(){$.fn.menu&&($(".fg-menu ul").hide(),$(".fg-menu .current").addClass("current-js").menu({content:"<div>"+$(".fg-menu ul").html()+"</div>",showSpeed:0,width:380}),1==$(".fg-menu .current").length&&$(window).resize(function(){var current_left=$(".fg-menu .current").offset().left;$(".positionHelper").css({left:current_left+"px"})}))}),$(document).ready(function(){$("dl.specialtyrankings dd.more-specialties").length&&($("dl.specialtyrankings").css({overflow:"visible"}),$("dl.specialtyrankings p.featured-specialties").show(),$("dl.specialtyrankings dd.more-specialties p.more").wrapAll('<div class="all-specialties" />'),$("dl.specialtyrankings .all-specialties").before('<a class="more more-specialties" href="#">More specialties</a>'),$("a.more-specialties").click(function(){return $(this).next(".all-specialties").toggle(),$(this).toggleClass("more-specialties-collapsed"),!1}),$("a.more-specialties").trigger("click"))}),$(document).ready(function(){$("dl.save-compare a.add").click(function(){var collegeId,href;return window.FooBar&&FooBar.initialized&&(this.rel?collegeId=this.rel:this.href&&"#"!==this.href&&(href=this.href.split("/"),collegeId=href[href.length-1]),FooBar.saveschool(collegeId)),!1})}),$(document).ready(function(){if(window.FooBar){var placeholder=$("#foobar");placeholder.length||(placeholder=$("<div/>").attr("id","foobar").appendTo($("#footer")));var buttons=$(".foobar-login"),greetings=$(".foobar-greeting");$("#foobar").bind("foobarinit",function(){FooBar.isloggedin()?(greetings.removeClass("is-hidden").show(),greetings.html(function(index,oldhtml){return oldhtml.replace("{{name}}",FooBar.getname())}),buttons.hide().filter(".logout").show()):(greetings.hide(),buttons.show().filter(".logout").hide())}),FooBar.init(placeholder,"/toolbar")}}),$(document).ready(function(){$("#foobar").bind("foobarinit",function(){$("table.ranking-data .saveschool").each(function(){FooBar.issaved(this.value)?this.checked=!0:this.checked=!1}).click(function(event){this.checked?FooBar.saveschool(this.value):FooBar.removeschool(this.value)})})}),$(document).ready(function(){}),$(document).ready(function(){$.fn.engagementTool&&($(".twitter-share-button").engagementTool("tweet5",{position:"vertical"}),$(".g-plusone").engagementTool("gplus",{gplus_button_size:"tall",position:"bubble"}),$(".fb-like").engagementTool("fbshare",{position:"box_count"}))}),$(function(){$.fn.columnizer&&$("table.ranking-data").columnizer({columnSelector:".is-premium",linkSelector:"a.pager_link, th a",columnWillChange:function(e,$table,$select){return $table.hasClass("ranking-data-free")&&$.fn.fancybox&&$.fancybox.open({href:"#columnizerNote",scrolling:"no"}),!0},columnDidChange:function($table){$.event.trigger("colReplaced")}})}),$(document).ready(function(){$.fn.interstitial&&$("body").interstitial({frame_width:"700",frame_height:"446",content_url:"https://www.usnews.com/static/adcode/grad-compass-interstitial.html",repeat_cycle:14,page_visits:5,cookie_title:"usn_grad_interstitial",location_hostname:"rankingsandreviews"})}),$(document).ready(function(){$("html").hasClass("skin-premium")&&window.location.pathname.includes("/best-graduate-schools/top-business-schools/part-time-rankings")&&$("form.columnizer").css("display","none")});