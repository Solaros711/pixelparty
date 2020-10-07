import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd';

// comment
// import './App.css';

class ProfilePicChanger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      ImagesArray: [props.pic1, props.pic2, props.pic3]
    }

  }


  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,

    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render() {

    const imageMapper = this.state.ImagesArray.map((image, index) => {
      return (
        <img src={image}
          onClick={() => this.props.handleImageChange(image)}
          height='48px'
        />
      )
    })
    return (

      <div className='ProfilePicChanger' style={{ alignContent: 'center' }}>
        <Button type="primary" onClick={this.showModal}>
          Change Profile Pic
    </Button>
        <Modal
          title="Profile Pic Changer "
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {imageMapper}
        </Modal>{' '}
      </div>
    );
  }
}
export default ProfilePicChanger;
