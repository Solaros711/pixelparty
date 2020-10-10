import React from 'react'
import Timer from './Timer'

export default function PostRound (props) {
  return (
    <div>
      <Timer
        postRound
        isHost={props.isHost}
        onTimesUpPostRound={gameID => props.onTimesUpPostRound(gameID)}
        gameID={props.gameID}
        timerSocket={props.timerSocket}
      />
      <button onClick={props.onNextRound} style={{ backgroundColor: 'firebrick' }}>Test: Next Round</button>
      <div>Score: {JSON.stringify(props.score)}</div>
    </div>
  )
}
