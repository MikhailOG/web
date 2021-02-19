import React, { Component } from 'react'
import ImageCard from './ImageCard';

class ImagesList extends Component {
    state = {
        images: {},
        sortedImages: [],
        zoomedImage: null
    }
    componentDidMount() {
        const images = this.importAll(require.context('../../images/gallery', false, /\.(png|jpe?g|svg)$/));
        let sortedKeys = Object.keys(images).sort((a,b) => Number(a.substring(0, a.indexOf('.'))) - Number(b.substring(0, b.indexOf('.'))));
        this.setState({ images: images, sortedImages: sortedKeys});
    }
    importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
      }
    imageClickedHandler = (image) => {
        this.setState({ zoomedImage: image})
    }
      render() {
        return (
            <React.Fragment>
                {this.state.zoomedImage?<div className="image-preview">
                    <img 
                        src={this.state.zoomedImage} 
                        alt={'zoomed image'}
                    />
                </div>:null}
                <div className="images-list">
                    {this.state.sortedImages.map((imgKey, index) => <ImageCard 
                        key={index} 
                        img={this.state.images[imgKey].default}
                        imageClickedHandler={this.imageClickedHandler}
                        />)}
                </div>
            </React.Fragment>
        )
      }

}
export default ImagesList