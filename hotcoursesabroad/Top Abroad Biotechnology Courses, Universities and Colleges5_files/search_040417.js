
function removeQama(str){
	 while(str.substring(0,1)==","){
		 str=str.substring(1,str.length); // remove start with comma
		}while(str.substring(str.length-1,str.length)==","){
			str=str.substring(0,str.length-1); // remove end comma
	}
  return str;
}
function removeDuplicateCountries(cntryIds,filterCntrds,removevalue){
	var filtids="";
	var cntrIds="";
	var flag="N";
	if(filterCntrds.indexOf(",")!=-1){
		var fltrcnid=filterCntrds.split(",");
		var cntIds=cntryIds.split(",");
		for(var i=0;i<fltrcnid.length;i++){
			if(fltrcnid[i].indexOf("-")!=-1){
				filtids=filtids+fltrcnid[i]+",";
				cntrIds=cntrIds+cntIds[i]+",";
				flag="Y";
			}else if(filterCntrds.indexOf(fltrcnid[i]+"-")==-1){
				if(flag=="N"){
					filtids=filtids+fltrcnid[i]+",";
					cntrIds=cntrIds+cntIds[i]+",";
				}else{
					if(i==1){
						filtids=filtids+fltrcnid[i]+",";
						cntrIds=cntrIds+cntIds[i]+",";
					}else{
						filtids=filtids+fltrcnid[i];
						cntrIds=cntrIds+cntIds[i];		
					}
				}
			}
		}
		filtids=removeQama(filtids);
		cntrIds=removeQama(cntrIds);
		return cntrIds+"$$$$"+filtids;
	}else{
		return "NO-SPLIT";
	}
}
function removeCntryValues(removevalue){
	var filtids="";
	var cntrIds="";
	var regids="";
	var msg="NO-SPLIT";
	if($1("filterCntrds")!=null){
		var fltrids=$1("filterCntrds").value;
		if(fltrids.indexOf(",")!=-1){
			var fltrcnid=fltrids.split(",");
			for(var i=0;i<fltrcnid.length;i++){
				if(fltrcnid[i].indexOf("-")!=-1){
					var split=fltrcnid[i].split("-");
					if(split[1]!=removevalue){
						cntrIds=cntrIds+","+split[0];
						regids=regids+","+split[1];
						filtids=filtids+","+split[0]+"-"+split[1];
					}else{
						cntrIds=cntrIds+","+split[0];
						filtids=filtids+","+split[0];
					}
					
				}else if(fltrcnid[i]!=removevalue){
					cntrIds=cntrIds+","+fltrcnid[i];
					filtids=filtids+","+fltrcnid[i];
				}
			}
			if(regids!=""){
				msg=removeQama(cntrIds)+"$$$$"+removeQama(regids)+"$$$$"+removeQama(filtids);regids	
			}else{
				msg=removeQama(cntrIds)+"&&&&"+removeQama(filtids);
			}
		}else{
			if(fltrids.indexOf("-")!=-1){
				var split=fltrids.split("-");
				cntrIds=cntrIds+split[0];
				filtids=filtids+split[0];
				msg=removeQama(cntrIds)+"&&&&"+removeQama(filtids);
			}else{
				msg="NO-SPLIT";
			}
		}
	}
	return msg;
}
function finduplicateCountries(formurl){
	  var cntryIds="";
	  var cntryFlag="false";
	  var filterCntrds="";
	  var duplicateFlag="N";
	 
	   //For country id -- Start
		if($1("cntryIds")!=null && $1("cntryIds").value!="-1"){
			cntryIds=$1("cntryIds").value;
			filterCntrds=filterCntrds+$1("cntryIds").value;
			cntryFlag="true";
		 }
		//For country id-- End
		
		 //For country id -- Start
		if($1("cntryIds1")!=null && $1("cntryIds1").value!="-1"){
			if(cntryFlag=="true"){
				cntryIds=cntryIds+","+$1("cntryIds1").value;
				filterCntrds=filterCntrds+","+$1("cntryIds1").value;
				}else{
					cntryIds=$1("cntryIds1").value;
					filterCntrds=filterCntrds+$1("cntryIds1").value;
				}
			cntryFlag='true';
		 }
		//For country id-- End
		
		 //For country id -- Start
		if($1("cntryIds2")!=null && $1("cntryIds2").value!="-1"){
			if(cntryFlag=="true"){
			   cntryIds=cntryIds+","+$1("cntryIds2").value;
			   filterCntrds=filterCntrds+","+$1("cntryIds2").value;
			}else{
				cntryIds=$1("cntryIds2").value;
				filterCntrds=filterCntrds+$1("cntryIds2").value;
			}

		 }
		//For country id-- End

	
	if(cntryIds!=""){
		cntryIds=removeQama(cntryIds);
		if(cntryIds.indexOf(",")!=-1){
			 var arr = cntryIds.split(",");
			 var sorted_arr = arr.sort(); // You can define the comparing function here. 
			                             // JS by default uses a crappy string compare.
			 for (var i = 0; i < arr.length - 1; i++) {
			    if (sorted_arr[i + 1] == sorted_arr[i]) {
			        duplicateFlag="Y";
			    }
			  }
			}
	}	

	if(duplicateFlag=='Y'){
		formurl="Duplicate_Regions";
	}
	//alert("queryStringUrl "+queryStringUrl);
	
	return formurl;	
}
var norestierflag="N"
function formRefineUrl(refineType,refineValue,removeValue){
	 var queryStringUrl="";
	   // User nationality--Start
	  if(refineType=="CLEAR"){
		  if($1('natinalityid')!=null){
			  queryStringUrl=queryStringUrl+"&nationCode="+$1('natinalityid').value;
		  }
	   }else{
	   if($1('nationId')!=null && $1('nationId').value!="-1"){
		 queryStringUrl=queryStringUrl+"&nationCode="+$1('nationId').value;
	    }
	   }
	   // User nationality--End
	   
	   // User Nation Country--Start
	  if(refineType=="CLEAR"){
		  if($1('hidnationCntryCode')!=null){
			  queryStringUrl=queryStringUrl+"&nationCntryCode="+$1('hidnationCntryCode').value;
		  }
	  }else{
	   if($1('nationcntryid')!=null && $1('nationcntryid').value!="-1"){
		  if($1('nationcntryid').value.indexOf(":")!=-1){
			  var splitcntry=$1('nationcntryid').value.split(":");
			  queryStringUrl=queryStringUrl+"&nationCntryCode="+splitcntry[0];
		  } else{
		 queryStringUrl=queryStringUrl+"&nationCntryCode="+$1('nationcntryid').value;
	     }
	    }
	  }
	   // User  Nation Country--End
	   
	   //  User Qualification--Start
	  if(refineType=="CLEAR"){
		 if($1('hidmyqualid')!=null){
			 queryStringUrl=queryStringUrl+"&userQual="+$1('hidmyqualid').value;
		 }  
	  }else{
	   if($1('userQualId')!=null && $1('userQualId').value!="-1"){
		  if($1('userQualId').value.indexOf(":")!=-1){
			  var userQualSplit=$1('userQualId').value.split(":"); 
			  queryStringUrl=queryStringUrl+"&userQual="+userQualSplit[0];
			  
		  }else{
			  queryStringUrl=queryStringUrl+"&userQual="+$1('userQualId').value;  
		  }
	    }
	  }
	   // User  Qualification--End
	   
	   //  User Qualification--Start
	  if(refineType=="CLEAR"){
		if($1('hiduserGradeid')!=null){
			queryStringUrl=queryStringUrl+"&userGrade="+$1('hiduserGradeid').value;
		}  
	  }else{
	   if($1('userGradeId')!=null && $1('userGradeId').value!="-1"){
		 queryStringUrl=queryStringUrl+"&userGrade="+$1('userGradeId').value;
	    }
	  }
	   // User  Qualification--End
	   
	   //User Grade Score --Start
	  
	  if(refineType=="CLEAR"){
		  if($1('grdScrId')!=null){
			  queryStringUrl=queryStringUrl+"&gradeScore="+encodeURIComponent($1('grdScrId').value);
		  }
	  }else{
      if($1('userGradeScrId')!=null && $1('userGradeScrId').value!="-1"){
    	  queryStringUrl=queryStringUrl+"&gradeScore="+encodeURIComponent($1('userGradeScrId').value);
      }else{
	   if($1('gradeScoreid')!=null && trim($1('gradeScoreid').value)!=""){
		   if($1('gradeScoreid').value!=$1('deftextid').value){ 
		   queryStringUrl=queryStringUrl+"&gradeScore="+encodeURIComponent(trim($1('gradeScoreid').value.replace('%',''))); //Sagu 29-Sep-15 removing % for fixing bug
		   }
	     }
       }
	  }
	   //User Grade Score -- End
	   
	    // for Page Number --start
		if(refineType=="pageNo"){
			queryStringUrl=queryStringUrl+"&pageNo="+refineValue;
		} /*else{
			queryStringUrl=queryStringUrl+"&pageNo="+$1('pageNumId').innerHTML;
		}*/
		// for Page Number --End
	   
		// For Country Id --Start 
		if($1("hidCountryid")!=null){
			queryStringUrl=queryStringUrl+"&countryid="+$1("hidCountryid").value;
		}
		// For Country Id --End 
		
		// For qual Id --Start 
		if(refineType=="CLEAR"){
			if(refineValue!="PARENT"){
				if($1("hidparentslevelId")!=null){
					queryStringUrl=queryStringUrl+"&parentQualId="+$1("hidparentslevelId").value;	
				}
			}
		}else{
		if($1("parentSlevelId")!=null && $1("parentSlevelId").value!="-1"){
			queryStringUrl=queryStringUrl+"&parentQualId="+$1("parentSlevelId").value;
		 }
		}
		// For qual Id --End 
		
		// For sub qual Id --Start
		if(refineType=="CLEAR"){
			if(refineValue!="SUBQUAL"){
				if($1("hidsubQualid")!=null){
					queryStringUrl=queryStringUrl+"&subQualId="+$1("hidsubQualid").value;	
				}
			}
		}else{
			if($1("childSlevelId")!=null && $1("childSlevelId").value!="-1"){
				queryStringUrl=queryStringUrl+"&subQualId="+$1("childSlevelId").value;
			 }
		}
		// For sub qual Id --End 
		
		// For Category Id --Start 
		if(refineValue!="CATG"){
			if(refineType=="CLEAR"){
				if($1('hidcatId')!=null){
					queryStringUrl=queryStringUrl+"&catCode="+$1('hidcatId').value;	
				}
			}else{
				if($1("subjectId")!=null && $1("subjectId").value!="-1"){
					queryStringUrl=queryStringUrl+"&catCode="+$1("subjectId").value;	
			}
		 }
		}else if(refineValue=="CATG"){
			if(removeValue!=undefined){
				queryStringUrl=queryStringUrl+"&catCode="+removeValue;	
			}
		}
		// For Category Id --End 
		
		// For smode Id --Start 
		if(refineType=="CLEAR"){
			if(refineValue!="SMODE"){
				if($1("smodeId")!=null){
					queryStringUrl=queryStringUrl+"&smode="+$1("smodeId").value;	
				}
			}
		}else{
			if($1("smode")!=null && $1("smode").value!="-1"){
				queryStringUrl=queryStringUrl+"&smode="+$1("smode").value;
			 }
		}
		// For smode Id --End 
		
		// For smode Id --Start 
		if(refineType=="CLEAR"){
			if(refineValue!="SLENGTH"){
				if($1("studylengthId")!=null){
					queryStringUrl=queryStringUrl+"&studylength="+$1("studylengthId").value;	
				}
			}
		}else{
			if($1("sduration")!=null && $1("sduration").value!="-1"){
				queryStringUrl=queryStringUrl+"&studylength="+$1("sduration").value;
			 } 
		}
		// For smode Id --End
		
		
		// For smode Id --Start 
		if($1("applyNowId")!=null){
			queryStringUrl=queryStringUrl+"&applyNow="+$1("applyNowId").value;
		}
		// For smode Id --End 
		
		// For keyword Id --Start 
		if(refineValue!="KEYWORD"){
		if($1("hidkeywordid")!=null){
			queryStringUrl=queryStringUrl+"&keyword="+encodeURIComponent($1("hidkeywordid").value);
		  }
         }
		// For keyword Id --End 
		
		// For English type-- Start 
		if(refineType=="CLEAR"){
			if(refineValue!="ENGLISH"){
				if($1("hidenglishType")!=null){
					queryStringUrl=queryStringUrl+"&englishType="+$1("hidenglishType").value;
				}
			}
		}else{
			if($1("englishId")!=null && $1("englishId").value!="-1"){
				queryStringUrl=queryStringUrl+"&englishType="+$1("englishId").value;
			 }
		}
		// For English type-- End 
		
		// For English Score-- Start 
		if(refineType=="CLEAR"){
			if(refineValue!="ENGLISH"){
				if($1("hidengscord")!=null){
					queryStringUrl=queryStringUrl+"&englishScore="+$1("hidengscord").value;
				}
			}
		 }else{
			if($1("englishScoreId")!=null && $1("englishScoreId").value!="-1"){
					queryStringUrl=queryStringUrl+"&englishScore="+$1("englishScoreId").value;
			}
		 }
		// For English Score-- End
		
		//For sortBy -- Start
		if(refineValue!='ORDERBY'){
		 if(refineType=='sortBy'){
			queryStringUrl=queryStringUrl+"&orderBy="+refineValue;
	    	}else if($1("sortbyid")!=null){
			queryStringUrl=queryStringUrl+"&orderBy="+$1("sortbyid").value;
		 }
		}
		//For sort by-- End
		
	
		// For collegeId --Start 
		if(refineValue!='COLLEGE'){
		if($1("hidcollegeId")!=null){
			queryStringUrl=queryStringUrl+"&collegeId="+$1("hidcollegeId").value;
		 }
		}
		// For collegeId --End 
		
		// For urlcatId --Start 
		if($1("urlcatId")!=null){
			queryStringUrl=queryStringUrl+"&urlcatId="+$1("urlcatId").value;
		 }
		// For urlcatId --End 
		if(!(refineValue=="Next" || refineValue=="Update")){
		 if(refineValue=='tierFlag'){
			 queryStringUrl=queryStringUrl+"&tier2Flag=T2";
		 }else if($1('tier2Flag')!=null){
			 if($1('tier2Flag').value=='Y'){
				 queryStringUrl=queryStringUrl+"&tier2Flag=T2";
			 }
		 }else if(norestierflag=="Y"){
			 queryStringUrl=queryStringUrl+"&tier2Flag=T2";
			 norestierflag="N";
		 }
		}
		 // for Provider Country Id-- Start
		 if($1('provCntryId')!=null){
			 queryStringUrl=queryStringUrl+"&provCntryId="+$1('provCntryId').value; 
		 }
		// for Provider Country Id-- end
		 
		 // get the scholarship search flag --Start
		 if($1('scholarSearch')!=null){
			 queryStringUrl=queryStringUrl+"&scholarSearch="+$1('scholarSearch').value; 
		 }
	   // get the scholarship search flag --end
	
		
       // get the tution fees values --Start
		 if(refineType=="CLEAR"){
			 if(refineValue!="FEES"){
				 if($1('lwTutFees')!=null){
					 queryStringUrl=queryStringUrl+"&lwtutfees="+$1('lwTutFees').value; 
				 }
                if($1('upTutFees')!=null){
                	queryStringUrl=queryStringUrl+"&uptutfees="+$1('upTutFees').value; 
				 }
			 }
		 }else{
			 queryStringUrl=getTutionFees(queryStringUrl); 
		 }
	   // get the tution fees values --end
	
	  
		
		// for country and county form the urls --Start
		 if($1("hidcollegeId")!=null){
			 if($1("hidcountryIds")!=null){
				 queryStringUrl=queryStringUrl+"&countryIds="+$1("hidcountryIds").value+"&filterCntrds="+$1("filterCntrds").value;
			 }
			 
			 if($1("regionIds")!=null){
				 queryStringUrl=queryStringUrl+"&regionIds="+$1("regionIds").value;
			 }
		 }else{
			 if(refineType=="Lookup_Search"){
				 if($1("filterCntrds")!=null){
					queryStringUrl=queryStringUrl+"&countryIds="+$1("hidcountryIds").value+"&filterCntrds="+$1("filterCntrds").value;	
				 }else{
					 queryStringUrl=getContryIds(queryStringUrl,removeValue); 
				 }
			 }else{
				 queryStringUrl=getContryIds(queryStringUrl,removeValue); 
			  }
		 } 
		// for country and county form the urls --End
	return 	queryStringUrl;
}

