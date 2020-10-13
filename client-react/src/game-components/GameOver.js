import React from 'react'
import Canvas from './Canvas'

export default function GameOver (props) {
  return (
      <div style={{display: "flex"}}>

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
                  <div style={{fontSize:"12px"}}>
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
