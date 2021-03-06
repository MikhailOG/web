import React, { Component } from 'react'
import ImageCard from './ImageCard';
import ZoomedImage from './ZoomedImage';
import LayoutContext from '../../context/layout-context';
import Grip from './Grip';
import { convertRemToPixels } from '../../Scripts/convertRemToPixels';
import { connect } from 'react-redux';

class ImagesList extends Component {
    constructor(props) {
        super(props);
        this.imagesList = React.createRef();
    }
    state = {
        images: {},
        sortedImages: [],
        zoomedImage: null
    }
    static contextType = LayoutContext;
    componentDidMount() {
        const images = this.importAll(require.context('../../images/gallery', false, /\.(png|jpe?g|svg)$/));
        let sortedKeys = Object.keys(images).sort((a,b) => Number(a.substring(0, a.indexOf('.'))) - Number(b.substring(0, b.indexOf('.'))));
        this.setState({ images: images, sortedImages: sortedKeys });
    }
    // componentDidUpdate() {
    //     console.log(this.props.showBackdrop)
    //     if (this.state.zoomedImage && !this.props.showBackdrop) {
    //         this.setState({ zoomedImage: null});
    //     }
    // }
    importAll(r) {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    }
    imageClickedHandler = (image, imgKey) => {
        this.context.toggleBackdrop();
        this.setState({ zoomedImage: {image: image, imgKey: imgKey}});
    }
    // getZoomedImageHeight = (zoomedImageRef) => {
    //     let zoomedImage = zoomedImageRef.current;
    //     let windowHeight = this.context.windowHeight;
    //     console.log(getComputedStyle(zoomedImage).height)
    //     this.setState({zoomedImageMaxHeight: 0.8 * windowHeight, zoomedImageHeight: getComputedStyle(zoomedImage).height});
    // }
    prewImage = () => {
        let dotIndex = this.state.zoomedImage.imgKey.indexOf('.');
        let index = Number(this.state.zoomedImage.imgKey.slice(0, dotIndex));
        if (index>1) index--;
        else index = 49;
        index = String(index);
        let newImgKey = index.concat('', this.state.zoomedImage.imgKey.substr(dotIndex));
        this.setState({ zoomedImage: {image:this.state.images[newImgKey].default , imgKey: newImgKey}});
    }
    nextImage = () => {
        let dotIndex = this.state.zoomedImage.imgKey.indexOf('.');
        let index = Number(this.state.zoomedImage.imgKey.slice(0, dotIndex));
        if (index<49) index++;
        else index = 1;
        index = String(index);
        let newImgKey = index.concat('', this.state.zoomedImage.imgKey.substr(dotIndex));
        this.setState({ zoomedImage: {image:this.state.images[newImgKey].default , imgKey: newImgKey}});
    }
    render() {
        let gripStyle = {
            top: this.context.windowHeight/2 - convertRemToPixels(3) + 'px'
        }
        setTimeout(() => {
            if (this.state.zoomedImage && !this.props.showBackdrop) {
                this.setState({ zoomedImage: null});
            }
        }, 10)

        return (
            <React.Fragment>
                {this.state.zoomedImage?<React.Fragment>
                    <ZoomedImage
                    window={{height: this.context.windowHeight, width: this.context.windowWidth}}
                    getZoomedImageHeight={this.getZoomedImageHeight}
                    zoomedImage={this.state.zoomedImage.image}
                    //zoomedImageWidth={this.imagesList.current.clientWidth}
                    />
                    <Grip clicked={this.prewImage} style={gripStyle} direction={'left'}/>
                    <Grip clicked={this.nextImage} style={gripStyle} direction={'right'}/>
                </React.Fragment>:null}
                <div className="images-list" ref={this.imagesList}>
                    {this.state.sortedImages.map((imgKey, index) => <ImageCard 
                        key={index} 
                        imgIndex={index}
                        imgKey={imgKey}
                        img={this.state.images[imgKey].default}
                        imageClickedHandler={this.imageClickedHandler}
                        />)}
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        showBackdrop: state.layout.showBackdrop
    };
};

export default connect(mapStateToProps)(ImagesList)