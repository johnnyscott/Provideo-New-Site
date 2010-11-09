/*
 flipper two object relies on jquery
 
 REQUIRES 4 or more items (no duplicate thumbs or content pages)
*/
/* initialize flipper two object */
var flipperTwo = {

	iDefaultItemsPerPage   : 3,    // items per page defaults to 3
	iItemCount: -1, // total number of items	
	iCurrentItem: -1, // the current item index
		   
	iThumbHeight : 102, // height of thumbnail
		
	iFlipTimeMillis : 950, // duration of page flip animation
	iFlipDelayMillis: 4000, // time between auto flips
	
	iFlipCompleted : 0, // counter for paging items so we only execute on last
	
	iZindexTop: 90,  // z index of top content
	iZindexBottom: 89, // z index of the rest of content (not on top)
	
	
	
	/* ooo VIDEO STUFF  ooo */
	iVideoNowPlayingIndex : -1, // index of currently playing video must be kept up to date for anonymous onProgress event handler
	fVideoFlipPercent : 94, // percent of video to play before video stop and flip to next slide
	iVideoAddEventsAttemptIntervalMillis : 405, // time between attempts to attach event handlers to videos
	iVideoWidth  : 544, 
	iVideoHeight : 306,
	sVideoReplaceIdPrefix : 'video-replace-', // prefix for ids of containers replaced with video embed
	sVideoObjectIdPrefix : 'video-', // prefix for ids of video flash objects 
	aVideoSet : {},
	
	aFlashVars : {	
	 'wmode'   : 'transparent',
     'clip_id' : -1,	
	 'server': 'vimeo.com',
	 'show_title': 0,
	 'show_byline': 0,
	 'show_portrait': 0,
	 'fullscreen': 1,
	 'autoplay' :0,
	 'js_api': 1
	},
		
	aParams : {
	 'wmode'   : 'transparent',
	 'swliveconnect':true,
	 'fullscreen': 1,
	 'allowscriptaccess': 'always',
	 'allowfullscreen':true
	},
	
	aAttributes : {
	 id:''	 
	},		
	
	
	/* ooo FUNCTIONS ooo */

	
	/* advances to next slide after video plays specified percentage */
    videoPlayingHandler: function(iElapsedTimeSeconds){
	 if(flipperTwo.iVideoNowPlayingIndex == -1) {return;} else {/**/}
	 var sNowPlayingId = flipperTwo.sVideoObjectIdPrefix + flipperTwo.iVideoNowPlayingIndex;
	 var fPercentagePlayed = iElapsedTimeSeconds/document.getElementById(sNowPlayingId).api_getDuration(); 
    
    // mute on 0-2% have played
    if(fPercentagePlayed*100 < 3){ document.getElementById(sNowPlayingId).api_setVolume(0); } else {}

	 if(fPercentagePlayed*100 >= flipperTwo.fVideoFlipPercent){
	    // pause the video, reset to start, and flip		
		document.getElementById(sNowPlayingId).api_pause();
		flipperTwo.flip();
	 }else{ console.log('no stop yet:' + (fPercentagePlayed*100)); }
	},
	
	
	
	
	/* loops through video set and attempts to add event handlers */
	attachEventsToVideos: function(){
	   
	    var bAllEventsSet = true; // assume all events handlers are set successfully		
		for(var aVid in flipperTwo.aVideoSet){			
			if(flipperTwo.aVideoSet[aVid]['bEventsAdded'] === true){continue;}else{/**/} // skip video if it already has event handlers
			var sVideoObjectId = flipperTwo.sVideoObjectIdPrefix + aVid;
			// see if api_addEventListener is available
			if(typeof document.getElementById(sVideoObjectId).api_addEventListener == 'function'){    
			 document.getElementById(sVideoObjectId).api_addEventListener("onProgress","flipperTwo.videoPlayingHandler");    
			} else { bAllEventsSet = false; } // at least one event wasn't set, so we need to try again after a delay
			
		}
		if(!bAllEventsSet){ // if there was at least one video without event handerls set, we must try again
			setTimeout('flipperTwo.attachEventsToVideos()', flipperTwo.iVideoAddEventsAttemptIntervalMillis);
		} else {/**/}			
	},
	

		
	/* unused stub for video embed complete events */
	onEmbedComplete : function(e){},
   
	/* embeds videos */
	embedVideos: function(){
		// loop through video set and do an embed for each id
		var i = 0;
		for(var aVid in flipperTwo.aVideoSet){
		 // add no events field to video set element
		 flipperTwo.aVideoSet[aVid]['bEventsAdded'] = false;
		 var iVideoId = flipperTwo.aVideoSet[aVid]['video_id'];		 
		 flipperTwo.aFlashVars['clip_id'] = iVideoId;
		 flipperTwo.aAttributes.id = flipperTwo.sVideoObjectIdPrefix + i;
		 // autoplay first item if it has a video embed also first item has on embed complete handler
		 var oOnEmbedComplete = false; 
		 if(1 == $('div.flipper-two div.content div.item:eq('+flipperTwo.iCurrentItem+') div#'+
			flipperTwo.sVideoReplaceIdPrefix + i).length){
			flipperTwo.aFlashVars['autoplay'] = 1;
			flipperTwo.iVideoNowPlayingIndex = i;
		 }else{
			flipperTwo.aFlashVars['autoplay'] = 0;
		 }
			
		 swfobject.embedSWF("http://www.vimeo.com/moogaloop.swf", 
						 flipperTwo.sVideoReplaceIdPrefix + i, 
						 ''+flipperTwo.iVideoWidth, 
						 ''+flipperTwo.iVideoHeight, 
						 "9.0.28", 
						 '',
						 flipperTwo.aFlashVars,
						 flipperTwo.aParams, 
						 flipperTwo.aAttributes,
						 oOnEmbedComplete);
		 
		 i++;
		}
		
		// add events to videos
		setTimeout('flipperTwo.attachEventsToVideos()', flipperTwo.iVideoAddEventsAttemptIntervalMillis);
		
	},
	

	
	/* shifts thumbs down, crossfades between content items */
	flip: function(){
	
	 /* ooo SHIFT THUMBS DOWN ooo */
	 $('div.flipper-two div.pages div.item').animate({"top": '+='+flipperTwo.iThumbHeight+'px'}, 
		flipperTwo.iFlipTimeMillis,
		function(){		
			flipperTwo.iFlipCompleted++; // increment animation complete counter
			
			// shift last item to top of stack when last animation completes
			if(flipperTwo.iFlipCompleted > flipperTwo.iItemCount-1){		
				
				var iIndex = flipperTwo.iCurrentItem -1; if(iIndex < 0){iIndex = flipperTwo.iItemCount -1;}else{} // index of item to move to top of stack
				var iTop = -(flipperTwo.iThumbHeight * (flipperTwo.iItemCount - flipperTwo.iDefaultItemsPerPage));
				$('div.flipper-two div.pages div.item:eq('+iIndex+')').css('top',iTop);
				
				// decrement current item
				flipperTwo.iCurrentItem--; if(flipperTwo.iCurrentItem < 0 ){ flipperTwo.iCurrentItem = flipperTwo.iItemCount -1;}else{}
				// reset animation complete counter
				flipperTwo.iFlipCompleted = 0; 
			}		
		}
	   );
	   
	   /* push all content to back then put next content item to top */
	   var iIndexContent = flipperTwo.iCurrentItem -1; if(iIndexContent< 0 ){ iIndexContent = flipperTwo.iItemCount -1;}else{}
	   $('div.flipper-two div.content div.item').css('z-index',flipperTwo.iZindexBottom);
	   $('div.flipper-two div.content div.item:eq('+iIndexContent+')').css('z-index',flipperTwo.iZindexTop);
	   
	   /* ooo CROSS FADE ooo */
	   $('div.flipper-two div.content div.item:eq('+iIndexContent+')').animate({"opacity": 1.0}, 
		flipperTwo.iFlipTimeMillis,
		function(){});		
	   
	   $('div.flipper-two div.content div.item:eq('+flipperTwo.iCurrentItem+')').animate({"opacity": 0.0}, 
		flipperTwo.iFlipTimeMillis,
		function(){});		
	   
	   
	   /* ooo NEXT FLIP STAGE ooo */
	   setTimeout('flipperTwo.flip()', flipperTwo.iFlipDelayMillis);
	},
			
	
	
	/* initialization function */
	flipperTwo: function(autoFlip,thumbCount,thumbHeight){
	
    if(autoFlip){flipperTwo.iFlipDelayMillis   = autoFlip;}else{}
    if(thumbCount){flipperTwo.iDefaultItemsPerPage   = thumbCount;}else{}
    if(thumbHeight){flipperTwo.iThumbHeight   = thumbHeight;}else{}
     /* ooo STACK THUMBS ooo */	
	 // count items
	 flipperTwo.iItemCount = parseInt($('div.flipper-two div.pages div.item').length);	 	 
	 // position stack	 
	 for(var i = 0; i < flipperTwo.iItemCount; i++){	  
	  var iTop = flipperTwo.iThumbHeight * i;         // calculate top 	

	  // revise top value if we are below last item threshhold
	  if(i > flipperTwo.iDefaultItemsPerPage - 1){ iTop =  -(flipperTwo.iThumbHeight * (flipperTwo.iItemCount - i)); }else{}
        	  
	  $('div.flipper-two div.pages div.item:eq('+i+')').css('top',iTop); // apply top value	 
	 }
	
	 /* ooo SHOW PROPER CONTENT ITEM ooo */	
	 flipperTwo.iCurrentItem = flipperTwo.iDefaultItemsPerPage;
	 $('div.flipper-two div.content div.item').css({opacity:0.0});
	 $('div.flipper-two div.content div.item').css('z-index',flipperTwo.iZindexBottom);
	 $('div.flipper-two div.content div.item:eq('+flipperTwo.iCurrentItem+')').css({opacity:1.0});
     $('div.flipper-two div.content div.item:eq('+flipperTwo.iCurrentItem+')').css('z-index',flipperTwo.iZindexTop);
	 
	 /* ooo Embed Videos ooo */
	 flipperTwo.embedVideos();
	 
	 setTimeout('flipperTwo.flip()',flipperTwo.iFlipDelayMillis);
	}
	
}
  
  
  