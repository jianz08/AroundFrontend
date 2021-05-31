import { Form, message, Input, Button } from 'antd';
import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../constants';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
 };
 const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 16,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
 };


function Register(props) {
    const [form] = Form.useForm();//拿到form对象，antd-v3通过高阶组件拿到

    const onFinish = values => {
        console.log('Received values of form: ', values);
        const { username, password } = values;
        const opt = {
            method: 'POST',
            url: `${BASE_URL}/signup`,
            data:  {
                username: username,
                password: password,
            },
            headers: {'content-type': 'application/json'}
        };
        axios(opt)
            .then( response => {
                console.log(response);
                //case 1: registered success
                if (response.status === 200) {
                    message.success('Registeration succeed!')
                    //stack,相当于borwser前进，后退
                    //react router提供props里有history
                    props.history.push('/login');                    
                }
            })
            .catch(error => {
                console.log('register failed: ', error.message);
                message.success('Registration failed!');
                //throw new Error('Singup Failed')
            })
    }
    return (
        <Form 
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        className="register"
        >
            <Form.Item
            name="username"
            label="Username"
            rules={[
                {
                    required: true,
                    message: 'Please input your Username',
                }
            ]}>
                <Input />
            </Form.Item>
            <Form.Item
            name="password"
            label="Password"
            rules={[
                {
                    required: true,
                    message: 'Please input your Password',
                }
            ]}
            hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
             name="confirm"
             label="Confirm Password"
             dependencies={['password']}
             hasFeedback
             rules={[
                 {
                     required: true,
                     message: 'Please confirm your password!',
                 },
                 ({ getFieldValue }) => ({
                     validator(rule, value) {
                         if (!value || getFieldValue('password') === value) {
                             return Promise.resolve();
                         }
                         return Promise.reject('The two passwords that you entered do not match!');
                     },
                 }),
             ]}
         >
             <Input.Password />
         </Form.Item>
         <Form.Item {...tailFormItemLayout}>
             <Button type="primary" htmlType="submit" className="register-btn">
                 Register
             </Button>
         </Form.Item>
        </Form>
    )
}

export default Register;