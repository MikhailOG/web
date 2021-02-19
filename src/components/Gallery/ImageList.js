import React from 'react'
import ImageCard from './ImageCard';

const ImagesList = (props) => {
    function importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
      }
      const images = importAll(require.context('../../images/gallery', false, /\.(png|jpe?g|svg)$/));
      let sortedKeys = Object.keys(images).sort((a,b) => Number(a.substring(0, a.indexOf('.'))) - Number(b.substring(0, b.indexOf('.'))));
    return (
        <div className="images-list">
        {sortedKeys.map((imgKey, index) => <ImageCard key={index} img={images[imgKey].default}/>)}
        </div>
    )
}
export default ImagesList