function getTutionFees(queryStringUrl){
	
  var lwFees=null;
  var upFees=null;
  var tutionFeeses=$1('tutionId').value;
  if(tutionFeeses.indexOf(",")!=-1){
  var splitTut=tutionFeeses.split(",");

  if($1('lwTutFees')!=null && $1('lwTutFees').value==$1('min').value){
	  lwFees=$1('lwTutFees').value;
   }
  if($1('upTutFees')!=null && $1('upTutFees').value==$1('max').value){
	  upFees=$1('upTutFees').value;
   }
  
  if(trim($1('min').value)!="" && $1('min').value!=splitTut[0]){
	  lwFees=$1('min').value;
	 
   }
  if(trim($1('max').value)!="" &&  $1('max').value!=splitTut[splitTut.length-1]){
	  upFees=$1('max').value;
   }
  }
  
  
  
 if(upFees!=null && lwFees==null){
	 if(upFees!='0'){
	 queryStringUrl =queryStringUrl+"&uptutfees="+upFees;
	 }
 }else  if(upFees==null && lwFees!=null){
	 queryStringUrl =queryStringUrl+"&lwtutfees="+encodeURIComponent(lwFees);
 }else if(upFees!=null && lwFees!=null){
	 if(upFees==lwFees){
		 queryStringUrl =queryStringUrl+"&uptutfees="+upFees; 
	 }else{
	 queryStringUrl =queryStringUrl+"&lwtutfees="+lwFees+"&uptutfees="+upFees;
	 }
 } 
 return queryStringUrl;
} 
 
function getContryIds(queryStringUrl,removeValue){
	 
	  var cntryIds="";
	  var cntryFlag="false";
	  var countyIds="";
	  var cuntyFlag="false";
	  
	  var filterCntrds="";
	  var duplicateFlag="N";
	 
	   //For country id -- Start
		if($1("cntryIds")!=null && $1("cntryIds").value!="-1"){
			if($1("cntryIds").value!=removeValue){
			cntryIds=$1("cntryIds").value;
			filterCntrds=filterCntrds+$1("cntryIds").value;
			cntryFlag="true";
			}
		 }
		//For country id-- End
		
		 //For county id -- Start
		if($1("countyIds")!=null && $1("countyIds").value!="-1"){
		  if($1("countyIds").value!=removeValue){
			 countyIds=$1("countyIds").value;
			 filterCntrds=filterCntrds+"-"+$1("countyIds").value;
			 cuntyFlag="true";
			 
			}
		 }
		//For county id-- End
		
		 //For country id -- Start
		if($1("cntryIds1")!=null && $1("cntryIds1").value!="-1"){
			if($1("cntryIds1").value!=removeValue){
			if(cntryFlag=="true"){
				cntryIds=cntryIds+","+$1("cntryIds1").value;
				filterCntrds=filterCntrds+","+$1("cntryIds1").value;
				}else{
					cntryIds=$1("cntryIds1").value;
					filterCntrds=filterCntrds+$1("cntryIds1").value;
				}
			cntryFlag='true';
			}
		 }
		//For country id-- End
		
		 //For country id -- Start
	
		if($1("countyIds1")!=null && $1("countyIds1").value!="-1"){
			if($1("countyIds1").value!=removeValue){
			if(cuntyFlag=="true"){
				countyIds=countyIds+","+$1("countyIds1").value;
				}else{
					countyIds=$1("countyIds1").value;
				}
			filterCntrds=filterCntrds+"-"+$1("countyIds1").value;
			cuntyFlag="true";
			}
		 }
		//For country id-- End
		
		 //For country id -- Start
		if($1("cntryIds2")!=null && $1("cntryIds2").value!="-1"){
			if($1("cntryIds2").value!=removeValue){	
			if(cntryFlag=="true"){
			   cntryIds=cntryIds+","+$1("cntryIds2").value;
			   filterCntrds=filterCntrds+","+$1("cntryIds2").value;
			}else{
				cntryIds=$1("cntryIds2").value;
				filterCntrds=filterCntrds+$1("cntryIds2").value;
			}
		   }
		 }
		//For country id-- End
		
		
		 //For country id -- Start
		if($1("countyIds2")!=null && $1("countyIds2").value!="-1"){
			if($1("countyIds2").value!=removeValue){	
			if(cuntyFlag=="true"){
				countyIds=countyIds+","+$1("countyIds2").value;
				}else{
					countyIds=$1("countyIds2").value;
				}
			filterCntrds=filterCntrds+"-"+$1("countyIds2").value;
			}
		 }
	 	
		
		//For country id-- End	
	if(removeValue!=undefined && removeValue.indexOf("-")==-1){
		var res=removeCntryValues(removeValue);
		if(res.indexOf("$$$$")!=-1){
			 var rest=res.split("$$$$");
			 cntryIds=rest[0];
			 countyIds=rest[1]
			 filterCntrds=rest[2];
		}else if(res.indexOf("&&&&")!=-1){
			 var rest=res.split("&&&&");
			 cntryIds=rest[0];
			 filterCntrds=rest[1];
		}else{	
			cntryIds="";
			filterCntrds="";
		}
		 var result=removeDuplicateCountries(cntryIds,filterCntrds,removeValue);
		 if(result.indexOf("$$$$")!=-1){
			 var res=result.split("$$$$");
			 cntryIds=res[0];
			 filterCntrds=res[1];
		 }
	}	
		
	if(cntryIds!=""){
		cntryIds=removeQama(cntryIds);
		if(queryStringUrl.indexOf("countryIds")==-1){
			queryStringUrl=queryStringUrl+"&countryIds="+cntryIds;	
		}
	}	
	
	if(countyIds!=""){
		if(queryStringUrl.indexOf("regionIds")==-1){
		 queryStringUrl=queryStringUrl+"&regionIds="+countyIds;
		}
	}
	
	if(filterCntrds!=""){
	  if(filterCntrds.indexOf("-")!=-1){	
		if(filterCntrds.indexOf(",")!=-1){
		 var arr = filterCntrds.split(",");
		 var sorted_arr = arr.sort(); // You can define the comparing function here. 
		                             // JS by default uses a crappy string compare.
		 for (var i = 0; i < arr.length - 1; i++) {
		    if (sorted_arr[i + 1] == sorted_arr[i]) {
		        duplicateFlag="Y";
		    }
		  }
		}
	   }else if(filterCntrds.indexOf(",")!=-1){
		   var arr = filterCntrds.split(",");
		   var sorted_arr = arr.sort(); // You can define the comparing function here. 
			                             // JS by default uses a crappy string compare. 
		   for (var i = 0; i < arr.length - 1; i++) {
			    if (sorted_arr[i + 1] == sorted_arr[i]) {
			        //duplicateFlag="Y";
			    }
			  }
	   }
	  
		if(queryStringUrl.indexOf("filterCntrds")==-1){
		 queryStringUrl=queryStringUrl+"&filterCntrds="+filterCntrds;
		}

	}
	if(duplicateFlag=='Y'){
		queryStringUrl="Duplicate_Regions";
	}

	
	return queryStringUrl;	
 }

