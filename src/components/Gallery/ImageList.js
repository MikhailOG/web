import React from 'react'
import ImageCard from './ImageCard';

const ImagesList = (props) => {
    let imgArr = [];
    for (let i = 1; i < 50; i++) {
        imgArr.push(i)
    }
    return (
        <div className="images-list">
        {imgArr.map(imgIndex => <ImageCard key={imgIndex} index={imgIndex}/>)}
        </div>
    )
}
export default ImagesList