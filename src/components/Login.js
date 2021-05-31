import { Input, message, Form, Button } from 'antd';
import axios from 'axios';
import React from 'react';
import { Link } from "react-router-dom"
import { UserOutlined, LockOutlined} from '@ant-design/icons';

import { BASE_URL } from '../constants';

function Login(props) {
    const {handleLoggedIn} = props;

    const onFinish = (values) => {
        // get login info
        const { username, password } = values;
        // send login info to the server
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                username: username,
                password: password,
            },
            headers: {"Content-Type": "application/json"}
        };
        axios(opt)
            .then(res => {
                if (res.status === 200) {
                    console.log(res);
                    const { data } = res;//res.data is the token
                    handleLoggedIn(data);
                    message.success("Login succeed!");
                }
            })
            .catch(err => {
                console.log("login failed: ", err.message);
                message.error("Login failed!");
            });
    };
    return (
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Please input you Username!"
                    }
                ]}>
                <Input
                prefix={<UserOutlined className="site-form-item-icon"/>}
                placeholder="Username"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input you Password!"
                    }
                ]}>
                <Input
                prefix={<LockOutlined className="site-form-item-icon"/>}
                placeholder="Password"
                type="password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <Link to="/register">register now!</Link>
            </Form.Item>
        </Form>
    )
}

export default Login;

