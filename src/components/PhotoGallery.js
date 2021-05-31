import { Button, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Gallery from 'react-grid-gallery';
import { BASE_URL, TOKEN_KEY } from '../constants';
import PropTypes from 'prop-types';

import { DeleteOutlined } from '@ant-design/icons';

const captionStyle = {
    backgroundColor: "rgba(0,0,0,0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

//加个边框
const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
}

function PhotoGallery(props) {

    const [images, setImages] = useState(props.images);
    const [curImgIdx, setCurImgIndx] = useState(0);

    const imageArr = images.map(image=>{
        //加上customOverlay
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        }
    });
    const onDeleteImage = () => {
        if (window.confirm(`Are you sure you want to delete this image?`)) {
            const curImg = images[curImgIdx];
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            console.log("delete image ", newImageArr);
            //inform the server to delete the image
            // if deleted, setState => images
            const opt = {
                method: 'DELETE',
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };
            axios(opt)
            .then(res=>{
                console.log('delete result ->', res);
                // case 1: success
                if (res.status === 200) {
                    // step 1: set state
                    setImages(newImageArr);
                }
            })
            .catch(err => {
                //case 2: fail
                message.error('Fetch posts failed!')
                console.log('Fetch posts failed: ', err.message);
            })
        }
    }

    const onCurrentImageChange = index => {
        console.log('curIndx', index);
        setCurImgIndx(index);
    }

    //当props.images变化时， update state
    useEffect(()=> {
        setImages(props.images)
    },[props.images])


    return (
        <div style={wrapperStyle}>
            <Gallery 
                images={imageArr}    
                enableImageSelection={false}
                backdropClosesModal={true}
                currentImageWillChange={onCurrentImageChange}
                customControls={[
                    <Button style={{marginTop: "10px", marginLeft: "5px"}}
                        key="deleteImage"
                        type="primary"
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={onDeleteImage}
                    >Delete Image</Button>
                ]} 
            />     
        </div>
    );
}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail:PropTypes.string.isRequired,
            thumbnailWidth:PropTypes.number.isRequired,
            thumbnailHeight:PropTypes.number.isRequired, 
        })
    ).isRequired
};

export default PhotoGallery;