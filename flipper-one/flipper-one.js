/*
 flipper one object relies on jquery
*/
/* initialize flipper one object */
var flipperOne = {
	iDefaultItemsPerPage   : 4,    // items per page defaults to 4
  
  iPagerImages : {onId: 'on', offId :'off', on:'page-on.gif',off:'page-off.gif',iWidth:8}, // images for pager
	
	iFadeOffset            : 70,  // fade in horizontal offset	(pixels)
	iFadeInOffsetMillis    : 500,  // time offset for fade in 	
	iFadeTimeOffsetMillis  : 130,  // time betwen item fades
	
	bAutoPageChange        : true, // automatically change pages?
	iPageChangeDelayMillis : 8000, // delay between automatic page change
  
  iPageCount             : 1,    // number of pages (at least 1 even if empty)
  iCurrentPage           : -1,    // -1 indicates page startup (not 0 indexed)
	
  
  /* returns reference to flipper and pager */
  o : function(){return $('#flipper-one');},
  op : function() {return $('#pager');},
  
  
	/* animates height to given value */
	setHeight : function(iHeight){
    flipperOne.o().animate({
       height: iHeight+"px"			 
      },'easein');
	},

  
  /* calculates and returns total image width with margins */
  pageImageWidth : function(){
    // calculate total width of image with margins
   return flipperOne.iPagerImages.iWidth + 
            parseInt(flipperOne.op().find("img:eq(1)").css('margin-left').replace('px','')) +
            parseInt(flipperOne.op().find("img:eq(1)").css('margin-right').replace('px',''))
            parseInt(flipperOne.op().find("img:eq(1)").css('padding-left').replace('px','')) +
            parseInt(flipperOne.op().find("img:eq(1)").css('padding-right').replace('px',''));  
  },
  
  
  /* returns offset to place pager on image from iCurrentPage => param iPage */
  pageOnOffset : function(iPage){
   var iWidth = flipperOne.pageImageWidth();
   
   if( flipperOne.iCurrentPage == -1){ // initial page set
    return -(iWidth * flipperOne.iPageCount);
   }else{ // all other page sets
   }
  },
  
  
  /* shifts to page given */
  toPage : function(iPage){
   alert('to page ' + iPage);
  },
  
  /* sets up flipper one */
	flipperOne : function(){
    // calculate page count
    flipperOne.iPageCount = Math.ceil(flipperOne.o().children().length / flipperOne.iDefaultItemsPerPage);
        
    // initial css hide all
		flipperOne.o().children().css('position', 'relative');
		flipperOne.o().children().css('left', -flipperOne.iFadeOffset + 'px');	
		flipperOne.o().children().css({ 'opacity' : 0.01 });	

		// Animate 1st page fade in
		var iHeight = 0; 
		for(var i=0; i<flipperOne.o().children().length;i++){	
			// break after last item on 1st page
			if(i > flipperOne.iDefaultItemsPerPage -1){ break; }else{/**/}
			 
			iHeight += flipperOne.o().find("div:eq("+i+")").height() +
        parseInt(flipperOne.o().find("div:eq("+i+")").css('padding-top').replace('px','')) +
        parseInt(flipperOne.o().find("div:eq("+i+")").css('padding-bottom').replace('px',''));
			
			// setup animation
			flipperOne.o().find("div:eq("+i+")").delay(
         flipperOne.iFadeInOffsetMillis+(i * flipperOne.iFadeTimeOffsetMillis)
        ).animate({
           left: "+="+flipperOne.iFadeOffset+"px",
           opacity: 1.00
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
    
    
	}
	  
};