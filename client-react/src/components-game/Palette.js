import React from 'react'

export default class Palette extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      palette: []
    }
  }

  componentDidMount () {
    this.setState({
      palette: this.props.palettes[Math.floor(Math.random() * this.props.palettes.length)]
    }, () => this.handleClick(this.state.palette[0]))

  }

  handleClick = color => {
    this.props.onClick(color)
  }

  render () {
    return (
      <div id='palette'>
        {this.state.palette.map((color, i) => <div
            key={i}
            className='swatch'
            style={{
              backgroundColor: color,
              border:
              (this.props.color === color)
                ? '2px solid black'
                : 'none'
            }}
            onClick={() => this.handleClick(color)}
          />
        )}
      </div>
    )
  }
}
