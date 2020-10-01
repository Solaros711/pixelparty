# weird merge of master and game-functionality branch
* change `time` in sockets/timer-io.js line 15 to extend round time
* I have console.logs in sockets/game-io.js that also serve as comments about what's happening.  I have some in other socket-io files but they're less verbose.
* There are separate namespaces for each io (canvas, timer & game) and I use the rooms feature to only broadcast events to the right clients.
* I'm going to add lobby namespace to separate that from the game.
* Add another line.
