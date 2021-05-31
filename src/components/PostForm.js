import React, { forwardRef } from 'react';
import { Form, Upload, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export const PostForm = forwardRef((props, formRef) => {
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14}
    };
    //拿到上传对象
    //getValueFromEvent={normFile}
    const normFile = e => {
        console.log("upload event: ", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    return (
        <Form name="validate_other" {...formItemLayout} ref={formRef}>
            <Form.Item
                name="description"
                label="Message"
                rules={[
                    {
                        required: true,
                        message: "Please input your message!"
                    }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="Dragger">
                <Form.Item
                    name="uploadPost"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[
                        {
                            required: true,
                            message: "Please select an image/video!"
                        }                            
                    ]}
                >
                    <Upload.Dragger name="files" beforeUpload={()=>false}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
        </Form>
    );
});

//Form.item和Upload.Dragger的组合

//const { Dragger } = Upload;
//Dragger  是 Upload下的一个组件
//beforeUpload={()=>false}，关闭自动上传功能

//React.forwardRef
//PostForm = forwardRef((props, formRef) => {}
//<Form name="validate_other" {...formItemLayout} ref={formRef}>
//Ref forwarding is a technique for automatically passing a ref 
//through a component to one of its children. 

//PostForm是function组件，CreatePostButton是class组件，他们之间传Ref，我们这里用了forwardRef