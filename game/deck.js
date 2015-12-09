var c = require('./card.js');

//init deck of cards
var init = function() {
	
	var suits = ['hearts', 'diamonds', 'clubs', 'spades'],
	cardValues = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'],
	deck = [],
	count = 0;
	
		
	function initCards() {
		for (var i = 0; i < suits.length; i++) {
			for (var x = 0; i < cardValues.length; x++) {
				deck[count] = cardValues[x] + 'of' + suits[i];
				
				
				
				count++;
				//console.log(count);
			}
		}
		
		console.log(count);
		console.log(deck[10]);
			
	}
	
	
	
	
	initCards();
	
	
}

	module.exports.init = init;