function showhideQualErrorMsg(errMsgFlag){
	var errMsg=errMsgFlag;
	if($1("userQualId")!=null && $1('userQualId').value!="-1"){
		if($1("parentSlevelId")!=null && $1('parentSlevelId').value!="-1"){
	     if($1('userQualId').value.indexOf(":1")!=-1 && $1("parentSlevelId").value=="3"){
	    	 errMsg="Y";
	    	 $1("displayErrid").className=$1("displayErrid").className+" er_red";
	    	 $("#mobileid").show();
	    	 $(".srpshw").html(showMinus);
	    	 $("#updatefltr").show();
	    	 $("#bttnId").hide();
	    	 var width = $(this).width();
	    	 if (width<768) {
	    		 alert($("#qualMsgId").text());
	    	 }else{
	    	 $1("qualErrmsg").style.display="block";
	    	 }
	    	 setTimeout('replaceSkyBanner()',500);
		 }
		}
	}
  	//for hiding the error message
	if(errMsg=="N"){
	if($1("qualErrmsg") && $1('qualErrmsg').style.display=="block"){
       	  $1('qualErrmsg').style.display="none";
       	if($1("displayErrid")){
			 $1('displayErrid').className="fd_st";
		 }
        }
	 }	
	return errMsg;	
}
 
var allowHashToUpdateApp = true; 
var backbuttonflag=false;
var showMinus = "<a class='srpshw' href='javascript:void(0);' onclick=\"openclosesearchDiv();setBannerPostion('h');\"><em class='fa fa-minus'></em></a>";
var showPlus = "<a class='srpshw' href='javascript:void(0);' onclick=\"openclosesearchDiv();setBannerPostion('s');\"><em class='fa fa-plus'></em></a>";
function loadRefineResult(refineType,refineValue,removeValue){
	/*Prakash Sep 8th 2015 Bug- 32206*/
	if(refineValue == "COLLEGE" && $$D("hideNotification")){
	  $$D("notifyPod").style.display = "none";
	}
	/*Prakash Sep 8th 2015 Bug- 32206*/
	allowHashToUpdateApp = false;	
	backbuttonflag=true;
	var dispFlag="N";
	var errMsg="N";	
	var affName = $$D("affiliateName").value;
	var refineUrl= affName + '/searchajax.html?search=coursesearch';
	
	if(refineValue=="Next" || refineValue=="Update"){
		if($1('nationId')!=null && $1('nationId').value=="-1"){
			errMsg="Y";	
			 alert($1('msg4').value);
		}else if($1('nationcntryid')!=null && $1('nationcntryid').value=="-1"){
			errMsg="Y";	
			 alert($1('msg5').value);
		}
		// showing the errror message if seleceted pree degree and post graduate
		errMsg=showhideQualErrorMsg(errMsg);
		
		if($1('userGradeId')!=null && $1('userGradeId').value!="-1"){
			if($1('userGradeScrId')!=null){
			 if($1('userGradeScrId').value=="-1"){
				 errMsg="Y";	
				 checkGrdValidation($1('msg3').value);
			 }	
			}else if($1('gradeScoreid')!=null){
			  if(trim($1('gradeScoreid').value)==""){
					   errMsg="Y";	
					   checkGrdValidation($1('msg3').value);
			   }else if($1('gradeScoreid').value==$1('deftextid').value){
				   errMsg="Y";	
				   checkGrdValidation($1('msg3').value);
			   }else if(isNaN($1('gradeScoreid').value.replace("%",''))){
				   errMsg="Y";	
				   checkGrdValidation($1("validateMsg").value);
			   }else{ 
				   if(!((parseFloat($1('gradeScoreid').value)>=parseFloat($1('minval').value) && parseFloat($1('gradeScoreid').value)<=parseFloat($1('maxval').value)) || (parseFloat($1('gradeScoreid').value)<=parseFloat($1('minval').value) && parseFloat($1('gradeScoreid').value)>=parseFloat($1('maxval').value)))){
					   errMsg="Y";	
					   checkGrdValidation($1('rangeMsgid').value);
				      }
			   }
			}
		}
		
		
		
	}
	
	 if($1('refinesearch').style.display=='block'){   
		 dispFlag="Y";
	 }
	if(errMsg=="N"){	
	var formurl; 
	if(refineType=='CLEARALL'){
		if($1('hidkeywordid')!=null){
			formurl="&keyword="+encodeURIComponent($1("hidkeywordid").value);	
		}else{
			formurl="&catCode="+$1('urlcatId').value+"&urlcatId="+$1('urlcatId').value;		
		}
		if($1("clearallflag")){
			var natId = "", hidNatId = "";
			if($1('natinalityid')){
				natId = $1('natinalityid').value;
			}
			if($1('hidnationCntryCode')){
				hidNatId = $1('hidnationCntryCode').value;
			}
			formurl=formurl+"&nationCode="+natId+"&nationCntryCode="+hidNatId;
		}
	}else{
		formurl=formRefineUrl(refineType,refineValue,removeValue); 	
	 }
	 if($1("hidcollegeId")==null){
	  if(formurl.indexOf("regionIds")==-1 && formurl.indexOf("countryIds")!=-1){
		 formurl=finduplicateCountries(formurl);
     	}
	 }
	
	if(formurl=="Duplicate_Regions"){
		alert("You've already selected the country/region. Choose another country/region");
	}else{
	  if(refineValue=="Next" || refineValue=="Update"){
		  trackEventStats(refineValue);
		}
	window.location.hash="#search"+formurl; // for appending the hashUrl
	if(refineType=="sortBy"){
	$1('ajax_sr_loading_id').style.display = "block"; 
	$1('ajax_sr_light_id').style.display = "block";
	}else{
		$1('ajax_sr_loading_img').style.display = "block"; 
		$1('ajax_sr_light').style.display = "block";
	}
	var ajaxObj=new sack();
	ajaxObj.requestFile=refineUrl+formurl;
	ajaxObj.onCompletion=function(){loadAjaxSearchResult(ajaxObj.response,dispFlag,'N');};
	ajaxObj.runAJAX();
	 }
	}
 }
 var tier2flag="N";
function loadAjaxSearchResult(response,dispFlag,refineRsltFlag){
	var res=response;
    var noresultflag="N";
    if(res.indexOf("No-Result")!=-1){
    	hitSrchCalBacBut = false;	
 	   var resSplit=res.split("$$$$");
 		 noresultflag="Y";
 		 tier2flag="Y";
 		 if(norestierflag=="Y"){
 			 norestierflag=="Y";
 		 }
 
 		 $1('noresId').innerHTML=resSplit[2];
 		 $1('sr_result').style.display="none";
 		 // Suba 03-Mar-2015 - purpose, ID:4
 		 $1('sr_result').innerHTML = "";
 	     $1('sr_result_id').style.display="block";
 	     $1('noresId').style.display="block";
 	     $1('headid').style.display="none";
 	     $1('zeroheadid').innerHTML=resSplit[1];
 		 $1('zeroheadid').style.display="block";
 		 $(".srmore").hide();//slideUp("fast");  // For Enter your qualification
 		 $1("updatefltr").style.display="none"; // for tell us your self
 		 $1("bttnId").style.display="block";
 		 $(".wht_btn").show();
		 if($1("hidcollegeId")!=null){
 			$1('srchid').style.display='none';
 			$1('editid').style.display='block';
 		  }
 		$1('ajax_sr_loading_img').style.display = "none"; 
 		 $1('ajax_sr_loading').style.display = "none"; 
 		 $1('ajax_sr_light').style.display = "none"; 		
 	 }else{ 
 		 hitSrchCalBacBut = true;
		 tier2flag="N";
		 if($1('sr_result_id')!=null){
			 $1('sr_result_id').style.display="none";
			 $1('noresId').style.display="none"; 
		 }
		 if(refineRsltFlag=="Y"){
			 $("#refineRst").html(response);
			 if($1("hidcollegeId")==null){
			  $1("updatefltr").style.display="none";
			 }
		 }else{
			 $1('intSrRst').innerHTML = response; 
		 }
	 }	
	 
	 if(dispFlag=='Y'){
		$1('srchid').style.display='none';
		$1('editid').style.display='block';
	 }
	 //for filter display none
	 if($1("hidcollegeId")==null){
	 if($1("updatefltr").style.display=="block"){
		 $1("updatefltr").style.display="none";
	  }
	 }
	 
	 if($1("ajax_sr_loading_id").style.display=="block"){
		 $1('ajax_sr_loading_id').style.display = "none"; 
		 $1('ajax_sr_light_id').style.display = "none"; 
	 }else{
		 $1('ajax_sr_loading_img').style.display = "none"; 
		 $1('ajax_sr_loading').style.display = "none"; 
		 $1('ajax_sr_light').style.display = "none";
	 }
	 
	 var skypescrapperres = parseInt((screen.width),10);
	 if(skypescrapperres==1280){
	 $1('srch').className="wrapper scrn";
	 $1('srchsec').className="wrapper scrn";
	 $1('middle_cnt').className="wrapper scrn";
	 $1('sr_result').className="wrapper scrn";
	 if($1('sr_result_id')!=null){
		 $1('sr_result_id').className="wrapper scrn";
	   }
	  }
 
 window.scrollTo(0,0);
 
if(refineRsltFlag=="N"){
	if($1('sliderId')!=null && noresultflag=="N"){
		  eval($1('sliderId').innerHTML);
		 }
	 if($1('scriptid')!=null && noresultflag=="N"){
		 eval($1('scriptid').innerHTML);
	 } 
}

if($1('lazyloadjs')!=null){
	eval($1('lazyloadjs').innerHTML);
} 

 gaTrackingCode(); // for google tracking
 replaceSkyBanner(); //For skyscraper banner
 lazyloadetStarts(); // for lazy loading in ajax 
 addCallbackButton(); // Append bottom call button
 if($1('galoggingsearchUA')!=null){
  eval($1('galoggingsearchUA').innerHTML);
 }
 if($1('galoggingsearch')!=null){
  eval($1('galoggingsearch').innerHTML);
 }
 if(noresultflag!=null && noresultflag!="Y"){
   if($1('statsprpage')!=null){
	   eval($1('statsprpage').innerHTML);
   }
   if($1('gamscript1')!=null){
	 eval($1('gamscript1').innerHTML);
   }
   if($1('gamscript2')!=null){
	 eval($1('gamscript2').innerHTML);
   }
 }     
  if($1('gaId')!=null){
  eval($1('gaId').innerHTML);
  }
  if($1('sortbyscript')!=null){
  eval($1('sortbyscript').innerHTML);
 }
  podDimHover();
  if($1('rhssggestion')!=null){
	  loadrhsShortListPod('sidebar');
  }
  if($1("openformlazy")){
	 eval($('#loginregjs').html());
	 eval($('#enquiryjs').html());
	 eval($('#openformlazy').html());
  }
  startSticky();
}
function gaTrackingCode(){
	 if($1('hidkeywordid')!=null){
	 var keyword=$1('hidkeywordid').value;
	 var countryName=$1('gaCountryNameId')!=null?$1('gaCountryNameId').value:"";
	 ga('send','event', 'Search', keyword, countryName, 1, {'nonInteraction': 1})
	 }
} 

