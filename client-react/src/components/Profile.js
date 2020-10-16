import React from 'react'

import Canvas from '../game-components/Canvas'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    const containerRef = React.createRef()
    this.state = {
      gallery: [],
      feature: {
        username: '',
        word: '',
        pixels: []
      },
      containerRef
    }
  }

  componentDidMount () {
    if (this.props.username) {
      this.props.profileSocket.open()
      this.props.profileSocket.emit('user gallery', this.props.username)
      this.props.profileSocket.on('user gallery', gallery => this.setState({ gallery, feature: gallery[0] }))
    }
  }

  setFeature = artwork => {
    this.setState({ feature: artwork }, () => console.log(this.state))
    this.state.containerRef.current.scrollTo(0, 0)
  }

  componentWillUnmount () {
    this.props.profileSocket.close()
  }

  render () {
    return (
      <div id='profile-container-0' ref={this.state.containerRef}>
        <h5>Welcome to the <span id='header-stress'>profile page...</span></h5>

        <div style={{ display: 'flex' }}>
          <div id='profile-container-1'>
            <Canvas displayMode dynamic pixels={this.state.feature.pixels} res={7} />
            <div style={{fontWeight:"bold"}}>"{this.state.feature.word}"</div>
          </div>
          <div id='profile-name'>
            {this.props.username}
          </div>
        </div>

        <div id='profile-stats'>
          <h5>My Stats...</h5>
          <div>
            <label for='total-points'>Total Points</label>
            <input id='high-score' type='text' value='100' />
          </div>
        </div>

        <h5>My Art Gallery...</h5>
        <div id='profile-gallery'>
          {this.state.gallery.map((artwork, i) => {
            return (
              <div key={i} onClick={() => this.setFeature(artwork)} className='gallery-item'>
                <div>"{artwork.word}"</div>
                <Canvas displayMode pixels={artwork.pixels} res={4} />
              </div>
            )
          })}
          <h />
          <div />
        </div>

      </div>
    )
  }
}

export default Profile
