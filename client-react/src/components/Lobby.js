import React from 'react'
import { useHistory } from "react-router-dom"

export default function Lobby (props) {  
let history = useHistory()
console.log(history)


function handleAddRoom () {
  const newRoom = prompt('Enter a room name')
  history.push("/rooms/" + newRoom)
}

  return (
    <div id='rooms'>
        <h5>Welcome to the <span style={{color:"firebrick", textTransform:"uppercase"}}>lobby</span>!</h5>
        <div id='wait-container'>
        <button onClick={handleAddRoom}>Host a Game</button>
        {/* <label htmlFor='room-select'>Change Room:</label> */}
        <select onChange={(evt) => history.push("/rooms/" + evt.target.value)} name='room' id='room-select' placeholder="Change rooms...">
            <option value=''>--Join a Game--</option>
            {props.rooms.map(room => <option key={room} value={room}>{room}</option>)}
        </select>
        </div>
    </div>
  )
}

//allows us to use a back button push: ƒ push(path, state)

// it is useful to have forward slash