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
        <hr/>
        <img src={require('../../images/50.png').default}/>
        <img src={require('../../images/51.jpg').default}/>
        </div>
    )
}
export default ImagesList