var planeVar;
function hideandShow(){	
	if(planeVar!=null && planeVar!=""){
		 clearInterval(planeVar); 
	} 
	/**** only when qualification is choosen*/
		$(document).ready(function(){
			if(document.getElementById("ifqualavail")!=null){
			if(document.getElementById("ifqualavail").value!=null){
				$(".srmore").slideUp("fast");	
				$(".srpshw").html(showPlus);
			 }
		   }
		}); 
		/**** only when qualification is choosen end here */
		$(document).ready(function(){
		if($(".srmore").css('display') == 'block'){
		$(".srpshw").html(showMinus);
		if(document.getElementById("ifqualavail")!=null){
			if(document.getElementById("ifqualavail").value!=null){
				$(".srpshw").html(showPlus);
		  }
		 }
		if($(window).width()<768){ 
			$(".srpshw").html(showPlus);
		  }
		}
		else{
		$(".srpshw").html(showPlus);
		}
		}); 
		// for tell us show and hide
		$(document).ready(function(){
			$("#fltr_close").click(function(){
			$("#refine .wht_btn").show(500);
			$("#updatefltr").hide(500);
		});
		});
		// for sort by and refine by
		$(document).ready(function(){
			$("#sortpopup").click(function(){
			$(".sr_drop").toggle(500);
		});
		});	  
		$(document).ready(function(){
			$(".tcls").click(function(){
			$("#bulb").hide(500);
		});
		});	  
		$(document).ready(function(){
			$("#refine .wht_btn").click(function(){
			$("#bttnId").hide();		
			$("#updatefltr").show(500);
			$(this).hide();
		});
		});	
		
		/********* Flight loading script ************/
		
		var bgPos = 0;
		planeVar = setInterval(function() {
		    $(".clud").css("background-position", (bgPos-= 10) + "px");
		}, 60);
		
}
var regCnt=0;
function getLookUpData(lookuptype,lookValue,lookupId,flag){
	if($1("grdScrErrmsg")!=null){
		$1("grdScrErrmsg").style.display="none"; // for hide the error message
	}
	if(lookValue!="-1"){
	var lodericon=lookupId+"_icon";
	var affName = $$D("affiliateName").value;
	if(lookuptype =='NAT_QUALS' && lookValue.indexOf(":")!=-1){
		var url= affName + "/ajax/lookupAjax.html?lookup="+lookuptype;	
		var queryUrl;
		if(lookuptype=='NAT_QUALS' && flag=="Y"){
			  queryUrl=formRefineUrl('Lookup_Search','ajax');
		}else{
			queryUrl=formRefineUrl('search','ajax');
		} 
		if(lookuptype=='LOCATION'){
			queryUrl=queryUrl+"&selcCntry="+lookValue;
			if($1('regionIds')!=null){
				queryUrl=queryUrl+"&regnids="+$1('regionIds').value;
			}
		  }
		if($1(lodericon)!=null){
			$1(lodericon).style.display="block";
		}
		if($1('regionIds')!=null){
			if(queryUrl.indexOf("regionIds")==-1){
			queryUrl=queryUrl+"&regionIds="+$1('regionIds').value;
			}
		}
		var ajaxObj=new sack();
		ajaxObj.requestFile=url+queryUrl;
		ajaxObj.onCompletion=function(){loadLookUpResult(ajaxObj.response,lookupId,lookuptype,lodericon,flag);};
		ajaxObj.runAJAX();
	  }else if(lookuptype =='NAT_QUALS' && lookValue.indexOf(":")==-1){
		  //nothing to do..
	  }else if(lookuptype =='STLEVEL' && (lookValue=='16' || lookValue=='15' || lookValue=='18' || lookValue=='17' || lookValue=='19')){
		//nothing to ajax call..
		    $1('locationList_sr7').innerHTML=$1('subqualtxt').value+'<span class="arw"></span>';
		    $('#childSlevelId').html('<option value="-1">'+$1('subqualtxt').value+'</option>');
			$1('List_sr5').className="selBx disable";
			$1('childSlevelId').className="select disable";
			$1('childSlevelId').style.display="none";
		  
	  }else if(lookuptype =='LOCATION' && (lookValue=='168' || lookValue=='189')){
		  if($1('countyIds')!=null && lookupId=='countyIds'){
			    $1('List_sr7').className="selBx disable";
				$1('countyIds').className='select disable';
				$1('countyIds').style.display="none";
				$1('locationList_sr11').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				$('#countyIds').html('<option value="-1">'+$1('regiontxt').value+'</option>');
		  }
		  if($1('countyIds1')!=null && lookupId=='countyIds1'){
				$1('List_sr8').className="selBx disable";
				$1('countyIds1').className='select disable';
				$1('countyIds1').style.display="none";
				$1('locationList_sr13').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				$('#countyIds1').html('<option value="-1">'+$1('regiontxt').value+'</option>');
		  }
		  if($1('countyIds2')!=null && lookupId=='countyIds2'){
				$1('List_sr9').className="selBx disable";
				$1('countyIds2').className='select disable';
				$1('countyIds2').style.display="none";
				$1('locationList_sr15').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				$('#countyIds2').html('<option value="-1">'+$1('regiontxt').value+'</option>');
		  }	
	  }else{
		  if($1(lodericon)!=null){
				$1(lodericon).style.display="block";
			}
		  var affName = $$D("affiliateName").value;
		  var url= affName + "/ajax/lookupAjax.html?lookup="+lookuptype;	
		  var dupFlag="N";
		  var queryUrl;
		  if(flag=='selcData'){
			 queryUrl=formRefineUrl('Lookup_Search','ajax');
		  }else if(lookuptype=='NAT_GRADES' && flag=="Y"){
			  queryUrl=formRefineUrl('Lookup_Search','ajax');
		  }else if(lookuptype=='NAT_GRADE_OPTIONS' && flag=="true"){
			  queryUrl=formRefineUrl('Lookup_Search','ajax');  
		  }else{
			  queryUrl=formRefineUrl('search','ajax');  
		  }
			if(queryUrl=="Duplicate_Regions"){
				dupFlag="Y";
				var iconid=lookupId+"_icon";
				if($1(iconid)!=null){
					$1(iconid).style.display="none";	
				}
			 }
			if(lookuptype=='LOCATION' && dupFlag=="N"){
				queryUrl=queryUrl+"&selcCntry="+lookValue+"&regCnt="+regCnt;
				if($1('regionIds')!=null){
					if(flag=='cntryflag'){
					//nothing to do
					}else{
						if($1('filterCntrds')!=null){
							if(queryUrl.indexOf("regionIds")==-1){
								queryUrl=queryUrl+"&regnids="+$1('regionIds').value+"&filterdIds="+$1('filterCntrds').value+"&regionIds="+$1('regionIds').value;; // For direct url
							}else{
								queryUrl=queryUrl+"&regnids="+$1('regionIds').value+"&filterdIds="+$1('filterCntrds').value;	// for hash url
							}
						}else{
							queryUrl=queryUrl+"&regnids="+$1('regionIds').value;	//For pr Page
						}
					}
				}
			}else{
				if($1('regionIds')!=null){
					if(queryUrl.indexOf("regionIds")==-1){
					queryUrl=queryUrl+"&regionIds="+$1('regionIds').value;
					}
				}
			}
			if($1('tier2Flag')!=null){
				 if($1('tier2Flag').value=='Y'){
					 queryUrl=queryUrl+"&tier2Flag=T2";
				 }
			 }
			if(dupFlag=="Y"){
				alert("You�ve already selected the country/region. Choose another country/region");
			}else{
				var ajaxObj=new sack();
				ajaxObj.requestFile=url+queryUrl;
				ajaxObj.onCompletion=function(){loadLookUpResult(ajaxObj.response,lookupId,lookuptype,lodericon,flag);};
				ajaxObj.runAJAX();	
			}
	   }
  }else{
	  if(lookuptype =='NAT_QUALS'){
		  $1('locationList_sr3').innerHTML=$1('crntQul').value+'<span class="arw"></span>';
		  $("#"+lookupId).html('<option value="-1">'+$1('crntQul').value+'</option>');
		  $1('List_sr3').className="selBx disable";
		  $1(lookupId).className="select disable";
		  $1(lookupId).style.display="none";
		  $1('locationList_sr4').innerHTML=$1('grdText').value+'<span class="arw"></span>';
		  $("#userGradeId").html('<option value="-1">'+$1('grdText').value+'</option>');
		  $1('List_sr4').className="selBx disable";
		  $1('userGradeId').className="select disable";
		  $1('userGradeId').style.display="none";
		  $1('grd_drpdwn').style.display="none";
		  $1('grd_scr').style.display="block";
		  $1('gradeScore').className="c_txt ml0 disable";
		  $1('gradeScore').disabled=true;
		  $1('gradeScore').value=$1('deftext').value;
	  }
	  if(lookuptype =='NAT_GRADES'){
		  $1('locationList_sr4').innerHTML=$1('grdText').value+'<span class="arw"></span>';
		  $("#"+lookupId).html('<option value="-1">'+$1('grdText').value+'</option>');
		  $1('List_sr4').className="selBx disable";
		  $1(lookupId).className="select disable";
		  $1(lookupId).style.display="none";
		  $1('grd_drpdwn').style.display="none";
		  $1('grd_scr').style.display="block";
		  $1('gradeScore').className="c_txt ml0 disable";
		  $1('gradeScore').disabled=true;
		  $1('gradeScore').value=$1('deftext').value;
	   }
	 if(lookuptype=="NAT_GRADE_OPTIONS"){
		 $1('grd_drpdwn').style.display="none";
		 $1('grd_scr').style.display="block";
		}
	  if(lookuptype =='LOCATION'){
		  if(lookupId=="countyIds"){
			  $1('locationList_sr11').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
			  $("#"+lookupId).html('<option value="-1">'+$1('regiontxt').value+'</option>');  
			  $1('List_sr7').className="selBx disable";
			  $1(lookupId).className="select disable";
			  $1(lookupId).style.display="none";
		  }
		  if(lookupId=="countyIds1"){
			  $1('locationList_sr13').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
			  $("#"+lookupId).html('<option value="-1">'+$1('regiontxt').value+'</option>');  
			  $1('List_sr8').className="selBx disable";
			  $1(lookupId).className="select disable";
			  $1(lookupId).style.display="none";
		  }
		  if(lookupId=="countyIds2"){
			  $1('locationList_sr15').innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
			  $("#"+lookupId).html('<option value="-1">'+$1('regiontxt').value+'</option>');  
			  $1('List_sr9').className="selBx disable";
			  $1(lookupId).className="select disable";
			  $1(lookupId).style.display="none";
		  }
	  }
	  if(lookuptype =='STLEVEL'){
		  $1("locationList_sr7").innerHTML=$1('subqualtxt').value+'<span class="arw"></span>';
		  $("#"+lookupId).html('<option value="-1">'+$1('subqualtxt').value+'</option>');
		  $1('List_sr5').className="selBx disable";
		  $1(lookupId).className="select disable";
		  $1(lookupId).style.display="none";
	  }
	  if(lookuptype =='EXAM'){
		  $1("locationList_sr17").innerHTML=$1('engScrTxt').value+'<span class="arw"></span>';
		  $("#"+lookupId).html('<option value="-1">'+$1('engScrTxt').value+'</option>');
		  $1('List_sr6').className="selBx disable";
		  $1(lookupId).className="select disable";
		  $1(lookupId).style.display="none";
	  }
  }
}
function loadLookUpResult(response,lookupId,lookuptype,lodericon,flag){
	

	 $("#"+lookupId).html(response);
	 
	if($1(lodericon)!=null){
		$1(lodericon).style.display="none";
	}
	
	if(lookuptype =='NAT_QUALS'){
		if($1('hidmyqualid')!=null && flag=='Y'){
			var qulid='myqul-'+$1('hidmyqualid').value;
			if($1(qulid)!=null){
			  $1(qulid).selected="selected"; 
			  $1('locationList_sr3').innerHTML=$1(qulid).innerHTML+'<span class="arw"></span>';
		     }
			
			// for Grade type
			var userQual=$1('hidmyqualid').value;
			 $1('List_sr4').className='selBx';
			 $1('userGradeId').style.display='block';
			 if($1("hiduserGradeid")==null){
				 getLookUpData('NAT_GRADES',userQual,'userGradeId');
				 selectedcounty();
			 }else{
				 getLookUpData('NAT_GRADES',userQual,'userGradeId','Y');
			 }
		}
	}
	
	if(lookuptype =='STLEVEL'){
		if($1('hidsubQualid')!=null){
			var qulid='subqul-'+$1('hidsubQualid').value;
			if($1("hidparentslevelId").value==$1("parentSlevelId").value){
				$1(qulid).selected="selected";
				$1('locationList_sr7').innerHTML=$1(qulid).innerHTML+'<span class="arw"></span>';
			}else{
				$1('locationList_sr7').innerHTML=$1('subqualtxt').value+'<span class="arw"></span>';
			}
		
		}else{
			$1("locationList_sr7").innerHTML=$1('subqualtxt').value+'<span class="arw"></span>';	
		}
	}
	
	if(lookuptype =='EXAM'){
		if($1('hidengscord')!=null){
			var qulid='scr-'+$1('hidengscord').value;
			if($1(qulid)!=null){
				$1(qulid).selected="selected"; 
				$1('locationList_sr17').innerHTML=$1(qulid).innerHTML+'<span class="arw"></span>';
			}else{
				$1("locationList_sr17").innerHTML=$1('engScrTxt').value+'<span class="arw"></span>';
				if($1('no-exam')!=null){
					$1('List_sr6').className="selBx disable";
					$1(lookupId).className="select disable";
					$1(lookupId).style.display="none";
				}
			}
		}else{
			$1("locationList_sr17").innerHTML=$1('engScrTxt').value+'<span class="arw"></span>';
			$1("englishScoreId").style.display="block";
			if($1('no-exam')!=null){
				$1('List_sr6').className="selBx disable";
				$1(lookupId).className="select disable";
				$1(lookupId).style.display="none";
			}
		}
		
	}
	
	if(lookuptype =='NAT_GRADES'){
		if($1('hiduserGradeid')!=null && flag=='Y'){
			var qulid='grd-'+$1('hiduserGradeid').value;
			$1('userGradeId').className='select';
			if($1(qulid)!=null){
			 $1(qulid).selected="selected"; 
			 $1('locationList_sr4').innerHTML=$1(qulid).innerHTML+'<span class="arw"></span>';
			 }else if($1('grdid')!=null){
				 $1('locationList_sr4').innerHTML=$1('grdid').innerHTML+'<span class="arw"></span>'; 
			 }else{
				 $1('locationList_sr4').innerHTML=$1('grdText').value+'<span class="arw"></span>';
			 }
			 //selectedcounty();
			getLookUpData('NAT_GRADE_OPTIONS',$1('hiduserGradeid').value,'grd_drpdwn','true');
		}else{
			$1("locationList_sr4").innerHTML=$1('grdText').value+'<span class="arw"></span>';	
			if($1('grdid')!=null){
				$("#locationList_sr4").html($('#grdid').html()+'<span class="arw"></span>');
				$1('List_sr4').className='selBx';
				$1('userGradeId').className='select';
				$1('userGradeId').style.display='block';
				$1('gradeScore').className="c_txt ml0";
				$1('gradeScore').disabled=false; 
				$1('gradeScore').value=$1('deftext').value;
			}else if(response.indexOf("grd-")!=-1){
				 if($1('grdmsgid')!=null){
					  if($1('List_sr4').className.indexOf("err")==-1){
						  $1('List_sr4').className=$1('List_sr4').className+" err";  
					  }
					  if($1('gradeScore').className.indexOf("err")==-1){
						  $1('gradeScore').className=$1('gradeScore').className+" err";  
					  }
				  }else{
					  $1('List_sr4').className="selBx"; 
				  }
				 $1('userGradeId').className='select';
				 $1('userGradeId').style.display='block';
			}else{
				 $1('List_sr4').className='selBx disable';
				 $1('userGradeId').className='select disable';
				 $1('userGradeId').style.display='none';
				 $1('grd_scr').style.display="block";
				 $1('grd_drpdwn').style.display="none";
				 $1('gradeScore').className="c_txt ml0 disable";
				 $1('gradeScore').disabled=true;
				 $1('gradeScore').value=$1('deftext').value;
			}
		}
		
	}
	
	if(lookuptype=="NAT_GRADE_OPTIONS"){
		$1('grd_scr').style.display="none";
		$1('grd_drpdwn').style.display="block";
		if($1("grdScrId")!=null && flag=='true'){
			var grdscrid="grdScr-"+$1("grdScrId").value;
			if($1(grdscrid)!=null){
				$1('locationList_sr18').innerHTML=$1(grdscrid).innerHTML+'<span class="arw"></span>';
				$1(grdscrid).selected="selected"; 	
			}else{
				$1('gradeScoreid').value=$1("grdScrId").value;
				$1('gradeScoreid').className="c_txt ml0";
			}
			selectedcounty();
		}
	}
	
	if(lookuptype =='LOCATION'){
	
		if($1('countyIds')!=null && lookupId=='countyIds'){
			$1('List_sr7').className="selBx";
			$1('countyIds').className='select';
			$1('countyIds').style.display="block";
			var e=$1('countyIds');
			if(e.options[e.selectedIndex]!=null && e.options[e.selectedIndex].value!="-1"){
				$1("locationList_sr11").innerHTML=e.options[e.selectedIndex].text+'<span class="arw"></span>';
				 }else{
					 $1("locationList_sr11").innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				 }
		}
		
		if($1('countyIds1')!=null && lookupId=='countyIds1'){
			$1('List_sr8').className="selBx";
			$1('countyIds1').className='select';
			$1('countyIds1').style.display="block";
			var e=$1('countyIds1');
			if(e.options[e.selectedIndex]!=null && e.options[e.selectedIndex].value!="-1"){
				$1("locationList_sr13").innerHTML=e.options[e.selectedIndex].text+'<span class="arw"></span>';
				 }else{
					 $1("locationList_sr13").innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				 }
		}
		
		if($1('countyIds2')!=null && lookupId=='countyIds2'){
			$1('List_sr9').className="selBx";
			$1('countyIds2').className='select';
			$1('countyIds2').style.display="block";
			var e=$1('countyIds2');
			if(e.options[e.selectedIndex]!=null && e.options[e.selectedIndex].value!="-1"){
				$1("locationList_sr15").innerHTML=e.options[e.selectedIndex].text+'<span class="arw"></span>';
				 }else{
					 $1("locationList_sr15").innerHTML=$1('regiontxt').value+'<span class="arw"></span>';
				 }
		}
	}
}
 
