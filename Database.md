# Database Structure

//user
userIdNum - integer
userNm - String
password - salted string
chips - integer
avatar - String

//game session (JSON?)
deck		- array of card objects
handUser	- hand object {array of cards objects in hand, current score}
handDealer	- hand object {array of cards objects in hand, current score}

---------------------------------------------------------------------------
# Flow of project

*		Sign-in/Sign-up
*-> 	List of tables (single player option, and other open tables)
*-->	Game
*--->	(Leave game) List of tables
*---->	Log-out back to Sign-in/sign-up


-----------------------------------------------------------------------------
# Possible features
	-Multi-player
	-Leader-board
