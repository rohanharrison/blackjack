
var hit = function() {
	var http = new XMLHttpRequest();

	http.open("POST", '/game', false);
	http.onreadystatechange = function() {
    var elm = document.createElement('img');
		elm.setAttribute('src', http.responseText);
		elm.setAttribute('width', '120');
		elm.setAttribute('height', '170');
		document.getElementById('playerBoard').appendChild(elm);
  };
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("hit");
};

var naw = function() {
	var http = new XMLHttpRequest();

	http.open("POST", '/game', false);
	http.onreadystatechange = function() {
		console.log(http.responseText);
		var myArr = JSON.parse(http.responseText);
		document.getElementById('x').src = myArr[0].imgSrc;
		for (var i = 2; i < myArr.length; i++) {
			console.log(myArr[i].imgSrc);
			var elm = document.createElement('img');
			elm.setAttribute('src', myArr[i].imgSrc);
			elm.setAttribute('width', '120');
			elm.setAttribute('height', '170');
			document.getElementById('dealerBoard').appendChild(elm);
		}

		console.log('wtf');
  };
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("naw");
};
