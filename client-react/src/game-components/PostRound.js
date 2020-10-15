import React from 'react'
import Canvas from './Canvas'
import Timer from './Timer'
import ScoreChart from './ScoreChart'

export default function PostRound (props) {
  const round = props.gameState.rounds[props.gameState.currentRound]
  return (
    <div id="postround-left">

      <div className="round-container-1-2">
        <div id='emphatic-text' style={{fontSize:"20px"}}>Winner: ________!</div>
        <div><Timer timer={props.timer} /></div>
        {/* <div><button onClick={props.onNextRound} style={{ backgroundColor: 'firebrick' }}>Next Round</button></div> */}
      </div>

      <div id="score-gallery">
        <text id='emphatic-text'>Game Scores</text>
        <ScoreChart score={props.score}/>
        
        <div id='gallery'>
              <div>
                <div>"{round.word}" by {round.artist}</div>
                <Canvas displayMode res={4} canvasSocket={props.canvasSocket} pixels={round.masterpiece} />
              </div>
        </div> 
      </div>

    </div>


  )
}
