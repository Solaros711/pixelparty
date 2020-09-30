import React from 'react'
import { useParams } from 'react-router-dom'
import MessageForm from './MessageForm'

function Message (props) {
  return (
    <li className='message-item'>
      <span className='nick'><strong>{props.message.user.username}: </strong></span>
      <span className='text'>{props.message.text}</span>
      <span className='date'>  ({(new Date(props.message.date)).toLocaleString()})</span>
    </li>
  )
}

export default function Chat (props) {
  let { room } = useParams();
  return (
    <div id='chatroom'>
      <h5>Welcome to <span style={{color:"firebrick", textTransform:"uppercase"}}>general</span> chat!</h5>
        <div id="gen-chat-container">
          <ul id='messages'>
            {props.messages.filter(msg => msg.room === room).map((msg, i) => <Message message={msg} key={i} />)}
          </ul>
        </div>
      <MessageForm room={room} sendMessage={props.sendMessage}/>
    </div>
  )
}