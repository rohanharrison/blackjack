
var hit = function() {
	var http = new XMLHttpRequest();
	http.open("POST", '/game', false);
	http.onreadystatechange = function() {
		var myArr = JSON.parse(http.responseText);
		var playerHand = myArr.playerHand[myArr.playerHand.length - 1];
		var status = myArr.status;
		console.log(status);
    addImage(playerHand.imgSrc, 'playerBoard');
		console.log(status);
		if (status.localeCompare('bust') == 0) {
			document.getElementById('result').style.display = 'block';
			document.getElementById('result').innerHTML = "BUST! You Lose";
			document.getElementById('controls').style.display = 'none';
		}
  };
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("hit");
};

var naw = function() {
	document.getElementById('controls').style.display = 'none';
  var http = new XMLHttpRequest();
	http.open("POST", '/game', false);
	http.onreadystatechange = function() {
		var myArr = JSON.parse(http.responseText);
		var dealerHand = myArr.dealerHand;
		document.getElementById('x').src = dealerHand[0].imgSrc;
		setTimeout(function() {for (var i = 2; i < myArr.length; i++) {
			console.log(myArr[i]);
			addImage(dealerHand[i].imgSrc, 'dealerBoard');
			}}, 100);
		if (status.localeCompare('lose') == 0) {
			document.getElementById('result').style.display = 'block';
			document.getElementById('result').innerHTML = "WINNER, WINNER Chicken Dinner!";
		} else if (status.localeCompare('win') == 0) {
			document.getElementById('result').style.display = 'block';
			document.getElementById('result').innerHTML = "LOSER! Sucks to suck";
		}
  };
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("naw");
};

var addImage = function (imgSrc, where) {
	var elm = document.createElement('img');
	elm.setAttribute('src', imgSrc);
	elm.setAttribute('width', '120');
	elm.setAttribute('height', '170');
	elm.style.marginLeft = "2px";
	elm.style.marginRight = "1px";
	elm.style.borderRadius = "4px";
	document.getElementById(where).appendChild(elm);
}