function loadSlider(){	
	var slideValues=$1('tutionId').value.split(",");
	var afflid=$1('hidafflid').value;
	var tutionFees = new Array();
	for(var j=0;j<slideValues.length;j++){
		tutionFees[j]=slideValues[j];
	}
	var minlength=0;
	var maxlength=tutionFees.length-1;
	var flag=false;
	if(afflid=='90409'){
		flag=true;
		tutionFees=tutionFees.reverse();
		if($1('upTutFees')!=null){
			maxlength =(maxlength-tutionFees.indexOf($1('upTutFees').value));
		 }
	}else{
		tutionFees=tutionFees;
		if($1('upTutFees')!=null){
			maxlength = tutionFees.indexOf($1('upTutFees').value);
		 }
	}
	   $('#slider').slider({
		  isRTL: flag, 
		  range: "min",
		  animate : true,
		  min: 0,
		  max: tutionFees.length-1,
		  value:  maxlength,
		  slide: function( event, ui ) {
			  if(afflid=='90409'){
				  var totallength=tutionFees.length-1;
				  $("#max").val(tutionFees[(totallength-ui.value)]);
			  }else{
				   $("#max").val(tutionFees[ui.value]);  
			   }
	          }
	   });
		   if($1('upTutFees')!=null){
			   $("#max").val($1('upTutFees').value);
		   }else{
			   $("#max").val(slideValues[slideValues.length-1]);   
		   }
	   //}
	// Goutam added for slider poing comming middle on 25 nov 2014
		   if($(window).width()>=992){
				loadSliderValue();
			}
}

