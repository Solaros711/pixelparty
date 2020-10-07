class Canvas {
  constructor (gameID, username, word) {
    this.gameID = gameID
    this.username = username
    this.word = word
    this.pixels = Array(50).fill(Array(50))
  }
}

const canvases = []

module.exports = { Canvas, canvases }
