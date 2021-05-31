import React, { Component } from 'react';
import { message, Button, Modal } from 'antd';
import axios from 'axios';
import { PostForm } from './PostForm';

import { TOKEN_KEY, BASE_URL } from '../constants';


class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    }
    //visible: show Modal
    //confirmLoading: the loading visual effect for OK button 

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = () => {
        console.log(this.postForm);
        this.setState({
            confirmLoading: true
        });
        //get form data and validate
        this.postForm
        .validateFields()
        .then(form=>{
            //uploadPost is an array
            //目前我们只支持一个文件上传,uploadPost[0]
            console.log(form);
            const { description, uploadPost } = form;
            const { type, originFileObj } = uploadPost[0];
            const postType = type.match(/^(image|video)/g)[0];//匹配image,video
            if (postType) {
                let formData = new FormData();
                formData.append("message", description);
                formData.append("media_file", originFileObj);
                const opt = {
                    method: "POST",
                    url: `${BASE_URL}/upload`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                    },
                    data: formData
                };            
                axios(opt)
                .then(res=>{
                    if (res.status === 200) {
                        message.success("The image/video is uploaded!");
                        this.postForm.resetFields();
                        this.handleCancel();
                        this.props.onShowPost(postType);
                        this.setState({confirmLoading: false});
                    }
                })
                .catch(err=>{
                    console.log("Upload image/video failed: ", err.message);
                    message.error("Failed to upload image/video!");
                    this.setState({confirmLoading: false});
                });
            }
        })
        .catch(err=>{
            console.log("err in validate form -> ", err);
        });    
    };

    handleCancel = () => {
        console.log("Clicked cancel button");
        this.setState({
            visible: false
        });
    };
    
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onText="Create"
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <PostForm ref={(refInstance)=>(this.postForm = refInstance)}/>
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;