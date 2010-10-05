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
	iFlipDelayMillis: 7000, // time between auto flips
	
	iFlipCompleted : 0, // counter for paging items so we only execute on last
	
	iZindexTop: 90,  // z index of top content
	iZindexBottom: 89, // z index of the rest of content (not on top)
	
	/* shifts thumbs down, crossfades between content items */
	flip: function(){
	
	 /* ooo SHIFT THUMBS DOWN ooo */
	 $('div.flipper-two div.pages div.item').animate({"top": '+='+flipperTwo.iThumbHeight+'px'}, 
		flipperTwo.iFlipTimeMillis,
		function(){		
			flipperTwo.iFlipCompleted++; // increment animation complete counter
			
			// shift last item to top of stack when last animation completes
			if(flipperTwo.iFlipCompleted > flipperTwo.iItemCount-1){		
				console.log(flipperTwo.iCurrentItem);
				
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
	   $('div.flipper-two div.pages div.item').css('z-index',flipperTwo.iZindexBottom);
	   $('div.flipper-two div.pages div.item:eq('+iIndexContent+')').css('z-index',flipperTwo.iZindexTop);
	   
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
	flipperTwo: function(){
	
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
	 $('div.flipper-two div.content div.item:eq('+flipperTwo.iCurrentItem+')').css({opacity:1.0});

	 setTimeout('flipperTwo.flip()',flipperTwo.iFlipDelayMillis);
	}
	
}
  
  
  