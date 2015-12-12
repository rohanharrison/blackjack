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
      return state;
};



module.exports.init = init;
module.exports.playerHit = playerHit;
