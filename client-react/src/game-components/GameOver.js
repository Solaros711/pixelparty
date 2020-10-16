import React from 'react'
import Canvas from './Canvas'
import ScoreChart from './ScoreChart'

export default function GameOver(props) {
  const score = props.score
  const scores = []
  const players = []

  for (let name in score) {
    players.push(name)
    scores.push(score[name])
  }

  const winnerIndex = scores.indexOf(Math.max(...scores))
  const winner = players[winnerIndex]



  
    console.log(winner);
    return (
      <div style={{ display: "flex" }}>

        <div className="round-container-1-2">
          <div id='emphatic-text' style={{ fontSize: "25px" }}>Game Over!</div>
          <div id='emphatic-text'>Winner: {winner}</div>
          {/* <div><button onClick={props.onLeaveGame} style={{backgroundColor: "darkgreen"}}>Start Over</button></div> */}
          <div id="play-again-btn">
            {/* <button style={{backgroundColor: "darkgreen"}}>Play Again</button> */}
            <button onClick={props.onLeaveGame}>Lobby</button>
          </div>
        </div>



        <div id="score-gallery">
          <text id='emphatic-text'>Game Scores</text>
          <ScoreChart score={props.score} />

          <div id='gallery' style={{ display: 'flex' }}>
            {props.gameState.rounds.map((round, i) => {
              return (
                <div key={i} style={{ margin: "1%" }}>
                  <div style={{ fontSize: "12px" }}>
                    <div>"{round.word}"</div>
                    <div>by {round.artist}</div>
                  </div>
                  <Canvas displayMode res={2} pixels={round.masterpiece} dynamic />
                </div>
              )
            }
            )}
          </div>
        </div>


      </div>

    )
  
}
