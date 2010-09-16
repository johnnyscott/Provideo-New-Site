/*
 flipper one object relies on jquery
*/
/* initialize flipper one object */
Object.prototype.flipperone = function () {	
	var iDefaultItemsPerPage = 4;
	var iFadeOffset = 111; // fade in horizontal offset	
	var iFadeInOffsetMillis = 500; // time offset for fade in 
	var iFadeTimeOffsetMillis = 130; // time betwen item fades
	var iPageChangeDelayMillis = 8000; // delay between page change
	var bAutoPageChange = true;
	
	alert(typeof $(this));
	$(this).children().css('position', 'relative');
	$(this).children().css('left', -iFadeOffset + 'px');	
	$(this).children().css({ 'opacity' : 0.01 });

	
	//var iPageHeight = 0;
	for(var i=0; i<$(this).children().length;i++){	
		// break after last item on page
		if(i > iDefaultItemsPerPage -1){ break; }else{/**/}
		 
		// setup animation
		// setup animation
		$(this).children().css({ 'opacity' :1 });
	 
		// add to height calculation
		//iPageHeight += jQuery(this).find("div:eq("+i+")").height();
		
	}
	
		
}