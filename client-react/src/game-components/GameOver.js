import React from 'react'
import Canvas from './Canvas'

export default function GameOver (props) {
  return (
    // <div id="results-container-0">
      // <h5>Game Over!</h5>

      // <div style={{display: "flex", marginRight: "1%"}}>
      <div id="results-left-container">

        <div className="round-container-1-2">
          <div id='emphatic-text' style={{fontSize:"25px"}}>Game Over!</div>
          <div id='emphatic-text'>Winner: _________!</div>
          <div id="play-again-btn"><button style={{backgroundColor: "firebrick"}}>Play Again</button></div>
        </div>


        <div id="score-gallery">
          <div id="score-box">
            <div id="emphatic-text" style={{marginTop:"10%", fontSize:"25px"}}> Score: {JSON.stringify(props.score)}</div>
          </div>
      
          <div id='gallery' style={{ display: 'flex' }}>
            {props.gameState.rounds.map((round, i) => {
              return (
                <div key={i} style={{margin:"1%"}}>
                  <div style={{fontSize:"12px"}}>"{round.word}" by {round.artist}</div>
                  <Canvas displayMode res={2} pixels={round.masterpiece} dynamic />
                </div>
              )
            }
            )}
          </div>
        </div>

      </div>

    // </div>
  )
}
