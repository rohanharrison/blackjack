
var hit = function() {
	var http = new XMLHttpRequest();
	
	http.open("POST", 'localhost:3000/game');
	
	http.send('fun=hit');
}