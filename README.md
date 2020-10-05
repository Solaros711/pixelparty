# PIXEL PARTY! dev notes
* change `time` in sockets/timer-io.js line 15 to extend round time
* change `data.numOfPlayers` to something other than `2` in the`handleHostGame` method of client-react/src/AppLobby.js to test games with additional players
* comment in the longer `wordsArray` and comment out the shorter one in models/Game.js or edit one or both as you please if you want to test games with words other than horse
* I have console.logs in sockets/game-io.js that also serve as comments about what's happening.  I have some in other socket-io files but they're less verbose.
* There are separate namespaces for each io (lobby, game, canvas & timer) and I use the rooms feature to only broadcast events to the right clients.
## Week 3 Sprints
### Sprint One: Mon-Tues
* Get Users working with gameplay.
  * Get User models into game, instead of placeholder muppets
  * Save user data about games
  * Save user Art after each round
* Gameplay
  * Get Timer Working
  * Get continous Games Working
* Profile
  * Design appearance of Profile Page
  * Should be plug-n-play with the data once that's stored properly in the db
* Game UI
  * Get Timer and Tone.js stuff working
* Design
  * Decide on Logo
  * Get color schemes matchiing
* Playtesting
  * Play a few rounds on deployed site
  * See if we can recreate bugs
  * Get feeling for gameplay choices (round length; etc.)
* Deploy New Master by Class Wednesday
### Sprint Two: Wed-Thu
* ?????????
