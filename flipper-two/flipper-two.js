/*
 flipper two object relies on jquery
 
 REQUIRES 3 or more items (no duplicate thumbs or content pages)
*/
/* initialize flipper two object */
var flipperTwo = {
	iDefaultItemsPerPage   : 3    // items per page defaults to 3
	
}
  
  
  
  
var crap = {  
    iPagerImages : {onId: 'on', offId :'off', on:'page-on.gif',off:'page-off.gif',iWidth:8}, // images for pager
	
	iFadeOffset            : 70,  // fade in horizontal offset	(pixels)
	iFadeInOffsetMillis    : 110,  // time offset for fade in 	
	iFadeTimeOffsetMillis  : 130,  // time betwen item fades
	
	bAutoPageChange        : true, // automatically change pages?
	bPauseAutoPageChange   : false, // should automatic change be delayed?
	bInTransition          : false, // defines animation is in progress, prevents auto change
	iPageChangeDelayMillis : 10000, // delay between automatic page change
	iLastPageChangeTime    : -1,    // unix time of last page change
  
  iPageCount             : 1,    // number of pages (at least 1 even if empty)
  iCurrentPage           : -1,    // -1 indicates page startup (not 0 indexed)
	
  
  /* returns reference to flipper, container, and pager  */  
  o : function(){return $('#flipper-one');},
  oc : function() {return $('#flipper-one-container');},
  op : function() {return $('#pager');},
  trace : function(sStr){ $('#debuggers').append(sStr+'<br/>');},
  
  
  
  /* sets the paused state */
  togglePauseAutoPageChange : function(bPaused){ flipperOne.bPauseAutoPageChange = bPaused;},
  
  
  
  /* changes the page to the next in sequence if not paused by hovering mouse */
  autoPageChange : function(){
   var iToPage = flipperOne.iCurrentPage + 1;
   if(iToPage > flipperOne.iPageCount){iToPage = 1;}else{/**/}
   
   // ensure we don't auto page change right after a user page change
   var iDifference = flipperOne.iPageChangeDelayMillis;
   var bWaitedLongEnough = true;
   if(flipperOne.iLastPageChangeTime == -1){/* disregard no page changes yet*/} else {
	iDifference = new Date().getTime() - flipperOne.iLastPageChangeTime;
	bWaitedLongEnough = (iDifference >= 0.90 * flipperOne.iPageChangeDelayMillis);   
   }    
     
   
   if(bWaitedLongEnough && !flipperOne.bPauseAutoPageChange && !flipperOne.bInTransition){flipperOne.toPage(iToPage)}else{/**/}
   setTimeout('flipperOne.autoPageChange()',flipperOne.iPageChangeDelayMillis);
  },
  
  
  
	/* animates height to given value */
	setHeight : function(iHeight){

    flipperOne.oc().animate({
       height: iHeight+"px"			 
      },'easein');
	},

  
  
  /* calculates and returns total image width with margins */
  pageImageWidth : function(){
    // calculate total width of image with margins
   return flipperOne.iPagerImages.iWidth + 
           flipperOne.cssStringToNumber(flipperOne.op().find("a:eq(1)").css('margin-left')) +
           flipperOne.cssStringToNumber(flipperOne.op().find("a:eq(1)").css('margin-right')) +
           flipperOne.cssStringToNumber(flipperOne.op().find("a:eq(1)").css('padding-left')) +
           flipperOne.cssStringToNumber(flipperOne.op().find("a:eq(1)").css('padding-right'));  
  },
  
  
  
  /* returns offset to place pager on image from iCurrentPage => param iPage */
  pageOnOffset : function(iPage){
   var iWidth = flipperOne.pageImageWidth();
   
   if( flipperOne.iCurrentPage == -1){ // initial page set
    return -(iWidth * flipperOne.iPageCount);
   }else{ // all other page sets
    return -1*(flipperOne.pageImageWidth() * (flipperOne.iPageCount-iPage+1));
   }
  },
  
  
  
  /* converts a string to a number if the type is numeric, otherwise returns 0 */
  cssStringToNumber : function(oObject){   
   oValue = parseInt((oObject + '').replace('px',''));
   if(isNaN(oValue)){ return 0;} else {return oValue;}  
  },
  
  
  
  /* counts height in pixels from top of total list to top of sublist starting at 0-indexed iNth item */
  sublistTopOffset: function(iNth){
    var iHeight = 0; 
		for(var i=0; i<flipperOne.o().children().length;i++){	
			// break after first item in sublist
			if(i > iNth-1){ break; }else{/**/}
			// get values
			
      iHeight += flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").height()) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-top')) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-bottom')) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-top')) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-bottom-width')) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-top-width')) +
                 flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-bottom'));
    }
	
                 
                 
                 
    return iHeight;
  },
  
  
  /* returns start index of given page */
  startIndex : function(iPage){ return (iPage-1)*flipperOne.iDefaultItemsPerPage;},
  /* returns end index of given page */
  endIndex : function(iPage){ 
    var iEnd = ((iPage-1)*flipperOne.iDefaultItemsPerPage) + (flipperOne.iDefaultItemsPerPage-1);
    if( iEnd > flipperOne.o().children().length) { iEnd = flipperOne.o().children().length-1; } else {/**/}
    return iEnd;
  },
  
  
  
  /* shifts to page given */
  toPage : function(iPage){   
    // reject page change if in transition
    if(flipperOne.bInTransition){ return false; } else {/**/}	
	
	// set last time initiated page change
	flipperOne.iLastPageChangeTime = new Date().getTime();
	
    // signal we are in transition to prevent overlapping animations
    flipperOne.bInTransition = true;
   
   // move current page indicator dot
   flipperOne.op().find('#'+flipperOne.iPagerImages.onId).css('left',flipperOne.pageOnOffset(iPage));

   // fade out of current page items and fade in of new items
   var iStart = flipperOne.startIndex( flipperOne.iCurrentPage); // get index of 1st item of current page
   var iEnd   = flipperOne.endIndex( flipperOne.iCurrentPage );  // get index of last item of current page
   for(var i = iEnd; i > iStart-1; i--){	
    var iDelayMultiplier = Math.abs(i-iEnd);
     
    // animate out (on last trigger animate in)
    if( i == iStart ) { // LAST ITEM TRIGGERS FADE IN OF NEXT PAGE
      flipperOne.o().find("div:eq("+i+")").delay(
        (iDelayMultiplier * flipperOne.iFadeTimeOffsetMillis)
          ).animate({
             left: "+="+(2*flipperOne.iFadeOffset)+"px",
             opacity: 0.0
          },'easeout', function (){            
            /* shift over item just moved*/         
            $(this).css('left',-flipperOne.iFadeOffset+"px");
                  
			
            /* Do fade in of new page */     
            // shift to top of new page
            var iSublistTop = -1*flipperOne.sublistTopOffset((iPage-1)*flipperOne.iDefaultItemsPerPage);
              flipperOne.o().css('top', iSublistTop + 'px');
            
            // Animate new page fade in
            var iHeight = 0; 
            var iStartNew = flipperOne.startIndex( iPage ); // get index of 1st item of current page
            var iEndNew   = flipperOne.endIndex( iPage );  // get index of last item of current page
            for(var i = iStartNew; i < iEndNew+1; i++){	
               
              iHeight += flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").height()) +
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-top')) +
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-bottom'))+
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-top')) +
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-bottom'))+
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-bottom-width')) +
                flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-top-width'));
              
			  // setup animation, if it's the last item, include a function telling system we are done with transition
			  if(i == iEndNew){
				 flipperOne.o().find("div:eq("+i+")").delay(
					 (Math.abs(i-iStartNew) * flipperOne.iFadeTimeOffsetMillis)
					).animate({
					   left: "+="+flipperOne.iFadeOffset+"px",
					   opacity: 1.0
					  },'easein',/* we are done completely so we can move the page again now*/function(){flipperOne.bInTransition = false;});
			  } else{
				  flipperOne.o().find("div:eq("+i+")").delay(
					 (Math.abs(i-iStartNew) * flipperOne.iFadeTimeOffsetMillis)
					).animate({
					   left: "+="+flipperOne.iFadeOffset+"px",
					   opacity: 1.0
					  },'easein');
              }
            }
            flipperOne.setHeight(iHeight);
            
          });          
    } else {
      flipperOne.o().find("div:eq("+i+")").delay(
           (iDelayMultiplier * flipperOne.iFadeTimeOffsetMillis)
          ).animate({
             left: "+="+(2*flipperOne.iFadeOffset)+"px",
             opacity: 0.0
            },'easeout', function(){
             /* shift over item just moved*/
             $(this).css('left',-flipperOne.iFadeOffset+"px");
            });            
      }
    }
    
    // set current page
    flipperOne.iCurrentPage = iPage;
    
  },
  
  
  
  /* sets up flipper one */
	flipperOne : function(){ 
    // calculate page count
    flipperOne.iPageCount = Math.ceil(flipperOne.o().children().length / flipperOne.iDefaultItemsPerPage);
        
    // initial css hide all
		flipperOne.o().children().css('position', 'relative');
		flipperOne.o().children().css('left', -flipperOne.iFadeOffset + 'px');	
		flipperOne.o().children().css({ 'opacity' : 0.0 });	

		// Animate 1st page fade in
		var iHeight = 0; 
		for(var i=0; i<flipperOne.o().children().length;i++){	
			// break after last item on 1st page
			if(i > flipperOne.iDefaultItemsPerPage -1){ break; }else{/**/}
			 
      iHeight += flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").height()) +
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-top')) +
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('padding-bottom'))+
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-top')) +
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('margin-bottom'))+
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-bottom-width')) +
              flipperOne.cssStringToNumber(flipperOne.o().find("div:eq("+i+")").css('border-top-width'));
			
			// setup animation
			flipperOne.o().find("div:eq("+i+")").delay(
         flipperOne.iFadeInOffsetMillis+(i * flipperOne.iFadeTimeOffsetMillis)
        ).animate({
           left: "+="+flipperOne.iFadeOffset+"px",
           opacity: 1.0
          },'easein');
						 
		}
 
		// set height
		flipperOne.setHeight(iHeight);  
		flipperOne.op().text('');    
		flipperOne.op().css({'padding-left':    '14px'});

		// setup paging images 
		for(var i = 0; i< flipperOne.iPageCount;i++){
		 flipperOne.op().append('<a href="#" onClick="javascript:flipperOne.toPage('+(i+1)+');">'+
		  '<img src="'+flipperOne.iPagerImages.off+'" id="'+flipperOne.iPagerImages.offId+i+'" /></a>');
		}
		flipperOne.op().append('<a href="#" style="cursor:default"><img style="position:relative;left:'+flipperOne.pageOnOffset(1)+'px" '+
		   'src="'+flipperOne.iPagerImages.on+'" id="'+flipperOne.iPagerImages.onId+'" /></a>');
		flipperOne.iCurrentPage = 1;     

		// setup auto paging pause mouse event and timers	 
		if(flipperOne.bAutoPageChange){
			flipperOne.o().find("div").mouseover(function(){flipperOne.togglePauseAutoPageChange(true);});
			flipperOne.o().find("div").mouseout(function(){flipperOne.togglePauseAutoPageChange(false);});
			flipperOne.op().find("img").mouseover(function(){flipperOne.togglePauseAutoPageChange(true);});
			flipperOne.op().find("img").mouseout(function(){flipperOne.togglePauseAutoPageChange(false);});
			setTimeout('flipperOne.autoPageChange()',flipperOne.iPageChangeDelayMillis);		
		} else{/**/}
	}
	 
    
};