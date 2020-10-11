import React from 'react'
import Canvas from './Canvas'
import Timer from './Timer'

export default function PostRound (props) {
  const round = props.gameState.rounds[props.gameState.currentRound]
  return (
    <div>
      <Timer timer={props.timer} />
      <button onClick={props.onNextRound} style={{ backgroundColor: 'firebrick' }}>Test: Next Round</button>
      <div>"{round.word}", by {round.artist}</div>
      <div>Score: {JSON.stringify(props.score)}</div>
      <Canvas displayMode canvasSocket={props.canvasSocket} pixels={round.masterpiece} />
    </div>
  )
}
