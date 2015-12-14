var deck = require('./deck.js');
var init = function () {
  var theDeck = deck.init();
  var dealer = [],
  player = [];

  for (var i = 0; i < 2; i++) {
    player[i] = theDeck.shift();
    dealer[i] = theDeck.shift();
  }

  return {
            deck: theDeck,
            dealerHand: dealer,
            playerHand: player
         };

};

var playerHit = function (state) {
    state.playerHand.push(state.deck.shift());
    var score = 0;
    console.log(state.playerHand);
    for (var i = 0; i < state.playerHand.length; i++) {
		if (!!state.playerHand[i].gameVal) {
			score += state.playerHand[i].gameVal;
		} else {
			console.log('shit is fucked up, yo.');
		}
    }

    if (score > 21) {
      state.playerHand[state.playerHand.length -1].imgSrc = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQd30MPl6oe94Xav7_ozbe5TjjY2HgjXYSD4ldf4tsmQ42862La_A';
      //window.setTimeout(function(){},1000);
    }
    return state;
};

var dealerHit = function (state) {
    var score = 0;
    for (var i = 0; i < state.dealerHand.length; i++) {
      score += state.dealerHand[i].gameVal;
    }
    console.log(score);

    while (score < 17) {
      state.dealerHand.push(state.deck.shift());
      score += state.dealerHand[state.dealerHand.length - 1].gameVal;
      console.log(score);
    }
};



module.exports.init = init;
module.exports.playerHit = playerHit;
module.exports.dealerHit = dealerHit;
