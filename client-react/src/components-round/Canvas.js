import React from 'react'
import Palette from './Palette'
import io from 'socket.io-client'
// const socket = io() // where should this line go? in componentDidMount?

export default class Canvas extends React.Component {
  constructor (props) {
    super(props)
    const pixels = []
    for (let i = 0; i < 50; i++) {
      pixels.push(new Array(50))
    }
    this.state = {
      res: 10,
      color: 'black',
      pixels: Array(50).fill(Array(50)),
      pixel: [null, null],
      w: 500,
      h: 500,
      drawing: false,
      palettes: [
        ['#49F57A', '#F5A331', '#5A19A8'],
        ['#C6CF55', '#699FCF', '#82332F']
      ],
    }
  }
  
  componentDidMount = (socket = this.props.socket) => {
    // make the drawing context part of state
    // ask Evan about using document.querySelector in this case
    this.setState({
      ctx: document.querySelector('canvas').getContext('2d'),
    }, () => {
      this.drawGrid()
    })

    // create a listener for the guesser
    socket.on('drawing', pixels => {
      console.log('no if statement')
      if (!this.props.drawing) {
        console.log(pixels)
        this.setState({ pixels }, () => this.drawPixels())
      }
    })
  }

  // this Canvas method draw the grid (called after pixels are drawn... so it show up on top) so the Artist can see where the pixels are
  drawGrid = (res = this.state.res, w = this.state.w, h = this.state.h) => {
    // ask Evan about setting the state directly, when you need to change a propert of a state object
    this.state.ctx.lineWidth = 0.5
    for (let x = res; x < w; x += res) {
      this.state.ctx.beginPath()
      this.state.ctx.moveTo(x, 0)
      this.state.ctx.lineTo(x, h)
      this.state.ctx.stroke()
    }
    for (let y = res; y < h; y += res) {
      this.state.ctx.beginPath()
      this.state.ctx.moveTo(0, y)
      this.state.ctx.lineTo(w, y)
      this.state.ctx.stroke()
    }
  }

  // this Canvas method takes the mouse location and sets the states pixel array to the mouses coordinates in the 2D pixels array
  handleMouseMove = (evt, res = this.state.res) => {
    const x = Math.floor(evt.nativeEvent.offsetX / res)
    const y = Math.floor(evt.nativeEvent.offsetY / res)
    this.setState({
      pixel: [x, y]
    }, () => {
      console.log(this.state.pixel)
      if (this.state.drawing) this.handleDrawPixelMoving()
    })
  }

  // this method... is pretty self explanatory
  handlePalette = color => {
    this.setState({ color: color })
  }

  // this Canvas method handles drawing a pixel for a single click
  handleDrawPixel = (_evt, socket = this.props.socket) => {
    const pixels = this.state.pixels.slice()
    const x = this.state.pixel[0]
    const y = this.state.pixel[1]
    const column = pixels[x].slice()
    column[y] = this.state.color
    pixels[x] = column
    this.setState({
      pixels
    }, this.drawPixels)
    if (this.props.drawing) {
      console.log('socket')
      socket.emit('drawing', pixels)
    }
  }

  // this Canvas method handles drawing multiple pixels for a click and drag
  // ask Evan about try... catch here
  handleDrawPixelMoving = (_evt, socket = this.props.socket) => {
    try {
      const pixels = this.state.pixels.slice()
      const x = this.state.pixel[0]
      const y = this.state.pixel[1]
      const column = pixels[x].slice()
      column[y] = this.state.color
      pixels[x] = column
      this.setState({
        pixels
      }, this.drawPixels)
      if (this.props.drawing) {
        console.log('socket')
        socket.emit('drawing', pixels)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  // this Canvas method uses this.state.pixels to draw every time the image is altered
  drawPixels = (pixels = this.state.pixels, res = this.state.res, w = this.state.w, h = this.state.h) => {
    this.state.ctx.clearRect(0, 0, w, h)
    for (let x = 0; x < pixels.length; x++) {
      for (let y = 0; y < pixels[x].length; y++) {
        if (pixels[x][y]) {
          this.state.ctx.fillStyle = pixels[x][y]
          this.state.ctx.fillRect(x * res, y * res, res, res)
        }
      }
    }
    this.drawGrid()
  }

  render () {
    return (
      <div>
        {this.props.drawing
        ? <canvas
            height={this.state.h}
            width={this.state.w}
            onMouseMove={this.handleMouseMove}
            onClick={this.handleDrawPixel}
            onMouseDown={() => this.setState({ drawing: true })}
            onMouseUp={() => this.setState({ drawing: false })}
            onMouseLeave={() => this.setState({ drawing: false })}
          />
        : <canvas
            height={this.state.h}
            width={this.state.w}
          />
      }
        <Palette onClick={this.handlePalette} palettes={this.state.palettes} color={this.state.color} />
      </div>
    )
  }
}
