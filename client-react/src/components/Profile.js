import React from 'react'

class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // username: props.username
    }
  }

  componentDidMount () {
    console.log(this.state, this.props)
    this.props.profileSocket.emit('user gallery', this.state.username)
    this.props.profileSocket.on('user gallery', gallery => console.log(gallery))
  }

  render () {
    return (
      <div id='profile-container-0'>
        <h5>Welcome to the <span id='header-stress'>profile page...</span></h5>

        <div style={{ display: 'flex' }}>
          <div id='profile-container-1'>
            <h5>Art...</h5>
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

        <div id='profile-gallery'>
          <h5>My Art Gallery...</h5>
          <h />
          <div />
        </div>

      </div>
    )
  }
}

export default Profile
