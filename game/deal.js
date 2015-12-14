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

var tally = function (hand) {
  var score = 0;
  for (var i = 0; i < hand.length; i++) {
    if (!!hand[i].gameVal) {
      score += hand[i].gameVal;
    } else {
      console.log('stuff is messed up, yo.');
    }
  }
  return score;
}

var playerHit = function (state) {
    state.playerHand.push(state.deck.shift());
    var playerScore = tally(state.playerhand);
    if (playerScore > 21) {
      state.status = 'bust';
    }
    return state;
};

var dealerHit = function (state) {
    var playerScore = tally(state.playerHand);
    var dealerScore = tally(state.dealerHand);

    while (dealerScore < 17) {
      state.dealerHand.push(state.deck.shift());
      dealerScore += state.dealerHand[state.dealerHand.length - 1].gameVal;
    }

    if (dealerScore > 21 || playerScore > dealerScore) {
      state.status = 'win';
    } else if (dealerScore > playerScore) {
      state.status = 'lose';
    }
};



module.exports.init = init;
module.exports.playerHit = playerHit;
module.exports.dealerHit = dealerHit;
