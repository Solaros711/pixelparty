import React from 'react'
import Palette from './Palette'
// import io from 'socket.io-client'

export default class Canvas extends React.Component {
  constructor (props) {
    super(props)
    const pixels = []
    for (let i = 0; i < 50; i++) {
      pixels.push(new Array(50))
    }
    this.state = {
      res: props.res || 10,
      color: 'black',
      pixels: props.pixels || Array(50).fill(Array(50)),
      pixel: [null, null],
      w: props.res * 50 || 500,
      h: props.res * 50 || 500,
      drawing: false,
      palettes: [
        ['#49F57A', '#F5A331', '#5A19A8'],
        ['#C6CF55', '#699FCF', '#82332F']
      ],
      canvasSocket: this.props.canvasSocket,
      partyMode: this.props.betweenRounds,
      displayMode: props.displayMode || false,
      dynamic: props.dynamic || false
    }
    this.canvasRef = React.createRef()
  }
  
  componentDidMount = () => {

    this.setState({
      ctx: this.canvasRef.current.getContext('2d'),
      gameID: this.props.gameID
    }, () => {
      if (this.state.displayMode) this.state.dynamic ? this.drawPixelsDynamic(0) : this.drawPixels()
      else {
        this.drawGrid()
        this.state.canvasSocket.emit('round start', this.state.gameID)
        this.state.canvasSocket.on('drawing', pixels => {
          this.setState({ pixels }, () => this.drawPixels())
        })
        if (this.props.isArtist) {
          const data = { gameID: this.props.gameID, username: this.props.username, word: this.props.word}
          this.state.canvasSocket.emit('new canvas', data)
        }
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
      if (this.state.drawing) this.handleDrawPixelMoving()
    })
  }

  // this method... is pretty self explanatory
  handlePalette = color => {
    this.setState({ color: color })
  }

  // this Canvas method handles drawing a pixel for a single click
  handleDrawPixel = _evt => {
    if (!this.props.isArtist) return
    try {
      const pixels = this.state.pixels.slice()
      const x = this.state.pixel[0]
      const y = this.state.pixel[1]
      const column = pixels[x].slice()
      column[y] = this.state.color
      pixels[x] = column
      this.setState({
        pixels
      }, () => {
        this.drawPixels()
        this.sendPixelsUp()
      })
      const data = { gameID: this.props.gameID, username: this.props.username, word: this.props.word, pixels}

      this.state.canvasSocket.emit('drawing', data)
    }
    catch (err) {
      console.log(err)
    }
  }

  // this Canvas method handles drawing multiple pixels for a click and drag
  // ask Evan about try... catch here
  handleDrawPixelMoving = _evt => {
    if (!this.props.isArtist) return
    try {
      const pixels = this.state.pixels.slice()
      const x = this.state.pixel[0]
      const y = this.state.pixel[1]
      const column = pixels[x].slice()
      column[y] = this.state.color
      pixels[x] = column
      this.setState({
        pixels
      }, () => {
        this.drawPixels()
        this.sendPixelsUp()
      })
      const data = { gameID: this.props.gameID, username: this.props.username, word: this.props.word, pixels }

      this.state.canvasSocket.emit('drawing', data)
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
    if (!this.state.displayMode) this.drawGrid()
  }

  drawPixelsDynamic = (i, pixels = this.state.pixels, res = this.state.res, w = this.state.w, h = this.state.h) => {
    if (i === 0) this.state.ctx.clearRect(0, 0, w, h)
    let x = i
      for (let y = 0; y <= i; y++) {
        if (y < pixels.length && x < pixels.length) {
          this.state.ctx.fillStyle = pixels[x][y] ? pixels[x][y] : 'black'
          this.state.ctx.fillRect(x * res, y * res, res, res) 
        }
        x--
      }
    requestAnimationFrame(() => this.drawPixelsDynamic(++i))
  }

  sendPixelsUp = () => {
    this.props.onSendPixelsUp(this.state.pixels)
  }

  render () {
    return (
      <div className="canvas-container-1">

        <div className="canvas-container-1-2">
          {this.props.isArtist
          ? <canvas
              ref={this.canvasRef}
              height={this.state.h}
              width={this.state.w}
              onMouseMove={this.handleMouseMove}
              onClick={this.handleDrawPixel}
              onMouseDown={() => this.setState({ drawing: true })}
              onMouseUp={() => this.setState({ drawing: false })}
              onMouseLeave={() => this.setState({ drawing: false })}
            />
          : <canvas
              ref={this.canvasRef}
              height={this.state.h}
              width={this.state.w}
            />
          }
        </div>
        
        {this.state.displayMode
          ? null
          : <div className="canvas-container-1-1">
            <Palette onClick={this.handlePalette} palettes={this.state.palettes} color={this.state.color} />
          </div>
        }

      </div>
    )
  }
}
