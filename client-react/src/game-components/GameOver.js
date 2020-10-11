import React from 'react'
import Canvas from './Canvas'

export default function GameOver (props) {
  return (
    <div>
      <div>Game Over</div>
      <div>Score: {JSON.stringify(props.score)}</div>
      <div id='gallery' style={{ display: 'flex' }}>
        {props.gameState.rounds.map((round, i) => {
          return (
            <div key={i}>
              <div>"{round.word}", by {round.artist}</div>
              <Canvas displayMode res={5} pixels={round.masterpiece} dynamic />
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}