function appendSelectRow(id1,id2,selectedValue){
	var rowId=$1('rowid').value
	var cntrid="cntryIds"+rowId;
	var cuntrid="countyIds"+rowId;
	var lodericon="countyIds_icon";
	var listid="List_sr"+(parseInt(rowId)+7);
	var spanId1="locationList_sr12";
	var spanId2="locationList_sr13"
	var repMeth1="setValue_AMW(this,'locationList_sr12')";
	var repMeth2="setValue_AMW(this,'locationList_sr13')";
	var repMeth3="getLookUpData('LOCATION',this.value,'"+cuntrid+"','cntryflag')";
	var repMeth4="showDropDown('"+listid+"','"+cuntrid+"')";
	var repId='id="List_sr'+(parseInt(rowId)+7)+'"';
	var subRepId='id="'+cuntrid+'"';
	var replodericon=cuntrid+"_icon";
	$1('rowid').value=(parseInt(rowId)+1);
	if(rowId==2){
		$1('addId').style.display="none";
		spanId1="locationList_sr14";
		spanId2="locationList_sr15";
		repMeth1="setValue_AMW(this,'locationList_sr14')";
		repMeth2="setValue_AMW(this,'locationList_sr15')";
	}
	var meth1="setValue_AMW(this,'locationList_sr10')";
	var meth2="setValue_AMW(this,'locationList_sr11')";
	var meth3="getLookUpData('LOCATION',this.value,'countyIds','cntryflag')";
	var meth4="showDropDown('List_sr7','countyIds')";
	var orgId='id="List_sr7"';
	var suborgId='id="countyIds"';
	var select='selected="selected"';
	var data=$1(id2).innerHTML.replace("cntryIds",cntrid);
	    data=data.replace(suborgId,subRepId);
	    data=data.replace(orgId,repId);
	    data=data.replace("locationList_sr10",spanId1).replace("locationList_sr11",spanId2);
	    data=data.replace(meth1,repMeth1).replace(meth2,repMeth2);
	    data=data.replace(meth3,repMeth3);
	    data=data.replace(meth4,repMeth4);
	    data=data.replace(lodericon,replodericon);
	    data=data.replace(select,"");
	var rowid="row"+rowId;
	var meth="removeRow('"+rowid+"')";
	var selcValue=$1('cntryIds1')!=null?$1('cntryIds1').value:null;
	var cuntselcValue=$1('countyIds1')!=null?$1('countyIds1').value:null;
	var totalData=$1(id1).innerHTML+'<div class="frm_sub" id="'+rowid+'"><label class="lbltxt">'+$1("desId").value+'</label><fieldset class="fd_st">'+data+'</fieldset><span class="hldr add"><a href="javascript:void(0);" onclick="'+meth+'">X '+$1("removeId").value+'</a></span></div>';
	$1(id1).innerHTML=totalData;
	$1(spanId1).innerHTML=$1('msg1').value;
	$1(spanId2).innerHTML=$1('msg2').value;
	$1(cuntrid).innerHTML='<option value="-1">'+$1('msg2').value;+'</option>';
	if(selcValue!=null){
		$1('cntryIds1').value=selcValue;
    	}
	if(cuntselcValue!=null){
		$1('countyIds1').value=cuntselcValue;
    	}
	if(selectedValue!=undefined){
		$1(cntrid).value=selectedValue;
	 }
	$1(cuntrid).style="display:none";
	$1(cuntrid).className="select disable";
	$1(listid).className="selBx disable";
}
function removeRow(id){
	var rowid=$1('rowid').value;
	 id="#"+id;
	$(id).remove();
	$1('rowid').value=(parseInt(rowid)-1);
	if(rowid==2){
		$1('addId').style.display="block";
	}else if(rowid==3){
		$1('addId').style.display="block";
	}
}
function showDropDown(id1,id2){
	
	
	/// onchange need show ielts drop down for study level change -Start 
	if(id2=="childSlevelId"){
		if($1("parentSlevelId").value=="2" || $1("parentSlevelId").value=="3"){
			$1("engsdrpid").className="selBx";
			$1("englishId").style.display="block";
		}else{
			$1("engsdrpid").className="selBx disable";
			$1("locationList_sr16").innerHTML=$1("engsdeftxtid").value;
			$1("englishId").value="-1";
			$1("englishId").style.display="none";
		
		}
		$1("List_sr6").className="selBx disable";
		$1("locationList_sr17").innerHTML=$1("engScrTxt").value;
		$1("englishScoreId").value="-1";
		$1("englishScoreId").style.display="none";
		showhideQualErrorMsg('N');
	}
	// onchange need show ielts drop down for study level change -End  
	
   // For country on change need to show ielts as a default in english drop down --Start
	if($1("rowid").value=="1" && id2=="countyIds"){
		if($1("englishId").className=="select"){
			if($1("cntryIds").value=="210"){
			 $1("locationList_sr16").innerHTML="IELTS";	
			 $1("englishId").value="IELTS";
			 $("#toeflid").html("TOEFL (currently not accepted in the UK)");
			 $1("toeflid").disabled=true;
			 getLookUpData('EXAM','IELTS','englishScoreId');
			 $1("List_sr6").className="selBx";
			 $1("englishScoreId").style.display="block";
			 $1("englishScoreId").className="select";
			}else{
				$1("englishId").value="-1";
				$1("locationList_sr16").innerHTML=$1("engsdeftxtid").value;
				$("#toeflid").html("TOEFL IBT");
				$1("toeflid").disabled=false;
				$1("List_sr6").className="selBx disable"
				$1("locationList_sr17").innerHTML=$1("engScrTxt").value;
				$1("englishScoreId").value="-1";
				$1("englishScoreId").style.display="none";
				$1("englishScoreId").className="select disable";
			}
		}
	}
   // For country on change need to show ielts as a default in english drop down --End	
	
	if($1("grdScrErrmsg")!=null){
		$1("grdScrErrmsg").style.display="none"; // for hide the error message
	}
	if(id2=='userQualId'){
	 if($1('nationcntryid').value.indexOf(":")!=-1){
		 if($1(id1).className=="selBx disable"){
				$1(id1).className="selBx";
			}
			if($1(id2).className=="select disable"){
				$1(id2).className="select";
				$1(id2).style.display="block";
			}
			 $1('locationList_sr3').innerHTML=$1('crntQul').value+'<span class="arw"></span>';
			 $1('locationList_sr4').innerHTML=$1('grdText').value+'<span class="arw"></span>';
			  $("#userGradeId").html('<option value="-1">'+$1('grdText').value+'</option>');
			  $1('List_sr4').className="selBx disable";
			  $1('userGradeId').className="select disable";
			  $1('userGradeId').style.display="none";
			  $1('grd_drpdwn').style.display="none";
			  $1('grd_scr').style.display="block";
			  $1('gradeScore').className="c_txt ml0 disable";
			  $1('gradeScore').disabled=true;
			  $1('gradeScore').value=$1('deftext').value;
    	}else{
			 $1('locationList_sr3').innerHTML=$1('crntQul').value+'<span class="arw"></span>';
			  $("#"+id2).html('<option value="-1">'+$1('crntQul').value+'</option>');
			  $1(id1).className="selBx disable";
			  $1(id2).className="select disable";
			  $1(id2).style.display="none";
			  $1('locationList_sr4').innerHTML=$1('grdText').value+'<span class="arw"></span>';
			  $("#userGradeId").html('<option value="-1">'+$1('grdText').value+'</option>');
			  $1('List_sr4').className="selBx disable";
			  $1('userGradeId').className="select disable";
			  $1('userGradeId').style.display="none";
			  $1('grd_drpdwn').style.display="none";
			  $1('grd_scr').style.display="block";
			  $1('gradeScore').className="c_txt ml0 disable";
			  $1('gradeScore').disabled=true;
			  $1('gradeScore').value=$1('deftext').value;
    	}
	
	}else if(id1=='textbox'){
		$1("List_sr4").className="selBx";
	if($1('userGradeId').value!="-1"){
		if($1(id2).className=="c_txt ml0 disable" || $1(id2).className=="c_txt ml0 disable err"){
			$1(id2).className="c_txt ml0";
			$1(id2).disabled=false;
		  }
	   }else{
		    $1('gradeScore').value=$1('deftext').value;
			$1(id2).className="c_txt ml0 disable";
			$1(id2).disabled=true;
	   }	
	
	 if($1('tier2Flag')!=null){
		 $1('tier2Flag').value='N';
	 }
   }else if(id2=='nationcntryid'){
	   if($1('tier2Flag')!=null){
			 $1('tier2Flag').value='N';
		 }
	   if($1('nationId').value=="-1"){
		   var cntId="cnt"+$1('nationId').value;
		   $1(cntId).selected="selected"; 
		   $1(id1).className="selBx disable";
		   $1(id2).className="select disable";
		   $1(id2).style.display="none";
		   $1('locationList_sr2').innerHTML=$1(cntId).innerHTML+'<span class="arw"></span>';
		   if($1('userQualId').style.display='block'){
			   $1('List_sr3').className="selBx disable";
			   $1('userQualId').className="select disable";
			   $1('userQualId').style.display="none";
			   $('#locationList_sr3').html($1('crntQul').value+'<span class="arw"></span>');
			   $('#userQualId').html('<option value="-1">'+$1('crntQul').value+'</option>');
		     }
		   if($1('userGradeId').className=='select'){
			   $1('List_sr4').className="selBx disable";
			   $1('userGradeId').className='select disable';
			   $1('userGradeId').style.display='none';
			   $("#locationList_sr4").html($1('grdText').value+'<span class="arw"></span>');
			   $('#userGradeId').html('<option value="-1">'+$1('grdText').value+'</option>');
			   $1('grd_drpdwn').style.display="none";
			   $1('grd_scr').style.display="block";
			   $1('gradeScore').value=$1('deftext').value;
			   $1('gradeScore').className='c_txt ml0 disable';
			   $1('gradeScore').disabled=true;
		     }
	   }else{
	   var cntId="cnt"+$1('nationId').value;
	   $1(cntId).selected="selected"; 
	   $1('locationList_sr2').innerHTML= $1(cntId).innerHTML+'<span class="arw"></span>';
	   $1(id1).className="selBx";
	   $1(id2).className="select";
	   $1(id2).style.display="block";
	   
	   if($1('userGradeId').className=='select'){
		   $1('List_sr4').className="selBx disable";
		   $1('userGradeId').className='select disable';
		   $1('userGradeId').style.display='none';
		   $("#locationList_sr4").html($1('grdText').value+'<span class="arw"></span>');
		   $('#userGradeId').html('<option value="-1">'+$1('grdText').value+'</option>');
		   $1('grd_drpdwn').style.display="none";
		   $1('grd_scr').style.display="block";
		   $1('gradeScore').value=$1('deftext').value;
		   $1('gradeScore').className='c_txt ml0 disable';
		   $1('gradeScore').disabled=true;
	     }
	   
	   if($1('nationcntryid').value.indexOf(':')!=-1){
		   $('#locationList_sr3').html($1('crntQul').value+'<span class="arw"></span>');
		    getLookUpData('NAT_QUALS',$1('nationcntryid').value,'userQualId');
		    $1('List_sr3').className="selBx";
			$1('userQualId').className="select";
			$1('userQualId').style.display="block";
	    }else{
	    	$('#locationList_sr3').html($1('crntQul').value+'<span class="arw"></span>');
	    	$('#userQualId').html('<option value="-1">'+$1('crntQul').value+'</option>');
	    	$1('List_sr3').className="selBx disable";
			$1('userQualId').className="select disable";
			$1('userQualId').style.display="none";
	    }
	   }
	   
    }else{
    	
    	if(id2=='userGradeId'){
    		if($1('tier2Flag')!=null){
    			 $1('tier2Flag').value='N';
    		 }
    	   $1("List_sr3").className="selBx";
    	   $1('grd_drpdwn').style.display="none";
   		   $1('grd_scr').style.display="block";	
    	   $1('gradeScore').value=$1('deftext').value;
 		   $1('gradeScore').className='c_txt ml0 disable';
 		   $1('gradeScore').disabled=true;
 		  showhideQualErrorMsg('N'); // for showing and hiding error message for predegree and postgraduate.	
    	}else{

		if($1(id1).className=="selBx disable"){
			$1(id1).className="selBx";
		}
		if($1(id2).className=="select disable"){
			$1(id2).className="select";
			$1(id2).style.display="block";
		}
       }
     }
}

