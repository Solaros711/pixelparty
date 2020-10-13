import React from 'react'
import Canvas from './Canvas'
import Timer from './Timer'

export default function PostRound (props) {
  const round = props.gameState.rounds[props.gameState.currentRound]
  return (
    <div style={{display: "flex"}}>

      <div className="round-container-1-2">
        <div id='emphatic-text' style={{fontSize:"25px"}}>Winner: ________!</div>
        <div><Timer timer={props.timer} /></div>
        <div><button onClick={props.onNextRound} style={{ backgroundColor: 'firebrick' }}>Next Round</button></div>
      </div>

      <div id="score-gallery">
        <div id="score-box">
          <div id="emphatic-text" style={{marginTop:"10%", fontSize:"25px"}}> Score: {JSON.stringify(props.score)}</div>
        </div>

        <div id='gallery' style={{ display: 'flex' }}>
              <div>
                <div>"{round.word}" by {round.artist}</div>
                <Canvas displayMode res={5} canvasSocket={props.canvasSocket} pixels={round.masterpiece} />
              </div>
        </div> 
      </div>

    </div>


  )
}
