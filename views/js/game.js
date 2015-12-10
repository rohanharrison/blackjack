
var hit = function() {
	var http = new XMLHttpRequest();
	
	http.open("POST", '/game');
	
	http.send('fun=hit');
}