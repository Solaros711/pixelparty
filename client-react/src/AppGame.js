import React from 'react'
import io from 'socket.io-client'

const socket = io('/game')
const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppGame extends React.Component {
  constructor (props) {
    super(props)
  }
}