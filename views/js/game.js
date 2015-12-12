
var hit = function() {
	var http = new XMLHttpRequest();

	http.open("POST", '/game');
	http.onreadystatechange = function() {
    var elm = document.createElement('img');
		elm.setAttribute('src', http.responseText);
		elm.setAttribute('width', '120');
		elm.setAttribute('height', '170');
		document.getElementById('playerBoard').appendChild(elm);
  };
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("hit");
}
