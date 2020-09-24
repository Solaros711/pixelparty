import React from 'react'
import Palette from './Palette'
import io from 'socket.io-client'
const socket = io()


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
  
  componentDidMount = () => {
    this.setState({
      ctx: document.querySelector('canvas').getContext('2d'),
    }, () => {
      this.drawGrid()
    })
    socket.on('drawing', pixels => {
      if (!this.props.drawer) {
        console.log(pixels)
        this.setState({ pixels }, () => this.drawPixels())
      }
    })
  }

  drawGrid = (res = this.state.res, w = this.state.w, h = this.state.h) => {
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

  handleMouseMove = (evt, res = this.state.res) => {
    const x = Math.floor(evt.nativeEvent.offsetX / res)
    const y = Math.floor(evt.nativeEvent.offsetY / res)
    this.setState({
      pixel: [x, y]
    }, () => {
      if (this.state.drawing) this.handleDrawPixelMoving()
    })
  }

  handlePalette = color => {
    this.setState({ color: color })
  }

  handleDrawPixel = _evt => {
    const pixels = this.state.pixels.slice()
    const x = this.state.pixel[0]
    const y = this.state.pixel[1]
    const column = pixels[x].slice()
    column[y] = this.state.color
    pixels[x] = column
    this.setState({
      pixels
    }, this.drawPixels)
    if (this.props.drawer) {
      socket.emit('drawing', pixels)
    }
  }

  handleDrawPixelMoving = _evt => {
    const pixels = this.state.pixels.slice()
    const x = this.state.pixel[0]
    const y = this.state.pixel[1]
    const column = pixels[x].slice()
    column[y] = this.state.color
    pixels[x] = column
    this.setState({
      pixels
    }, this.drawPixels)
  }

  drawPixels = (pixels = this.state.pixels, res = this.state.res, w = this.state.w, h = this.state.h) => {
    // const pixels = this.state.pixels.slice()
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

  handleDrawingTrue = () => this.setState({ drawing: true })
  handleDrawingFalse = () => this.setState({ drawing: false })

  render () {
    return (
      <div>
        <canvas
          height={this.state.h}
          width={this.state.w}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleDrawPixel}
          onMouseDown={this.handleDrawingTrue}
          onMouseUp={this.handleDrawingFalse}
          // onMouseOver={this.handleDrawPixelMoving}
        />
        <Palette onClick={this.handlePalette} palettes={this.state.palettes} />
      </div>
    )
  }
}