function selectedUrlValues(url){

	// For qual Id --Start 
	if(url.indexOf("parentQualId")==-1){
	if($1("parentSlevelId")!=null && $1("parentSlevelId").value!="-1"){
		url=url+"&parentQualId="+$1("parentSlevelId").value;
	 }
	}
	// For qual Id --End 
	
	// For sub qual Id --Start
	if(url.indexOf("subQualId")==-1){
	if($1("childSlevelId")!=null && $1("childSlevelId").value!="-1"){
		url=url+"&subQualId="+$1("childSlevelId").value;
	 }
	}
	// For sub qual Id --End 
	
	// For Category Id --Start 
	if(url.indexOf("catCode")==-1){
		if($1("subjectId")!=null && $1("subjectId").value!="-1"){
			url=url+"&catCode="+$1("subjectId").value;
	}
	}
	// For Category Id --End 
	
	
	// For smode Id --Start 
	if(url.indexOf("smode")==-1){
	if($1("smode")!=null && $1("smode").value!="-1"){
		url=url+"&smode="+$1("smode").value;
	 } 
	}
	// For smode Id --End
	
	// Fro Applynow
	if(url.indexOf("applyNow")==-1){
	if(document.location.href.indexOf("applynow=Y")!=-1){
	    url=url+"&applyNow=Y";
	  }
	}
	
	url =getContryIds(url);
	
	return url;
	}	
