import React from 'react'

class Profile extends React.Component {
    constructor (props) {
      super(props)
      this.state = { formValue: this.props.formValue }
    }
  
    handleSubmit (evt) {
      evt.preventDefault()
    //   this.props.sendMessage(this.state.formValue, this.props.room)
      this.setState({ formValue: '' })
    }
  
    handleChange (event) {
      this.setState({ formValue: event.target.value })
    }
  
    render () {
      return (
        <div>
            <h5>Welcome to your <span style={{color:"firebrick", textTransform:"uppercase"}}>profile page</span>!</h5>
            <div id="wait-container">
                <form id='send-message' onSubmit={this.handleSubmit.bind(this)}>
                    <label for="profile-name">Nickname</label>
                    <input id="profile-name" type='text' placeholder='' value={this.state.formValue} onChange={this.handleChange.bind(this)} />
                    <button id="edit-btn" type='submit'>Edit</button>
                </form>
                <form>
                    <label for="password">Password</label>
                    <input id="password" type="password" value="eXaMpLe"/>
                    <button id="edit-btn" type='submit'>Edit</button>
                </form>
                <div>
                    <label for="high-score">High Score</label>
                    <input id="high-score" type="text" value="100"/>
                </div>
            </div>
        </div>
      )
    }
  }
  
  export default Profile