/*
 flipper one object relies on jquery
*/
/* initialize flipper one object */
var flipperOne = {
	iDefaultItemsPerPage   : 4,    // items per page defaults to 4
	
	iFadeOffset            : 70,  // fade in horizontal offset	(pixels)
	iFadeInOffsetMillis    : 500,  // time offset for fade in 	
	iFadeTimeOffsetMillis  : 130,  // time betwen item fades
	
	bAutoPageChange        : true, // automatically change pages?
	iPageChangeDelayMillis : 8000, // delay between automatic page change
  
  iPageCount             : 1,    // number of pages (at least 1 even if empty)
  iCurrentPage           : 1,    // current page defaults to 1 (not 0 indexed)
	
  o : function(){return $('#flipper-one');},
  
	/* animates height to given value */
	setHeight : function(iHeight){
    flipperOne.o().animate({
       height: iHeight+"px"			 
      },'easein');
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
			// break after last item on page
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

    // setup images 
    
		
	}
	  
};