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

}

module.exports.init = init;
