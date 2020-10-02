import React from 'react'
import letters from './pixelLetters'

export default class Logo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      colors: {
        white: '#f5ffe0',
        black: '#1b1926',
        darkblue: '#262157',
        lightblue: '#323da1',
        red: '#bd2f40',
        yellow: '#f0e143',
        lightgreen: '#6ca84d',
        darkgreen: '#23574d'
      },
      width: 880,
      height: 140,
      pixelSize: 20
      // pixels: [
      //   {color: }
      // ]
    }
  }

  componentDidMount (colors = this.state.colors, size = this.state.pixelSize, width = this.state.width, height = this.state.height) {
    const pixels = []
    // let counter = -2
    for (let x = 0; x < width; x += size) {
      // console.log(++counter)
      pixels.push({ color: colors.black, x, y: 0 })
    }
    for (let y = 0; y < height; y += size) pixels.push({ color: colors.black, x: width - size, y })
    for (let x = width - size; x >= 0; x -= size) pixels.push({ color: colors.black, x, y: height - size })
    for (let y = height - size; y >= 0; y -= size) pixels.push({ color: colors.black, x: 0, y })
    letters.map(letter => pixels.push(...letter.pixels))
    // console.log(pixels)
    this.setState({
      ctx: document.querySelector('#logo').getContext('2d'),
      pixels
    }, () => this.drawLogo())
  }

  drawLogo = (ctx = this.state.ctx, w = this.state.width, h = this.state.height, pixels = this.state.pixels) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = this.state.colors.white
    ctx.fillRect(0, 0, w, h)
    this.drawPixels(0)
    // this.state.pixels.forEach(pixel => {
    //   this.drawPixel(pixel)
    // })
  }

  drawPixels = (i, ctx = this.state.ctx, size = this.state.pixelSize) => {
    const pixel = this.state.pixels[i]
    // console.log({ pixel })
    ctx.fillStyle = pixel.color
    ctx.fillRect(pixel.x + 1, pixel.y + 1, size - 2, size - 2)
    i++
    if (i < this.state.pixels.length)  requestAnimationFrame(() => this.drawPixels(i))
  }

  render () {
    return <canvas id='logo' style={{ borderRadius: 0 }} width={this.state.width} height={this.state.height} />
  }
}
