import {Input, Button} from "antd";
import React from "react";
import { Link } from 'react-router-dom';
import './Authentication.css';

interface AuthState {
    value: string;
}

class Authentication extends React.Component<{}, AuthState> {

    constructor(props: {}) {
        super(props);
        this.state = {
          value: ''
        };
      }

    render() {
        return (
            <div id = "container">
            <div id = "title"><h2>Enter an API Key</h2></div>
            <div id = "input">
                <Input onChange = {(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ value: e.target.value });
                }}></Input>
                <Link to = {{
                    pathname: '/sampleApp',
                    state: {
                        apiKey: this.state.value
                    }
                }}>
                    <Button type = "primary">Submit</Button>
                </Link>
            </div>
            </div>
        );
    }
}

export default Authentication;
