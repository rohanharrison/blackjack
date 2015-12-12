
var hit = function() {
	var http = new XMLHttpRequest();

	http.open("POST", '/game');
	http.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	http.send("hi=please");
}
