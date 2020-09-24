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
    })
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
            style={{ backgroundColor: color }}
            onClick={() => this.handleClick(color)}
          />
        )}
      </div>
    )
  }
}
