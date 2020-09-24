import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'

const socket = io()

class App extends React.Component {
  constructor(props){
    super(props)
  }

  SocketTest(){
    socket.emit('test')
    socket.on('test', () => console.log('success!'))
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.SocketTest}/>
        </header>
      </div>
  );}
}

export default App;
