# PIXEL PARTY! dev notes
* change `time` in sockets/timer-io.js line 15 to extend round time
* change `data.numOfPlayers` to something other than `2` in the`handleHostGame` method of client-react/src/AppLobby.js to test games with additional players
* comment in the longer `wordsArray` and comment out the shorter one in models/Game.js or edit one or both as you please if you want to test games with words other than horse
* I have console.logs in sockets/game-io.js that also serve as comments about what's happening.  I have some in other socket-io files but they're less verbose.
* There are separate namespaces for each io (lobby, game, canvas & timer) and I use the rooms feature to only broadcast events to the right clients.