function reLoadHashValues(){
	var affName = $$D("affiliateName").value;	
	var hashUrl= affName + "/searchajax.html?search=coursesearch";	
	/*Prakash Sep 8th 2015 Bug- 32206*/
	if( window.location.hash.indexOf("#search")!=-1 && window.location.hash.indexOf("collegeId=") == -1 && $$D("hideNotification")){
	  $$D("notifyPod").style.display = "none";
	}
	/*Prakash Sep 8th 2015 Bug- 32206*/
	 if(window.location.hash){
	  if(window.location.hash.indexOf("#search")!=-1){
	  isloader=true;
	   if(window.location.hash.indexOf("&")!=-1){
	   var hash = window.location.hash.replace(/^#/,'').split('&'),
	       parsed = {};
	    for(var i =0;i<hash.length; i++ ){
	        if(i!=0){ 
	        var el=hash[i].split('=');
	        //parsed[el[0]] = el[1];
	       if(el[0]!="restRefineFlag"){
	        if(el[0]!="clearAll"){
	        	if(el[0]=="gradeScore"){
	        		hashUrl=hashUrl+"&"+el[0]+"="+encodeURIComponent(el[1]);
	   	          }else{
	   	        	hashUrl=hashUrl+"&"+el[0]+"="+el[1];
	   	          }
	           }
	          }
	         }
	        }
	       }
	     }
	     $1('ajax_sr_loading').style.display = "block"; 
	     $1('ajax_sr_light').style.display = "block";
	      var url=selectedUrlValues(hashUrl);
	      var ajax=new sack();
	      ajax.requestFile=url
	      ajax.onCompletion = function(){loadAjaxSearchResult(ajax.response,'N','N');};	
	      ajax.runAJAX();
	    }
}
// for Back button function
function reloadOnHashChange(){
	var affName = $$D("affiliateName").value;
	var hashUrl= affName + "/searchajax.html?search=coursesearch";
	 if(window.location.hash){
	  if(window.location.hash.indexOf("#search")!=-1){
		var splitSearch=window.location.hash.split("#search"); 
		hashUrl=hashUrl+splitSearch[1];
	   }
      var ajax=new sack();
      ajax.requestFile=hashUrl.replace("&restRefineFlag=Y","");
      ajax.onCompletion = function(){loadAjaxSearchResult(ajax.response,'N','N'); };	
      ajax.runAJAX();
   }
}

var difHashFlag=false;
window.onhashchange = function(e) {
  // Update app only if hash change is allowed per flag.
  if (allowHashToUpdateApp) {
   if(document.location.href.indexOf("#search")!=-1){
   difHashFlag=true;
   $1('ajax_sr_loading').style.display = "block"; 
   $1('ajax_sr_light').style.display = "block";
   reloadOnHashChange();
    }else{
    if(window.location.hash){
    if(difHashFlag){
      location.reload();
     }
    }else{
    	if(backbuttonflag){
    $1('ajax_sr_loading').style.display = "block"; 
    $1('ajax_sr_light').style.display = "block";
    location.reload();
      }
     }
    }
  } else {
    allowHashToUpdateApp = true;
  }
};	



function errorMsg(){
	
 if(tier2flag=="Y"){
	 $1('List_sr3').className="selBx";
	  $1('List_sr4').className="selBx";  
	  $1('gradeScore').className="c_txt ml0"; 
 }else{
	    if($1('qulmsgid')!=null){
		  if($1('List_sr3').className.indexOf("err")==-1){
			  $1('List_sr3').className=$1('List_sr3').className+" err";  
		  }
		  if($1('List_sr4').className.indexOf("err")==-1){
			  $1('List_sr4').className=$1('List_sr4').className+" err";  
		  }
		  if($1('gradeScore').className.indexOf("err")==-1){
			  $1('gradeScore').className=$1('gradeScore').className+" err";  
		  }
	  }	
 }	 
}
function selectedcounty(){
	
	regCnt=0;
	if($1('hidparentslevelId')!=null){
		 var qualId=$1('hidparentslevelId').value;
		 $1('List_sr5').className='selBx';
		 $1('childSlevelId').style.display='block'; 
		 getLookUpData('STLEVEL',qualId,'childSlevelId','selcData');
		}
	if($1('hidenglishType')!=null || $1("englishId").value!="-1"){
		var engType;
		if($1('hidenglishType')){
			 engType=$1('hidenglishType').value;	
		}else{
			engType=$1('englishId').value;
		}
		$1('List_sr6').className='selBx';
		$1('englishScoreId').style.display='block'; 
		 getLookUpData('EXAM',engType,'englishScoreId','selcData');
		}

	if($1('hidcountryIds')!=null){
		var cntryids=$1('hidcountryIds').value;
		if(cntryids.indexOf(",")!=-1){
			var cntrySplit=cntryids.split(",");
			
			$1('rowid').value='1';
			if(cntrySplit.length==3){
				$1('addId').style.display="none";
			 }
			
			for(var i=0;i<cntrySplit.length-1;i++){
				appendSelectRow('extraRow','filedId',cntrySplit[i+1]);
			}
			for(var i=0;i<cntrySplit.length;i++){
				var cntryid=cntrySplit[i];
				var id="countyIds"+i;
				if(i==0){
					id='countyIds';
				}
				getLookUpData('LOCATION',cntryid,id);
				regCnt++;
			}
		}else{
			getLookUpData('LOCATION',cntryids,'countyIds');
		 }
		}
	
	if($1("bulb")!=null){
		var natValue=$1("nationcntryid").value;
		if(natValue!="-1"){
		if(natValue.indexOf(":Y")==-1){
			$1("bulb").style.display="none";
		 }else{
			 errorMsg(); 
		 }
		}	
	 }
	
		var ids=["nationId","nationcntryid","userQualId","userGradeId","subjectId","parentSlevelId","childSlevelId","smode","sduration","cntryIds","countyIds","cntryIds1","countyIds1","cntryIds2","countyIds2","englishId","englishScoreId"];
		for(var i=0;i<ids.length;i++){
			var e = document.getElementById(ids[i]);
			if(e!=null){
			if(e.options[e.selectedIndex]!=null && e.options[e.selectedIndex].value!="-1"){
			 document.getElementById("locationList_sr"+(i+1)).innerHTML=e.options[e.selectedIndex].text+'<span class="arw"></span>';
			 }else if($1('hidkeywordid')!=null && ids[i]=='subjectId'){
				 if(e.options[e.selectedIndex]!=null && e.options[e.selectedIndex].value=="-1"){
				 document.getElementById("locationList_sr"+(i+1)).innerHTML=e.options[e.selectedIndex].text+'<span class="arw"></span>'; 
				 }
			 }
			}
		}
}

function inlineScript(){
	
	if($1('hidnationCntryCode')!=null){
	if($1('nationcntryid').value.indexOf(':')!=-1){
	 $1('List_sr2').className='selBx';
	 $1('nationcntryid').style.display='block';
	 $1('List_sr3').className='selBx';
	 $1('userQualId').style.display='block';
	 getLookUpData('NAT_QUALS',$1('nationcntryid').value,'userQualId','Y');
	 }else{
		 $1('List_sr2').className='selBx';
		 $1('nationcntryid').style.display='block';  
	 }
	}
if($1("hidmyqualid")==null && $1("hiduserGradeid")==null){	
   selectedcounty();
  }
if($(window).width()<768){ 
	$(".srmore").slideUp("fast");
	//$(".srpshw").html("<a class='srpshw' href='javascript:void(0);' onclick='openclosesearchDiv();setBannerPostion()'><em class='fa fa-plus'></em></a>");
  }

if(document.location.href.indexOf("#search")==-1){
	if($1("bulb")){
	$1("bulb").style.display="none";
	}
}

}

function setTierValue(){

	if($1('tier2Flag')!=null){
		 $1('tier2Flag').value='N';
    }
}

function formthePaginationUrl(){
	// For qual Id --Start 
	var queryStringUrl ="";
	if($1("parentSlevelId")!=null && $1("parentSlevelId").value!="-1"){
		queryStringUrl=queryStringUrl+"&parentQualId="+$1("parentSlevelId").value;
	 }

	// For qual Id --End 
	
	// For sub qual Id --Start

	if($1("childSlevelId")!=null && $1("childSlevelId").value!="-1"){
		queryStringUrl=queryStringUrl+"&subQualId="+$1("childSlevelId").value;
	 }

	// For sub qual Id --End 
	
	// For Category Id --Start 
	
	if($1("subjectId")!=null && $1("subjectId").value!="-1"){
		queryStringUrl=queryStringUrl+"&catCode="+$1("subjectId").value;
	 }

	// For Category Id --End 
	
	// For smode Id --Start 

	if($1("smode")!=null && $1("smode").value!="-1"){
		queryStringUrl=queryStringUrl+"&smode="+$1("smode").value;
	 } 

	// For smode Id --End 
	
	// For keyword Id --Start 
	if($1("hidkeywordid")!=null){
		queryStringUrl=queryStringUrl+"&keyword="+encodeURIComponent($1("hidkeywordid").value);
	  }
	// For keyword Id --End 
	//For sortBy -- Start

	if($1("sortbyid")!=null){
		queryStringUrl=queryStringUrl+"&orderBy="+$1("sortbyid").value;
	 }

	//For sort by-- End
	 // get the scholarship search flag --Start
	 if($1('scholarSearch')!=null){
		 queryStringUrl=queryStringUrl+"&scholarSearch="+$1('scholarSearch').value; 
	 }
  // get the scholarship search flag --end

	
	// for country and county form the urls --Start
	queryStringUrl=getContryIds(queryStringUrl);
	// for country and county form the urls --End
	
	return queryStringUrl; 
}

function loadPaginationResult(refineType,refineValue){
	allowHashToUpdateApp = false;
	var jspFlag="Y";	
	var affName = $$D("affiliateName").value;
	var hashUrl= affName + "/searchajax.html?search=coursesearch";
	var formurl="";
	 if(window.location.hash){
	  if(window.location.hash.indexOf("#search")!=-1){
	  isloader=true;
	   if(window.location.hash.indexOf("&")!=-1){
	   var hash = window.location.hash.replace(/^#/,'').split('&'),
	       parsed = {};
	    for(var i =0;i<hash.length; i++ ){
	        if(i!=0){ 
	        var el=hash[i].split('=');
	        //parsed[el[0]] = el[1];
	        if(el[0]!="pageNo"){
	        	if(el[0]!="urlcatId"){
	        	  if(refineType=="sortBy"){	
	        	   if(el[0]!="orderBy"){
	        		   if(el[0]!="restRefineFlag"){
	        	        formurl=formurl+"&"+el[0]+"="+el[1];
	        		   }
	        	     }
	        	  }else{
	        		  formurl=formurl+"&"+el[0]+"="+el[1]; 
	        	  }
	        	}
	           }
	         }
	        }
	       }
	     }
	    }
	 if(formurl=="" && window.location.href.indexOf("/provider-result.html")!=-1){
		 var qureyString = window.location.href.slice(window.location.href.indexOf('?') + 1); 
		 formurl=formurl+"&"+qureyString;
		 if(refineType=="pageNo"){
			 formurl=formurl+"&pageNo="+refineValue;
			 }
		 if(refineType=="sortBy"){
				   formurl=formurl+"&orderBy="+refineValue;
			}
	 }else if(formurl==""){
		 var pagiantionurl=formthePaginationUrl();
		 formurl=formurl+pagiantionurl;
		 if(refineType=="pageNo"){
		 formurl=formurl+"&pageNo="+refineValue;
		 }
		 if(refineType=="sortBy"){
			   formurl=formurl+"&orderBy="+refineValue;
			  }
		 if($1("urlcatId")!=null){
				  formurl=formurl+"&urlcatId="+$1("urlcatId").value;
			 }
	 }else{
	  if(refineType=="pageNo"){
	   formurl=formurl+"&pageNo="+refineValue;
	  }
	  if(refineType=="sortBy"){
		   formurl=formurl+"&orderBy="+refineValue;
		  }
	 if($1("urlcatId")!=null){
			  formurl=formurl+"&urlcatId="+$1("urlcatId").value;
		 }
	  }
	// for Provider Country Id-- Start
	 if($1('provCntryId')!=null){
		 formurl=formurl+"&provCntryId="+$1('provCntryId').value; 
	 }
	// for Provider Country Id-- end
	 // to pass college id in hash tag for provider all courses page - Suba
	 if($1("viewAllCoursesFlag")!=null && $1("viewAllCoursesFlag").value == 'Y'){
		 formurl=formurl+"&collegeId="+$1("hidcollegeId").value;
	  }
	// for refine result flag --Start
	 if(formurl.indexOf("restRefineFlag")==-1 && refineType!="sortBy"){
		 formurl=formurl+"&restRefineFlag=Y"; 
	 } 
	// for refine result flag --end
	// for boostedafflid --Start
	 if(formurl.indexOf("boostedafflid")==-1 && refineType!="sortBy"){
	  if($1("boostedafflid")!=null){
		 formurl=formurl+"&boostedafflid="+$("#boostedafflid").val(); 
	  }
	 }
	 // for sort by refine.
	 if(refineType=="sortBy"){
		 jspFlag="N";
	  }
	 
	// for boostedafflid -- End 
	 hashUrl=hashUrl+formurl;
	 window.location.hash="#search"+formurl; 
	 $1('ajax_sr_loading_id').style.display = "block"; 
	 $1('ajax_sr_light_id').style.display = "block";
     var ajax=new sack();
     ajax.requestFile=hashUrl;
     ajax.onCompletion = function(){loadAjaxSearchResult(ajax.response,'N',jspFlag);};	
     ajax.runAJAX();
}

function tierResult(){
	allowHashToUpdateApp = false;
	var affName = $$D("affiliateName").value;
	var refineUrl = affName + '/searchajax.html?search=coursesearch';
	var formurl="";
	 if(window.location.hash){
	  if(window.location.hash.indexOf("#search")!=-1){
	  isloader=true;
	   if(window.location.hash.indexOf("&")!=-1){
	   var hash = window.location.hash.replace(/^#/,'').split('&'),
	       parsed = {};
	    for(var i =0;i<hash.length; i++ ){
	        if(i!=0){ 
	        var el=hash[i].split('=');
	        if(el[0]=="gradeScore"){
	         formurl=formurl+"&"+el[0]+"="+encodeURIComponent(el[1]);
	          }else{
	        	  formurl=formurl+"&"+el[0]+"="+el[1];
	          }
	         }
	        }
	       }
	     }
	    }
	    formurl=formurl+"&tier2Flag=T2";
	    window.location.hash="#search"+formurl; // for appending the hashUrl
		$1('ajax_sr_loading').style.display = "block"; 
		$1('ajax_sr_light').style.display = "block";
		var ajaxObj=new sack();
		ajaxObj.requestFile=refineUrl+formurl;
		ajaxObj.onCompletion=function(){loadAjaxSearchResult(ajaxObj.response,'N');};
		ajaxObj.runAJAX();
}
function changeClassName(id){
	$1(id).className="c_txt ml0";
	if($1("grdScrErrmsg")!=null){
		$1("grdScrErrmsg").style.display="none"; // for hide the error message
	}
}
function checkGrdValidation(errmsg){
	var width = $(this).width();
	 if($1('bulb')!=null){
		 $1('bulb').style.display="none"; 
	  }
	 if (width<768) {
		 alert(errmsg);
	 }else{
		 $1('screrrMsg').innerHTML=errmsg;
		 if($1('grdScrErrmsg')!=null){
			 $1('grdScrErrmsg').style.display="block"; 
		 }
	 }
	 $1("List_sr3").className="selBx";
	 if($1("userGradeScrId")!=null){
		 $1("List_sr18").className=$1("List_sr18").className+" er_red"; 
	 }
	 if($1("gradeScoreid")!=null){
		 $1("gradeScoreid").className=$1("gradeScoreid").className+" er_red"; 
	 }
}
function removeValidation(id){
	$1(id).className="selBx";
	if($1("grdScrErrmsg")!=null){
		$1("grdScrErrmsg").style.display="none"; // for hide the error message
	}
}

function trackEventStats(refineType){
	if($1('userGradeId')!=null && $1('userGradeId').value!="-1"){
		ga('send','event', 'Ultimate Search', refineType, 'ultimate search with grade', 1, {'nonInteraction': 1});
	  }else if($1('userQualId')!=null && $1('userQualId').value!="-1"){
		  ga('send','event', 'Ultimate Search', refineType, 'ultimate search', 1, {'nonInteraction': 1});  
	  }else{
		  ga('send','event', 'Ultimate Search', refineType, 'normal search', 1,{'nonInteraction': 1});  
	  }
}
function replaceSkyBanner(){
if($1("srtByid")!=null){	
	 var x=$("#srtByid").position() ;
	 $1('rbanner').style.top = (x.top + 15) + "px";	
  } 
if($1("noresId")!=null && $1("noresId").style.display=="block"){
	   var x=$("#noresId").position();
	   $1('rbanner').style.top = x.top + "px";
  }  
}
function setBannerPostion(shvalue){
	setTimeout('replaceSkyBanner()',500);
	if(shvalue == "s"){
		yPoint = 1150;
	} else if(shvalue == "h"){
		yPoint = 650;
	}
}
function showRefinebutton(){
	if($("#bttnId")){
		$("#bttnId").show();
	}
}
function showRefine(id,id1,id2,id3){
	$("#"+id1).hide();
	$("#"+id).show();
	$("#"+id2).hide();
	$("#"+id3).show();
	$("#mobileid").show();
	$(".srmore").show();
	$(".srpshw").html(showMinus);

}
/* Goutam added for when closing background sound is not closing*/
var urlofyoutube="";
function lightBoxYoutube()
{	
    if($1("youtubeVideo").src!=null && $1("youtubeVideo").src!='about:blank') {
	urlofyoutube=$1('youtubeVideo').src;
	}
    else{
	if(urlofyoutube!=""){
		 $1('youtubeVideo').src=urlofyoutube;
	}
    }
	if($(window).width()<768){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
	var url=contextPath+"/jsp/search/searchLightBox.jsp";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	location.href=url;
	}else{
	$1('overlayId').style.display="block";
	$1('shwId').style.display="block";	
	$1('videoclose').style.display="block";
	}
}
function lightBoxYoutubeClose()
{
	 $1('youtubeVideo').src='about:blank';
	 $1('overlayId').style.display="none";
	 $1('shwId').style.display="none";
	 $1('videoclose').style.display="none";
}
// Goutam added for slider poing comming middle on 25 nov 2014
function loadSliderValue(){
	var tot_label=$(".slr_lbl label").length-1;
	var scWidth=$(window).width();
	var num=980/tot_label;
	var inc=0;
	var inc1=0;
	var afflid=$1('hidafflid').value;
	$(".slr_lbl label").each(function()
	{
		if(inc==0)
		{
		 if(afflid=='90409'){
		  $(this).css("right",inc+"%");  
		 }else{
			  $(this).css("left",inc+"%");  
		 }
		}
		else if(inc1==tot_label)
		{
			var txt=$(this).html();
			txt=txt.replace(" ","");			
			$(this).html(txt)
			var pos=0;
			pos=inc-80;
			 if(afflid=='90409'){
				 $(this).css("right",pos+"px");
			 }else{
				  $(this).css("left",pos+"px");  
			 }
		}	
		else
		{
		var pos=0;
		pos=inc-40;
		if(afflid=='90409'){
			 $(this).css("right",pos+"px");
		 }else{
		$(this).css("left",pos+"px");	
		 }
		}	
		inc=inc+num;
		inc1=inc1+1;	
	});
 }
$(window).resize(function(){
	if($(window).width()>=992){
	loadSliderValue();
	}
});

function openclosesearchDiv(){
	if(document.getElementById("mobileid").style.display == 'block'){
		$(".srmore").slideUp("fast");	
		$(".srpshw").html(showPlus);
		if($1("hidcollegeId")!=null){
			$1("editid").style.display="block";
			$("#srchid").hide();
			$("#updatefltr").hide();
			}
	}
	else{
		$(".srmore").slideDown("fast");	 
		$(".srpshw").html(showMinus);
	}
}
function placeHolder(event, searchText, defaulttext) {
    var t = $1(searchText);
    var n = $1(defaulttext).value;
    if (t.value.trim() == "" && event.type == "blur") {
        t.value = n;
    } else if (t.value.trim() == n.trim()) {
        t.value = "";
    }
}
var hitSrchCalBacBut = true;
function addCallbackButton(){
	if($1('sr_bt_cl_Pd') != null && hitSrchCalBacBut) {
		 $('#sr_bt_cl_Pd').children('.cbftst').append("<div class=\"ncn ctr\"><a class='grn_btn' href=\"javaScript:loadRegisterForm('callus','','','Bottom pod');\">Speak to an expert</a> </div>");
		 $('#sr_bt_cl_Pd').children('.cbftst').children(".tsbub").append(" Request a call back today Or call 1800 103 2581 / 1800 103 9634 (toll-free)!");
		 hitSrchCalBacBut = false;
	}	
}
		
	