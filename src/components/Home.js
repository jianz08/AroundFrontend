import React, {useState, useEffect} from 'react';
import { Tabs, message, Row, Col, Button } from 'antd';
import axios from 'axios';

import SearchBar from './SearchBar';
import PhotoGallery from './PhotoGallery';
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from '../constants';
import CreatePostButton from './CreatePostButton';

const { TabPane } = Tabs;

function Home(props) {
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({type: SEARCH_KEY.all, keyword: ""});

    const handleSearch = (option) => {
        console.log('search option ->', option);
        const {type, keyword} = option;
        setSearchOption({type: type, keyword: keyword});
    }

    useEffect(()=> {
        //fetch data from the server
        // do search first time: didMount -> search:{type: all, keyword:""}
        // do search after the first time: didUpate -> search:{type:keyword/user, keyword:value}
        const { type, keyword } = searchOption;
        fetchPost(searchOption);
    }, [searchOption]);

    const fetchPost = (option) => {
        const {type, keyword} = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {//type === SEARCH_KEY.keyword
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }
        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                setPosts(res.data);//setPosts, useEffect不会再执行，因为dependency是searchOption
            }
        })
        .catch(err => {
            message.error("Fetch posts failed!")
            console.log("fetch posts failed: ", err.message);
        });
    };

    const renderPosts = (type) => {
        //为什么两个都会render？
        console.log(type)
        //case 1: no posts => display no data
        //case 2: type == image -> display images
        // case 3: type == video -> display videos
        if (!posts || posts.length === 0) {
            console.log('no data');
            return <div> No data!</div>;
        }
        if (type === 'image') {
            //console.log("image -> ", posts);
            //return "images";
            const imageArr = posts
            .filter(post=>post.type==="image")
            .map(image=> {
                return {
                    postId: image.id,
                    src: image.url,
                    user: image.user,
                    caption: image.message,
                    thumbnail: image.url,
                    thumbnailWidth: 300,
                    thumbnailHeight: 200
                };
            });
            return <PhotoGallery images={imageArr} />

        } else if (type === 'video') {
            console.log("video -> ", posts);
            //return "videos";
            return (
                <Row gutter={32}>
                    {posts.filter(post=>post.type === "video")
                    .map(post=>{
                        console.log('post',post)
                        return  (
                        <Col span={8} key={post.url}>
                            <video src={post.url} controls={true} className="video-block" />
                            <p>
                                {post.user}: {post.message}
                            </p>
                        </Col>
                        )
                    })}
                </Row>
                
            )
        }
    };
    //create new post后重新update post
    const showPost = type => {
        console.log("type -> ", type);
        setActiveTab(type);
        setTimeout(()=>{
            setSearchOption({type: SEARCH_KEY.all, keyword: ""});
        }, 3000);
    };
    //The setTimeout() method calls a function or evaluates an expression 
    //after a specified number of milliseconds.

    //const operations = <Button>Upload</Button>;
    const operations = <CreatePostButton onShowPost={showPost} />;

    return (
    <div className="home">
        <SearchBar handleSearch={handleSearch}/>
        <div className="display">
            <Tabs
                onChange={(key)=>setActiveTab(key)}
                defaultActiveKey="image"
                activeKey={activeTab}
                tabBarExtraContent={operations}
            >
                <TabPane tab="Images" key="image">
                    {renderPosts("image")}
                </TabPane>
                <TabPane tab="Videos" key="video">
                    {renderPosts("video")}
                </TabPane>
            </Tabs>
        </div>
    </div>
    );
}

export default Home;