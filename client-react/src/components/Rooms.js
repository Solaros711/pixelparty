import React from 'react'
import { useHistory } from "react-router-dom"

export default function Rooms (props) {  
let history = useHistory()
console.log(history)


function handleAddRoom () {
  const newRoom = prompt('Enter a room name')
  history.push("/rooms/" + newRoom)
}

  return (
    <div id='rooms'>
      <button onClick={handleAddRoom}>Add a Room</button>
      {/* <label htmlFor='room-select'>Change Room:</label> */}
      <select onChange={(evt) => history.push("/rooms/" + evt.target.value)} name='room' id='room-select' placeholder="Change rooms...">
        <option value=''>--Select a Room--</option>
        {props.rooms.map(room => <option key={room} value={room}>{room}</option>)}
      </select>
    </div>
  )
}

//allows us to use a back button push: ƒ push(path, state)

// it is useful to have forward slash