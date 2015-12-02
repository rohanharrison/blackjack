# Website/Database Structure

//user
userIdNum - Integer
userNm - String
password - Salted String
chips - Integer
avatar - String

//Game Session (JSON?)
Deck		- Array of card objects
HandUser	- Hand object {array of cards objects in hand, current score}
HandDealer	- Hand object {array of cards objects in hand, current score}

# Flow of project

*		Sign-in/Sign-up
*-> 	List of tables (single player option, and other open tables)
*-->	Game
*--->	(Leave game) List of tables
*---->	Log-out back to Sign-in/sign-up


# Possible features
	-Multi-player
	-Leader-board
