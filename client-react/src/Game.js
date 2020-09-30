import React from 'react'
import { useParams } from 'react-router-dom'
// import MessageForm from './MessageForm'
import MessageFormGame from './MessageFormGame'
import GuessForm from './GuessForm'

function Message (props) {
  return (
    <div className='message-item'>
      <li>
        <span className='nick-game'><strong>{props.message.user.username}: </strong></span>
        <span className='text-game'>{props.message.text}</span>
      </li>
      <li>
        <span className='date-game'>  ({(new Date(props.message.date)).toLocaleString()})</span>
      </li>
    </div>
  )
}

export default function Game (props) {
  let { room } = useParams();
  return (
    <div id='chatroom'>
      <h5>Welcome to the <span style={{color:"firebrick", textTransform:"uppercase"}}>{room}</span> game!</h5>
      <div>
      <div class='container-1'>
        <div class='container-1-1' id="score-container">
          <div class='container-1-1-1' id='game-head'>
            <h5>Scores</h5>
          </div>
        </div>
        <div class='container-1-2' id="draw-container">

        </div>
        <div class='container-1-3' id="chat-container">
          <div class='container-1-3-1' id='game-head'>
            <h5>Chat</h5>
          </div>
          <div class='container-1-3-2'>
            <ul id='messages'>
              {props.messages.filter(msg => msg.room === room).map((msg, i) => <Message message={msg} key={i} />)}
            </ul>
          </div>
        </div>
        </div>

        <div>
        <div class="container-2">
          <div class="container-2-1" id="timer-container">
            <div class='container-2-1-1' id='timer'>
              <h6>00:17</h6>
            </div>
          </div>

          <div class="container-2-2" id="guess-container">
            <div class="container-2-2-1" id="guess">
               <GuessForm />
            </div>
          </div>

          <div class="container-2-3" id="chat-form-container">
             <MessageFormGame room={room} sendMessage={props.sendMessage}/>
          </div>
        </div>
        </div>
      </div>
      {/* <MessageFormGame room={room} sendMessage={props.sendMessage}/> */}
    </div>
  )
}