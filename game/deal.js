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
      for (var i = 0; i < state.playerHand.length; i++) {
        score += state.playerHand[i].gameVal;
        console.log(score);
      }

      if (score > 21) {
        state.playerHand[state.playerHand.length -1].imgSrc = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQd30MPl6oe94Xav7_ozbe5TjjY2HgjXYSD4ldf4tsmQ42862La_A';
      }
      return state;
};



module.exports.init = init;
module.exports.playerHit = playerHit;
