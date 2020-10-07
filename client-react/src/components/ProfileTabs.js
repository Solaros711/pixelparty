import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
// comment
class ProfileTabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            TabPane: [props.Tabs],
            name: '',
            email: '',
            message: ''
        };
    };

    showTabs = () => {
        this.setState({
            visible: true,
        });
    };

    showCont = () => {
        this.setState({
            visible: true,
        })
    }

    onNameChange = (event) => {
        this.setState({
            visible: true,
            value: event.target.value
        
            
        })
    }

    render() {
        return (
            <div className='ProfileTabs'>
                <Tabs pullRight defaultActiveKey="1" onChange={this.showTabs} >
                    <TabPane tab="Tab 1" key="1">

                        <form id="contact-form" onSubmit={this.showCont} >
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" value={this.props.name} onChange={this.onNameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" className="form-control" aria-describedby="emailHelp" value={this.props.email} onChange={this.onEmailChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea className="form-control" rows="5" value={this.props.message} onChange={this.onMessageChange} />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>

                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs >
            </div>
        )
    }
}

export default ProfileTabs;

