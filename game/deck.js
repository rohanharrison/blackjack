var c = require('./card.js');

//init deck of cards
var init = (function () {
    
    var suits = ['hearts', 'diamonds', 'clubs', 'spades'],
        cardValues = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'],
        deck = [],
        count = 0;
    
    
    function initCards() {
        for (var i = 0; i < suits.length; i++) {
            for (var x = 0; x < cardValues.length; x++) {
                deck[count] = new c.card(cardValues[x], suits[i], x + 1, cardValues[x] + 'of' + suits[i] + '.jpg');
				
				if (x > 9) {
					deck[count].gameVal = 11;
				}
                               
                count++;
            }
        }			
    }
	
	function shuffle() {
			var m = deck.length, t, i;
			while (m) {
				i = Math.floor(Math.random() * m--);
				
				t = deck[m];
				deck[m] = deck[i];
				deck[i] = t;
			}		
		}
    
    console
    
    
	initCards();
	
	shuffle();
	
	console.log(deck[10].imgSrc);
	
	return deck;
	
});

	module.exports.init = init;